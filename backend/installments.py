"""Backend installments module — schedule generation and management.

This module provides standalone functions that can be used independently
or through the main API. Core logic is also available in demo_data.py.
"""

from datetime import datetime, timedelta
from typing import Literal

from .demo_data import loan_schedules, build_schedule as _build_schedule

InstallmentStatus = Literal["upcoming", "paid", "paid_late", "overdue"]


def generate_schedule(
    amount_microalgos: int,
    tenure_months: int,
    frequency: Literal["weekly", "biweekly", "monthly"],
    start_date: datetime,
) -> list[dict]:
    """Generates installment schedule. Returns list of installments with due dates."""
    return _build_schedule(
        amount_microalgos,
        tenure_months,
        frequency,
        start_date.strftime("%Y-%m-%d"),
    )


def mark_installment_paid(app_id: int, installment_no: int, paid_date: datetime) -> dict:
    """Marks installment as paid, determines if late."""
    if app_id not in loan_schedules:
        return {"error": "Schedule not found"}

    schedule = loan_schedules[app_id]
    inst = None
    for s in schedule:
        if s["installment_no"] == installment_no:
            inst = s
            break

    if inst is None:
        return {"error": f"Installment #{installment_no} not found"}

    if inst["status"] in ("paid", "paid-late"):
        return {"error": "Already paid"}

    due_date = datetime.fromisoformat(inst["due_date"]).date()
    was_late = paid_date.date() > due_date
    days_late = max(0, (paid_date.date() - due_date).days)

    inst["status"] = "paid-late" if was_late else "paid"
    inst["paid_date"] = paid_date.date().isoformat()
    inst["days_late"] = days_late

    return {
        "installment_no": installment_no,
        "status": inst["status"],
        "was_late": was_late,
        "days_late": days_late,
    }


def check_overdue(app_id: int) -> list[dict]:
    """Returns list of overdue installments."""
    if app_id not in loan_schedules:
        return []

    today = datetime.utcnow().date()
    overdue = []

    for inst in loan_schedules[app_id]:
        if inst["status"] == "upcoming":
            due = datetime.fromisoformat(inst["due_date"]).date()
            if due < today:
                inst["status"] = "overdue"
                overdue.append(inst)
        elif inst["status"] == "overdue":
            overdue.append(inst)

    return overdue
