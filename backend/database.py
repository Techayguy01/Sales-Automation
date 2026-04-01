import sqlite3
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database.db"

RUN_COLUMNS = (
    "id",
    "url",
    "company_name",
    "industry",
    "fit_score",
    "subject",
    "email_path",
    "analysis_path",
    "timestamp",
    "recipient_email",
    "gmail_message_id",
    "email_sent_at",
    "email_replied",
    "email_delivered",
    "email_opened",
    "email_reply_count",
    "last_reply_at",
    "last_checked_at",
)
RUNS_MIGRATION_COLUMNS = {
    "recipient_email": "TEXT",
    "gmail_message_id": "TEXT",
    "email_sent_at": "TEXT",
    "email_replied": "BOOLEAN DEFAULT 0",
}
EMAIL_TRACKING_COLUMNS = (
    "id",
    "run_id",
    "gmail_message_id",
    "recipient_email",
    "sent_at",
    "delivered",
    "opened",
    "replied",
    "reply_count",
    "last_reply_at",
    "last_checked_at",
)


def _get_connection() -> sqlite3.Connection:
    """Create a SQLite connection with dict-like row access."""

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def _table_exists(connection: sqlite3.Connection, table_name: str) -> bool:
    """Return True when the given table already exists."""

    row = connection.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = ?
        """,
        (table_name,),
    ).fetchone()
    return row is not None


def _get_table_columns(connection: sqlite3.Connection, table_name: str) -> set[str]:
    """Return the current column names for a SQLite table."""

    rows = connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    return {row["name"] for row in rows}


def _migrate_runs_table(connection: sqlite3.Connection) -> None:
    """Ensure older runs tables gain the email tracking columns."""

    existing_columns = _get_table_columns(connection, "runs")

    for column_name, column_definition in RUNS_MIGRATION_COLUMNS.items():
        if column_name not in existing_columns:
            connection.execute(
                f"ALTER TABLE runs ADD COLUMN {column_name} {column_definition}"
            )


def _create_email_tracking_table(connection: sqlite3.Connection) -> None:
    """Create the email_tracking table and supporting indexes."""

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS email_tracking (
            id TEXT PRIMARY KEY,
            run_id TEXT NOT NULL,
            gmail_message_id TEXT UNIQUE,
            recipient_email TEXT NOT NULL,
            sent_at TEXT NOT NULL,
            delivered BOOLEAN DEFAULT 0,
            opened BOOLEAN DEFAULT 0,
            replied BOOLEAN DEFAULT 0,
            reply_count INTEGER DEFAULT 0,
            last_reply_at TEXT,
            last_checked_at TEXT,
            FOREIGN KEY (run_id) REFERENCES runs(id)
        )
        """
    )
    connection.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_email_tracking_run_id
        ON email_tracking (run_id)
        """
    )
    connection.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_email_tracking_replied
        ON email_tracking (replied, last_checked_at)
        """
    )


def init_db() -> None:
    """Create and migrate database tables used by the backend."""

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with _get_connection() as connection:
        if not _table_exists(connection, "runs"):
            connection.execute(
                """
                CREATE TABLE runs (
                    id TEXT PRIMARY KEY,
                    url TEXT NOT NULL,
                    company_name TEXT,
                    industry TEXT,
                    fit_score TEXT,
                    subject TEXT,
                    email_path TEXT,
                    analysis_path TEXT,
                    timestamp TEXT,
                    recipient_email TEXT,
                    gmail_message_id TEXT,
                    email_sent_at TEXT,
                    email_replied BOOLEAN DEFAULT 0
                )
                """
            )
        else:
            _migrate_runs_table(connection)

        _create_email_tracking_table(connection)
        connection.commit()


def create_run(run_data: dict[str, Any]) -> None:
    """Insert one run record into the database."""

    with _get_connection() as connection:
        connection.execute(
            """
            INSERT INTO runs (
                id,
                url,
                company_name,
                industry,
                fit_score,
                subject,
                email_path,
                analysis_path,
                timestamp,
                recipient_email,
                gmail_message_id,
                email_sent_at,
                email_replied
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                run_data["id"],
                run_data["url"],
                run_data.get("company_name"),
                run_data.get("industry"),
                run_data.get("fit_score"),
                run_data.get("subject"),
                run_data.get("email_path"),
                run_data.get("analysis_path"),
                run_data.get("timestamp"),
                run_data.get("recipient_email"),
                run_data.get("gmail_message_id"),
                run_data.get("email_sent_at"),
                run_data.get("email_replied", 0),
            ),
        )
        connection.commit()


def create_email_tracking(tracking_data: dict[str, Any]) -> None:
    """Insert one email tracking record."""

    with _get_connection() as connection:
        connection.execute(
            """
            INSERT INTO email_tracking (
                id,
                run_id,
                gmail_message_id,
                recipient_email,
                sent_at,
                delivered,
                opened,
                replied,
                reply_count,
                last_reply_at,
                last_checked_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                tracking_data["id"],
                tracking_data["run_id"],
                tracking_data.get("gmail_message_id"),
                tracking_data["recipient_email"],
                tracking_data["sent_at"],
                tracking_data.get("delivered", 0),
                tracking_data.get("opened", 0),
                tracking_data.get("replied", 0),
                tracking_data.get("reply_count", 0),
                tracking_data.get("last_reply_at"),
                tracking_data.get("last_checked_at"),
            ),
        )
        connection.commit()


def update_run_email_details(
    run_id: str,
    recipient_email: str,
    gmail_message_id: str,
    email_sent_at: str,
    email_replied: bool = False,
) -> bool:
    """Persist sent email metadata back onto the run row."""

    with _get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE runs
            SET
                recipient_email = ?,
                gmail_message_id = ?,
                email_sent_at = ?,
                email_replied = ?
            WHERE id = ?
            """,
            (
                recipient_email,
                gmail_message_id,
                email_sent_at,
                int(email_replied),
                run_id,
            ),
        )
        connection.commit()

    return cursor.rowcount > 0


def update_reply_status(gmail_message_id: str, reply_data: dict[str, Any]) -> bool:
    """Update tracking and run rows when reply status changes."""

    with _get_connection() as connection:
        tracking_row = connection.execute(
            """
            SELECT run_id, delivered, opened, replied, reply_count, last_reply_at, last_checked_at
            FROM email_tracking
            WHERE gmail_message_id = ?
            """,
            (gmail_message_id,),
        ).fetchone()

        if not tracking_row:
            return False

        connection.execute(
            """
            UPDATE email_tracking
            SET
                delivered = ?,
                opened = ?,
                replied = ?,
                reply_count = ?,
                last_reply_at = ?,
                last_checked_at = ?
            WHERE gmail_message_id = ?
            """,
            (
                reply_data.get(
                    "delivered",
                    tracking_row["delivered"] if tracking_row["delivered"] is not None else 0,
                ),
                reply_data.get(
                    "opened",
                    tracking_row["opened"] if tracking_row["opened"] is not None else 0,
                ),
                reply_data.get(
                    "replied",
                    tracking_row["replied"] if tracking_row["replied"] is not None else 0,
                ),
                reply_data.get(
                    "reply_count",
                    tracking_row["reply_count"] if tracking_row["reply_count"] is not None else 0,
                ),
                reply_data.get("last_reply_at", tracking_row["last_reply_at"]),
                reply_data.get("last_checked_at", tracking_row["last_checked_at"]),
                gmail_message_id,
            ),
        )
        connection.execute(
            """
            UPDATE runs
            SET
                gmail_message_id = COALESCE(gmail_message_id, ?),
                email_sent_at = COALESCE(email_sent_at, ?),
                email_replied = ?
            WHERE id = ?
            """,
            (
                gmail_message_id,
                reply_data.get("sent_at"),
                reply_data.get("replied", 0),
                tracking_row["run_id"],
            ),
        )
        connection.commit()

    return True


def get_all_runs() -> list[dict[str, Any]]:
    """Return all runs as a list of dicts, newest first."""

    with _get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                runs.id,
                runs.url,
                runs.company_name,
                runs.industry,
                runs.fit_score,
                runs.subject,
                runs.email_path,
                runs.analysis_path,
                runs.timestamp,
                runs.recipient_email,
                runs.gmail_message_id,
                COALESCE(runs.email_sent_at, tracking.sent_at) AS email_sent_at,
                COALESCE(runs.email_replied, tracking.replied, 0) AS email_replied,
                COALESCE(tracking.delivered, 0) AS email_delivered,
                COALESCE(tracking.opened, 0) AS email_opened,
                COALESCE(tracking.reply_count, 0) AS email_reply_count,
                tracking.last_reply_at,
                tracking.last_checked_at
            FROM runs
            LEFT JOIN (
                SELECT et1.*
                FROM email_tracking et1
                LEFT JOIN email_tracking et2
                    ON et1.run_id = et2.run_id
                    AND (
                        COALESCE(et2.last_reply_at, et2.sent_at) > COALESCE(et1.last_reply_at, et1.sent_at)
                        OR (
                            COALESCE(et2.last_reply_at, et2.sent_at) = COALESCE(et1.last_reply_at, et1.sent_at)
                            AND et2.id > et1.id
                        )
                    )
                WHERE et2.id IS NULL
            ) AS tracking
                ON runs.id = tracking.run_id
            ORDER BY COALESCE(tracking.last_reply_at, runs.email_sent_at, tracking.sent_at, runs.timestamp) DESC,
                     runs.id DESC
            """
        ).fetchall()

    return [dict(row) for row in rows]


def get_stats() -> dict[str, Any]:
    """Return aggregate outreach stats derived from runs and latest tracking state."""

    with _get_connection() as connection:
        row = connection.execute(
            """
            WITH latest_tracking AS (
                SELECT et1.run_id, et1.opened
                FROM email_tracking et1
                LEFT JOIN email_tracking et2
                    ON et1.run_id = et2.run_id
                    AND (
                        COALESCE(et2.last_reply_at, et2.sent_at) > COALESCE(et1.last_reply_at, et1.sent_at)
                        OR (
                            COALESCE(et2.last_reply_at, et2.sent_at) = COALESCE(et1.last_reply_at, et1.sent_at)
                            AND et2.id > et1.id
                        )
                    )
                WHERE et2.id IS NULL
            )
            SELECT
                COUNT(runs.id) AS total,
                SUM(CASE WHEN runs.gmail_message_id IS NULL THEN 1 ELSE 0 END) AS not_contacted,
                SUM(CASE WHEN runs.gmail_message_id IS NOT NULL THEN 1 ELSE 0 END) AS contacted,
                SUM(CASE WHEN COALESCE(latest_tracking.opened, 0) = 1 THEN 1 ELSE 0 END) AS opened,
                SUM(CASE WHEN COALESCE(runs.email_replied, 0) = 1 THEN 1 ELSE 0 END) AS replied,
                SUM(CASE WHEN LOWER(COALESCE(runs.fit_score, '')) = 'high' THEN 1 ELSE 0 END) AS high_fit,
                SUM(CASE WHEN LOWER(COALESCE(runs.fit_score, '')) = 'medium' THEN 1 ELSE 0 END) AS medium_fit,
                SUM(CASE WHEN LOWER(COALESCE(runs.fit_score, '')) = 'low' THEN 1 ELSE 0 END) AS low_fit,
                SUM(
                    CASE
                        WHEN runs.gmail_message_id IS NOT NULL AND COALESCE(runs.email_replied, 0) = 0
                        THEN 1 ELSE 0
                    END
                ) AS follow_ups_pending
            FROM runs
            LEFT JOIN latest_tracking
                ON runs.id = latest_tracking.run_id
            """
        ).fetchone()

    total = int(row["total"] or 0)
    not_contacted = int(row["not_contacted"] or 0)
    contacted = int(row["contacted"] or 0)
    opened = int(row["opened"] or 0)
    replied = int(row["replied"] or 0)
    high_fit = int(row["high_fit"] or 0)
    medium_fit = int(row["medium_fit"] or 0)
    low_fit = int(row["low_fit"] or 0)
    follow_ups_pending = int(row["follow_ups_pending"] or 0)
    success_rate = (replied / contacted * 100) if contacted > 0 else 0.0

    return {
        "total": total,
        "not_contacted": not_contacted,
        "contacted": contacted,
        "opened": opened,
        "replied": replied,
        "high_fit": high_fit,
        "medium_fit": medium_fit,
        "low_fit": low_fit,
        "follow_ups_pending": follow_ups_pending,
        "success_rate": success_rate,
    }


def get_run(run_id: str) -> dict[str, Any] | None:
    """Return one run as a dict, or None if it does not exist."""

    with _get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                runs.id,
                runs.url,
                runs.company_name,
                runs.industry,
                runs.fit_score,
                runs.subject,
                runs.email_path,
                runs.analysis_path,
                runs.timestamp,
                runs.recipient_email,
                runs.gmail_message_id,
                COALESCE(runs.email_sent_at, tracking.sent_at) AS email_sent_at,
                COALESCE(runs.email_replied, tracking.replied, 0) AS email_replied,
                COALESCE(tracking.delivered, 0) AS email_delivered,
                COALESCE(tracking.opened, 0) AS email_opened,
                COALESCE(tracking.reply_count, 0) AS email_reply_count,
                tracking.last_reply_at,
                tracking.last_checked_at
            FROM runs
            LEFT JOIN (
                SELECT et1.*
                FROM email_tracking et1
                LEFT JOIN email_tracking et2
                    ON et1.run_id = et2.run_id
                    AND (
                        COALESCE(et2.last_reply_at, et2.sent_at) > COALESCE(et1.last_reply_at, et1.sent_at)
                        OR (
                            COALESCE(et2.last_reply_at, et2.sent_at) = COALESCE(et1.last_reply_at, et1.sent_at)
                            AND et2.id > et1.id
                        )
                    )
                WHERE et2.id IS NULL
            ) AS tracking
                ON runs.id = tracking.run_id
            WHERE runs.id = ?
            """,
            (run_id,),
        ).fetchone()

    return dict(row) if row else None


def get_tracking_by_run(run_id: str) -> list[dict[str, Any]]:
    """Return all tracking rows for a run, newest sent first."""

    with _get_connection() as connection:
        rows = connection.execute(
            f"""
            SELECT
                {", ".join(EMAIL_TRACKING_COLUMNS)}
            FROM email_tracking
            WHERE run_id = ?
            ORDER BY sent_at DESC, id DESC
            """,
            (run_id,),
        ).fetchall()

    return [dict(row) for row in rows]


def get_all_unreplied() -> list[dict[str, Any]]:
    """Return all tracked emails that have not yet received a reply."""

    with _get_connection() as connection:
        rows = connection.execute(
            f"""
            SELECT
                {", ".join(EMAIL_TRACKING_COLUMNS)}
            FROM email_tracking
            WHERE replied = 0 AND gmail_message_id IS NOT NULL
            ORDER BY sent_at ASC, id ASC
            """
        ).fetchall()

    return [dict(row) for row in rows]


def delete_run(run_id: str) -> bool:
    """Delete one run by id. Return True if a row was deleted."""

    with _get_connection() as connection:
        connection.execute(
            "DELETE FROM email_tracking WHERE run_id = ?",
            (run_id,),
        )
        cursor = connection.execute(
            "DELETE FROM runs WHERE id = ?",
            (run_id,),
        )
        connection.commit()

    return cursor.rowcount > 0
