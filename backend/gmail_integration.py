"""Google Workspace Gmail integration helpers for ATC outreach workflows."""

from __future__ import annotations

import base64
import mimetypes
import os
import pickle
from datetime import datetime, timezone
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import parseaddr, parsedate_to_datetime
from pathlib import Path
from typing import Any, Literal, TypedDict, cast

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
]
USER_ID = "me"
LABEL_PREFIX = "ATC-Outreach-"

BASE_DIR = Path(__file__).resolve().parent


def _resolve_config_path(env_var: str, default_filename: str) -> Path:
    """Resolve config file paths from env vars or backend-local defaults."""

    configured_path = Path(os.environ.get(env_var, default_filename))
    if configured_path.is_absolute():
        return configured_path
    return (BASE_DIR / configured_path).resolve()


CREDENTIALS_PATH = _resolve_config_path("GOOGLE_CREDENTIALS_PATH", "credentials.json")
TOKEN_PATH = _resolve_config_path("GOOGLE_TOKEN_PATH", "token.pickle")


class ErrorResponse(TypedDict):
    """Common error response payload."""

    success: Literal[False]
    error: str


class AuthenticationSuccessResponse(TypedDict):
    """Successful authentication response."""

    success: Literal[True]
    service: Any
    email_address: str


class SendEmailSuccessResponse(TypedDict):
    """Successful email send response."""

    success: Literal[True]
    message_id: str
    thread_id: str


class ReplySummary(TypedDict):
    """Metadata about a reply in a Gmail thread."""

    message_id: str
    thread_id: str
    from_name: str
    from_email: str
    subject: str
    received_at: datetime


class ThreadRepliesSuccessResponse(TypedDict):
    """Successful thread reply lookup response."""

    success: Literal[True]
    message_id: str
    thread_id: str
    replies: list[ReplySummary]


class MarkTrackedSuccessResponse(TypedDict):
    """Successful tracking label response."""

    success: Literal[True]
    message_id: str
    thread_id: str
    label_id: str
    label_name: str


class ReplyStatusSuccessResponse(TypedDict):
    """Successful reply status response."""

    success: Literal[True]
    replied: bool
    reply_count: int
    last_reply_date: datetime | None


AuthenticationResponse = AuthenticationSuccessResponse | ErrorResponse
SendEmailResponse = SendEmailSuccessResponse | ErrorResponse
ThreadRepliesResponse = ThreadRepliesSuccessResponse | ErrorResponse
MarkTrackedResponse = MarkTrackedSuccessResponse | ErrorResponse
ReplyStatusResponse = ReplyStatusSuccessResponse | ErrorResponse


def _error_response(error: str) -> ErrorResponse:
    """Build a consistent error payload."""

    return {"success": False, "error": error}


def _load_credentials() -> Credentials | None:
    """Load persisted OAuth credentials from disk if available."""

    if not TOKEN_PATH.exists():
        return None

    with TOKEN_PATH.open("rb") as token_file:
        return cast(Credentials | None, pickle.load(token_file))


def _save_credentials(credentials: Credentials) -> None:
    """Persist OAuth credentials to disk for reuse."""

    TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
    with TOKEN_PATH.open("wb") as token_file:
        pickle.dump(credentials, token_file)


def _extract_header(headers: list[dict[str, str]], header_name: str) -> str:
    """Return a message header value by name."""

    for header in headers:
        if header.get("name", "").lower() == header_name.lower():
            return header.get("value", "")
    return ""


def _parse_gmail_datetime(
    internal_date_ms: str | None,
    headers: list[dict[str, str]] | None = None,
) -> datetime | None:
    """Parse Gmail timestamps into timezone-aware datetimes."""

    if internal_date_ms:
        try:
            return datetime.fromtimestamp(int(internal_date_ms) / 1000, tz=timezone.utc)
        except (TypeError, ValueError):
            pass

    if headers:
        raw_date = _extract_header(headers, "Date")
        if raw_date:
            try:
                parsed_date = parsedate_to_datetime(raw_date)
                if parsed_date.tzinfo is None:
                    return parsed_date.replace(tzinfo=timezone.utc)
                return parsed_date.astimezone(timezone.utc)
            except (TypeError, ValueError, IndexError):
                return None

    return None


def _get_authenticated_email(service: Any) -> str:
    """Fetch the authenticated Gmail address."""

    profile = service.users().getProfile(userId=USER_ID).execute()
    return profile.get("emailAddress", "").strip().lower()


def _build_message_payload(
    to_email: str,
    subject: str,
    html_body: str,
    logo_path: str,
) -> str:
    """Create a base64url-encoded Gmail raw message payload."""

    logo_file = Path(logo_path)
    if not logo_file.is_file():
        raise FileNotFoundError(f"Logo file not found: {logo_file}")

    mime_type, _ = mimetypes.guess_type(logo_file.name)
    if not mime_type or not mime_type.startswith("image/"):
        raise ValueError(f"Unsupported logo content type for file: {logo_file.name}")

    main_type, sub_type = mime_type.split("/", maxsplit=1)

    message = MIMEMultipart("related")
    message["To"] = to_email
    message["Subject"] = subject

    alternative = MIMEMultipart("alternative")
    alternative.attach(MIMEText(html_body, "html", "utf-8"))
    message.attach(alternative)

    with logo_file.open("rb") as image_file:
        logo_part = MIMEBase(main_type, sub_type)
        logo_part.set_payload(image_file.read())

    encoders.encode_base64(logo_part)
    logo_part.add_header("Content-ID", "<logo>")
    logo_part.add_header("Content-Disposition", f'inline; filename="{logo_file.name}"')
    message.attach(logo_part)

    return base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")


def _ensure_tracking_label(service: Any, run_id: str) -> tuple[str, str]:
    """Return an existing label ID or create a new outreach tracking label."""

    label_name = f"{LABEL_PREFIX}{run_id}"
    labels_response = service.users().labels().list(userId=USER_ID).execute()
    labels = labels_response.get("labels", [])

    for label in labels:
        if label.get("name") == label_name:
            return label["id"], label_name

    label_payload = {
        "name": label_name,
        "labelListVisibility": "labelShow",
        "messageListVisibility": "show",
    }
    created_label = service.users().labels().create(
        userId=USER_ID,
        body=label_payload,
    ).execute()
    return created_label["id"], label_name


def authenticate() -> AuthenticationResponse:
    """Authenticate with Gmail via OAuth2 and return an API service instance."""

    try:
        credentials = _load_credentials()

        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
            _save_credentials(credentials)

        if not credentials or not credentials.valid:
            if not CREDENTIALS_PATH.exists():
                return _error_response(
                    f"OAuth credentials file not found at {CREDENTIALS_PATH}"
                )

            flow = InstalledAppFlow.from_client_secrets_file(
                str(CREDENTIALS_PATH),
                SCOPES,
            )
            credentials = flow.run_local_server(port=0)
            _save_credentials(credentials)

        service = build("gmail", "v1", credentials=credentials)
        email_address = _get_authenticated_email(service)
        return {
            "success": True,
            "service": service,
            "email_address": email_address,
        }
    except HttpError as error:
        return _error_response(f"Gmail authentication failed: {error}")
    except Exception as error:
        return _error_response(f"Gmail authentication failed: {error}")


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    logo_path: str,
) -> SendEmailResponse:
    """Send an HTML email with an inline logo addressable as ``cid:logo``."""

    auth_response = authenticate()
    if not auth_response["success"]:
        return auth_response

    try:
        raw_message = _build_message_payload(to_email, subject, html_body, logo_path)
        sent_message = (
            auth_response["service"]
            .users()
            .messages()
            .send(userId=USER_ID, body={"raw": raw_message})
            .execute()
        )
        return {
            "success": True,
            "message_id": sent_message["id"],
            "thread_id": sent_message["threadId"],
        }
    except HttpError as error:
        return _error_response(f"Failed to send Gmail message: {error}")
    except Exception as error:
        return _error_response(f"Failed to send Gmail message: {error}")


def get_thread_replies(message_id: str) -> ThreadRepliesResponse:
    """Return replies in the Gmail thread for a sent Gmail API message ID."""

    auth_response = authenticate()
    if not auth_response["success"]:
        return auth_response

    service = auth_response["service"]
    my_email = auth_response["email_address"]

    try:
        original_message = service.users().messages().get(
            userId=USER_ID,
            id=message_id,
            format="metadata",
            metadataHeaders=["Date", "From", "Subject"],
        ).execute()
        thread_id = original_message["threadId"]
        original_date = _parse_gmail_datetime(
            original_message.get("internalDate"),
            original_message.get("payload", {}).get("headers", []),
        )

        thread = service.users().threads().get(
            userId=USER_ID,
            id=thread_id,
            format="metadata",
            metadataHeaders=["Date", "From", "Subject"],
        ).execute()

        replies: list[ReplySummary] = []
        for thread_message in thread.get("messages", []):
            if thread_message.get("id") == message_id:
                continue

            headers = thread_message.get("payload", {}).get("headers", [])
            message_date = _parse_gmail_datetime(
                thread_message.get("internalDate"),
                headers,
            )

            if original_date and message_date and message_date <= original_date:
                continue

            from_header = _extract_header(headers, "From")
            from_name, from_email = parseaddr(from_header)
            normalized_from_email = from_email.strip().lower()

            if normalized_from_email == my_email:
                continue

            replies.append(
                {
                    "message_id": thread_message["id"],
                    "thread_id": thread_id,
                    "from_name": from_name,
                    "from_email": normalized_from_email,
                    "subject": _extract_header(headers, "Subject"),
                    "received_at": message_date or datetime.now(timezone.utc),
                }
            )

        replies.sort(key=lambda reply: reply["received_at"])
        return {
            "success": True,
            "message_id": message_id,
            "thread_id": thread_id,
            "replies": replies,
        }
    except HttpError as error:
        return _error_response(f"Failed to fetch Gmail thread replies: {error}")
    except Exception as error:
        return _error_response(f"Failed to fetch Gmail thread replies: {error}")


def mark_as_tracked(message_id: str, run_id: str) -> MarkTrackedResponse:
    """Add or create an ``ATC-Outreach-{run_id}`` label on the message thread."""

    auth_response = authenticate()
    if not auth_response["success"]:
        return auth_response

    service = auth_response["service"]

    try:
        message = service.users().messages().get(
            userId=USER_ID,
            id=message_id,
            format="minimal",
        ).execute()
        thread_id = message["threadId"]
        label_id, label_name = _ensure_tracking_label(service, run_id)

        service.users().threads().modify(
            userId=USER_ID,
            id=thread_id,
            body={"addLabelIds": [label_id]},
        ).execute()

        return {
            "success": True,
            "message_id": message_id,
            "thread_id": thread_id,
            "label_id": label_id,
            "label_name": label_name,
        }
    except HttpError as error:
        return _error_response(f"Failed to mark Gmail thread as tracked: {error}")
    except Exception as error:
        return _error_response(f"Failed to mark Gmail thread as tracked: {error}")


def get_reply_status(message_id: str) -> ReplyStatusResponse:
    """Return reply status metadata for a previously sent Gmail message."""

    replies_response = get_thread_replies(message_id)
    if not replies_response["success"]:
        return replies_response

    replies = replies_response["replies"]
    last_reply_date = replies[-1]["received_at"] if replies else None

    return {
        "success": True,
        "replied": bool(replies),
        "reply_count": len(replies),
        "last_reply_date": last_reply_date,
    }


if __name__ == "__main__":
    auth_response = authenticate()
    if auth_response["success"]:
        print(
            "Gmail authentication successful for "
            f"{auth_response['email_address']}. Token saved to {TOKEN_PATH}."
        )
    else:
        print(f"Gmail authentication failed: {auth_response['error']}")
        raise SystemExit(1)
