"""Backend notifications module — in-memory notification store.

This module is now integrated into demo_data.py.
Import from demo_data instead:

    from .demo_data import (
        notifications_store,
        create_notification,
        get_user,
    )
"""

# Re-export from demo_data for backward compatibility
from .demo_data import (
    notifications_store,
    create_notification,
    get_user,
)


def create_guarantor_notification(
    borrower_wallet: str,
    guarantor_wallet: str,
    app_id: int,
    loan_data: dict | None = None,
) -> str:
    """Creates a pending notification for the guarantor."""
    return create_notification(
        borrower_wallet=borrower_wallet,
        guarantor_wallet=guarantor_wallet,
        app_id=app_id,
        amount=loan_data.get("amount", 0) if loan_data else 0,
    )


def get_notifications_for_wallet(wallet: str) -> list:
    """Returns all pending notifications for a wallet."""
    return [
        n for n in notifications_store.values()
        if n["guarantor_wallet"] == wallet and n["status"] == "pending"
    ]


def resolve_notification(notification_id: str, action: str) -> dict:
    """Marks notification as approved/declined."""
    if notification_id not in notifications_store:
        return {"error": "Notification not found"}

    notif = notifications_store[notification_id]
    if notif["status"] != "pending":
        return {"error": "Already processed"}

    notif["status"] = action  # "approved" or "declined"
    return notif
