import asyncio
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from database import (
    create_email_tracking,
    delete_run,
    get_all_runs,
    get_run,
    get_stats,
    get_tracking_by_run,
    init_db,
    update_run_email_details,
)
from gmail_integration import send_email as gmail_send_email
from models.schemas import HistoryResponse, PipelineStatus, RunRequest, SendEmailRequest
from pipeline import run_full_pipeline
from reply_checker import ReplyChecker

app = FastAPI()
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
LOGO_PATH = BASE_DIR / "assets" / "logo.png"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pending_runs = {}
pipeline_running = False
current_url = None
stop_requested = False


def _personalize_email_html(html_body: str, sender_name: str) -> str:
    """Apply lightweight sender-name substitution to generated email HTML."""

    if not sender_name.strip():
        return html_body

    return html_body.replace("Sales Team", sender_name.strip())


@app.on_event("startup")
async def on_startup():
    init_db()
    app.state.reply_checker = ReplyChecker(interval_minutes=30)
    app.state.reply_checker.start()
    logger.info("Reply checker started - checking every 30 min")


@app.on_event("shutdown")
async def on_shutdown():
    reply_checker = getattr(app.state, "reply_checker", None)
    if reply_checker:
        reply_checker.shutdown(wait=False)


@app.get("/")
async def health():
    return {"message": "ATC PIPELINE --online"}


@app.post("/run")
async def run_pipeline(request: RunRequest):
    global pipeline_running

    if pipeline_running:
        return JSONResponse(
            status_code=400,
            content={"error": "Pipeline already running"},
        )

    run_id = str(uuid.uuid4())
    pending_runs[run_id] = {
        "url": request.url,
        "max_pages": request.max_pages,
    }

    return {
        "run_id": run_id,
        "url": request.url,
        "ws_url": f"ws://localhost:8000/ws/{run_id}",
    }


@app.get("/status", response_model=PipelineStatus)
async def get_status():
    return PipelineStatus(
        is_running=pipeline_running,
        current_url=current_url,
    )


@app.post("/stop")
async def stop_pipeline():
    global stop_requested
    stop_requested = True
    return {"message": "Pipeline will stop after current run completes"}


@app.get("/history", response_model=HistoryResponse)
async def get_history():
    return HistoryResponse(runs=get_all_runs())


@app.get("/stats")
async def get_stats_summary():
    return get_stats()


@app.get("/run/{run_id}")
async def get_run_by_id(run_id: str):
    run = get_run(run_id)
    if not run:
        return JSONResponse(status_code=404, content={"error": "Run not found"})
    return run


@app.delete("/run/{run_id}")
async def delete_run_by_id(run_id: str):
    deleted = delete_run(run_id)
    if not deleted:
        return JSONResponse(status_code=404, content={"error": "Run not found"})
    return {"message": "Run deleted successfully"}


@app.get("/email/{run_id}")
async def get_email(run_id: str):
    run = get_run(run_id)
    if not run:
        return JSONResponse(status_code=404, content={"error": "Run not found"})

    email_path = run.get("email_path")
    if not email_path or not os.path.exists(email_path):
        return JSONResponse(status_code=404, content={"error": "Email file not found"})

    return FileResponse(email_path, media_type="text/html")


@app.get("/analysis/{run_id}")
async def get_analysis(run_id: str):
    run = get_run(run_id)
    if not run:
        return JSONResponse(status_code=404, content={"error": "Run not found"})

    analysis_path = run.get("analysis_path")
    if not analysis_path or not os.path.exists(analysis_path):
        return JSONResponse(status_code=404, content={"error": "Analysis file not found"})

    with open(analysis_path, "r", encoding="utf-8") as file:
        return json.load(file)


@app.post("/send-email/{run_id}")
async def send_email_for_run(run_id: str, request: SendEmailRequest):
    run = get_run(run_id)
    if not run:
        return JSONResponse(status_code=404, content={"error": "Run not found"})

    if run.get("gmail_message_id"):
        return JSONResponse(
            status_code=400,
            content={"error": "Email already sent for this run"},
        )

    if not request.use_gmail:
        return JSONResponse(
            status_code=400,
            content={"error": "Only Gmail sending is currently supported"},
        )

    email_path = run.get("email_path")
    if not email_path or not os.path.exists(email_path):
        return JSONResponse(status_code=404, content={"error": "Email file not found"})

    if not LOGO_PATH.exists():
        return JSONResponse(
            status_code=500,
            content={"error": f"Logo file not found at {LOGO_PATH}"},
        )

    try:
        with open(email_path, "r", encoding="utf-8") as file:
            html_body = file.read()
    except OSError as error:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to load email HTML: {error}"},
        )

    subject = run.get("subject") or "ATC Outreach"
    personalized_html = _personalize_email_html(html_body, request.sender_name)
    send_response = await asyncio.to_thread(
        gmail_send_email,
        request.recipient_email,
        subject,
        personalized_html,
        str(LOGO_PATH),
    )

    if not send_response["success"]:
        return JSONResponse(
            status_code=500,
            content={"error": send_response["error"]},
        )

    sent_at = datetime.now(timezone.utc).isoformat()
    gmail_message_id = send_response["message_id"]

    try:
        updated = update_run_email_details(
            run_id=run_id,
            recipient_email=request.recipient_email,
            gmail_message_id=gmail_message_id,
            email_sent_at=sent_at,
            email_replied=False,
        )
        if not updated:
            return JSONResponse(
                status_code=500,
                content={"error": "Failed to persist sent email metadata"},
            )

        create_email_tracking(
            {
                "id": str(uuid.uuid4()),
                "run_id": run_id,
                "gmail_message_id": gmail_message_id,
                "recipient_email": request.recipient_email,
                "sent_at": sent_at,
                "delivered": 0,
                "opened": 0,
                "replied": 0,
                "reply_count": 0,
                "last_reply_at": None,
                "last_checked_at": sent_at,
            }
        )
    except Exception as error:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to save email tracking: {error}"},
        )

    return {
        "success": True,
        "gmail_message_id": gmail_message_id,
        "sent_at": sent_at,
    }


@app.get("/email-status/{run_id}")
async def get_email_status(run_id: str):
    run = get_run(run_id)
    if not run:
        return JSONResponse(status_code=404, content={"error": "Run not found"})

    tracking_rows = get_tracking_by_run(run_id)
    latest_tracking = tracking_rows[0] if tracking_rows else None

    return {
        "sent": bool(run.get("gmail_message_id")),
        "delivered": bool(latest_tracking.get("delivered")) if latest_tracking else False,
        "replied": bool(latest_tracking.get("replied")) if latest_tracking else bool(run.get("email_replied")),
        "reply_count": int(latest_tracking.get("reply_count", 0)) if latest_tracking else 0,
    }


@app.websocket("/ws/{run_id}")
async def websocket_pipeline(websocket: WebSocket, run_id: str):
    global pipeline_running, current_url, stop_requested

    await websocket.accept()

    run_request = pending_runs.pop(run_id, None)
    if not run_request:
        await websocket.send_json({
            "status": "error",
            "message": f"No pending run found for run_id: {run_id}",
        })
        await websocket.close()
        return

    url = run_request["url"]
    max_pages = run_request.get("max_pages", 20)

    pipeline_running = True
    current_url = url
    stop_requested = False

    await websocket.send_json({
        "status": "connected",
        "run_id": run_id,
        "message": f"Starting pipeline for {url}",
    })

    async def send_event(payload: dict):
        try:
            await websocket.send_json(payload)
        except WebSocketDisconnect:
            pass

    try:
        await run_full_pipeline(url, run_id, send_event, max_pages=max_pages)
    finally:
        pipeline_running = False
        current_url = None
        stop_requested = False
        await asyncio.sleep(0)
        await websocket.close()
