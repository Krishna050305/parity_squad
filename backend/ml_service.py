import os
import joblib
import pandas as pd
from sqlalchemy.orm import Session

from .db_models import User, Loan, Vouch, Guarantor

# Global cache for the loaded model
_model = None

def get_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), "ml_models", "lendpool_trust_model.pkl")
        if os.path.exists(model_path):
            try:
                _model = joblib.load(model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
    return _model

def extract_user_features(db: Session, user: User) -> dict:
    """Extracts features expected by the synthetic model."""
    loans = db.query(Loan).filter(Loan.borrower_id == user.id).all()
    total_loans_taken = len(loans)
    
    # Calculate amount in basic Algos to match synthetic data ranges (50 to 10k)
    total_amount_borrowed = sum(loan.goal_microalgos for loan in loans) / 1_000_000.0

    on_time = 0
    late = 0
    days_late_total = 0
    total_installments = 0
    
    for loan in loans:
        for inst in loan.installments:
            if inst.status in ("paid", "paid_late"):
                total_installments += 1
                if inst.status == "paid":
                    on_time += 1
                elif inst.status == "paid_late":
                    late += 1
                    days_late_total += (inst.days_late or 0)
    
    if total_installments > 0:
        successful_repayment_ratio = on_time / float(total_installments)
        average_days_late = days_late_total / float(total_installments)
    else:
        successful_repayment_ratio = 1.0
        average_days_late = 0.0
        
    vouch_count = db.query(Vouch).filter(Vouch.borrower_id == user.id).count()
    # Guarantors can roughly be counted equivalently as vouches in this simple model if needed
    guar_count = db.query(Guarantor).filter(Guarantor.borrower_id == user.id).count()
    total_vouches = vouch_count + guar_count
    
    features = {
        "kyc_tier": user.tier or 0,
        "total_loans_taken": total_loans_taken,
        "successful_repayment_ratio": successful_repayment_ratio,
        "average_days_late": average_days_late,
        "total_amount_borrowed": total_amount_borrowed,
        "vouch_count": total_vouches
    }
    return features


def calculate_ml_trust_score(features: dict) -> float:
    """Passes UI features through model, returning 0-1000 score."""
    model = get_model()
    if not model:
        # Fallback baseline
        return 500.0
        
    df = pd.DataFrame([features])
    
    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(df)[0]
            # Assuming Binary Classification: target 0=Repaid, 1=Defaulted
            # If the model has 2 classes, probs[1] is chance of default
            prob_default = probs[1] if len(probs) > 1 else probs[0]
            trust_score = (1.0 - prob_default) * 1000.0
        else:
            # Fallback if it's a regression model instead of classifier
            pred = model.predict(df)[0]
            trust_score = float(pred)
            
        return min(1000.0, max(0.0, trust_score))
    except Exception as e:
        print(f"ML inference error: {e}")
        return 500.0
