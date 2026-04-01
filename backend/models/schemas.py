from typing import Optional

from pydantic import BaseModel


class RunRequest(BaseModel):
    url: str
    max_pages: int = 20


class SendEmailRequest(BaseModel):
    recipient_email: str
    sender_name: str
    use_gmail: bool = True


class RunRecord(BaseModel):
    id: str
    url: str
    company_name: Optional[str] = None
    industry: Optional[str] = None
    fit_score: Optional[str] = None
    subject: Optional[str] = None
    email_path: Optional[str] = None
    analysis_path: Optional[str] = None
    timestamp: str
    recipient_email: Optional[str] = None
    gmail_message_id: Optional[str] = None
    email_sent_at: Optional[str] = None
    email_replied: bool = False
    email_delivered: bool = False
    email_opened: bool = False
    email_reply_count: int = 0
    last_reply_at: Optional[str] = None
    last_checked_at: Optional[str] = None


class HistoryResponse(BaseModel):
    runs: list[RunRecord]


class PipelineStatus(BaseModel):
    is_running: bool
    current_url: Optional[str] = None
