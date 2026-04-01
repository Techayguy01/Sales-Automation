"""Background worker for checking Gmail replies on tracked outreach emails."""

from __future__ import annotations

import json
import logging
import os
import threading
from datetime import datetime, timezone
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen

from apscheduler.schedulers.background import BackgroundScheduler

from database import get_all_unreplied, update_reply_status
from gmail_integration import get_reply_status


logger = logging.getLogger(__name__)


class ReplyChecker:
    """Periodic background checker for Gmail thread replies."""

    def __init__(
        self,
        interval_minutes: int = 30,
        webhook_url: str | None = None,
    ) -> None:
        self.interval_minutes = interval_minutes
        self.webhook_url = webhook_url or os.environ.get("REPLY_CHECKER_WEBHOOK_URL")
        self.scheduler = BackgroundScheduler(timezone="UTC")
        self._lock = threading.Lock()
        self._started = False

    def start(self) -> None:
        """Start the background scheduler if it is not already running."""

        if self._started:
            return

        self.scheduler.add_job(
            self.check_replies,
            trigger="interval",
            minutes=self.interval_minutes,
            id="reply-checker",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
            misfire_grace_time=300,
        )
        self.scheduler.start()
        self._started = True

    def shutdown(self, wait: bool = False) -> None:
        """Stop the scheduler cleanly if it is running."""

        if not self._started:
            return

        self.scheduler.shutdown(wait=wait)
        self._started = False
        logger.info("Reply checker stopped")

    def check_replies(self) -> None:
        """Check all unreplied tracked emails for Gmail replies."""

        if not self._lock.acquire(blocking=False):
            logger.info("Reply checker skipped because a previous cycle is still running")
            return

        try:
            tracking_rows = get_all_unreplied()
            logger.info("Reply checker scanning %s tracked emails", len(tracking_rows))

            for tracking_row in tracking_rows:
                try:
                    self._check_tracking_row(tracking_row)
                except Exception as error:
                    logger.exception(
                        "Unexpected error while checking run %s: %s",
                        tracking_row.get("run_id"),
                        error,
                    )
        finally:
            self._lock.release()

    def _check_tracking_row(self, tracking_row: dict[str, Any]) -> None:
        """Check one tracked email and persist the latest reply state."""

        gmail_message_id = tracking_row.get("gmail_message_id")
        if not gmail_message_id:
            return

        checked_at = datetime.now(timezone.utc).isoformat()
        reply_status = get_reply_status(gmail_message_id)

        if not reply_status["success"]:
            logger.warning(
                "Reply check failed for Gmail message %s: %s",
                gmail_message_id,
                reply_status["error"],
            )
            update_reply_status(
                gmail_message_id,
                {"last_checked_at": checked_at},
            )
            return

        last_reply_date = reply_status["last_reply_date"]
        reply_payload = {
            "replied": reply_status["replied"],
            "reply_count": reply_status["reply_count"],
            "last_reply_at": last_reply_date.isoformat() if last_reply_date else None,
            "last_checked_at": checked_at,
        }
        update_reply_status(gmail_message_id, reply_payload)

        if reply_status["replied"]:
            logger.info(
                "Reply detected for run %s (gmail_message_id=%s, count=%s)",
                tracking_row.get("run_id"),
                gmail_message_id,
                reply_status["reply_count"],
            )
            self._send_webhook_notification(tracking_row, reply_status)

    def _send_webhook_notification(
        self,
        tracking_row: dict[str, Any],
        reply_status: dict[str, Any],
    ) -> None:
        """POST a webhook payload when a reply is detected, if configured."""

        if not self.webhook_url:
            return

        payload = {
            "event": "email.reply_detected",
            "run_id": tracking_row.get("run_id"),
            "gmail_message_id": tracking_row.get("gmail_message_id"),
            "recipient_email": tracking_row.get("recipient_email"),
            "reply_count": reply_status.get("reply_count", 0),
            "last_reply_at": (
                reply_status["last_reply_date"].isoformat()
                if reply_status.get("last_reply_date")
                else None
            ),
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }
        request = Request(
            self.webhook_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urlopen(request, timeout=10):
                logger.info(
                    "Reply webhook sent for Gmail message %s",
                    tracking_row.get("gmail_message_id"),
                )
        except URLError as error:
            logger.warning(
                "Reply webhook failed for Gmail message %s: %s",
                tracking_row.get("gmail_message_id"),
                error,
            )
