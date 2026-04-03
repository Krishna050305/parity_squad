from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import algokit_utils
from algosdk import encoding
import os
from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load env from root
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="LendPool API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

algorand = algokit_utils.AlgorandClient.from_environment()

class LoanState(BaseModel):
    app_id: int
    borrower: str
    goal_amount: int
    funded_amount: int
    repaid_amount: int
    status: int
    deadline: int
    guarantor: str

@app.get("/")
def read_root():
    return {"status": "LendPool Backend Online", "app_id": os.getenv("APP_ID")}

@app.get("/loans/{app_id}", response_model=LoanState)
def get_loan_state(app_id: int):
    try:
        global_state = algorand.app.get_global_state(app_id)
        
        def get_val(key: str, default=None):
            app_state = global_state.get(key)
            if not app_state:
                return default
            val = app_state.value
            if isinstance(val, bytes) and len(val) == 32:
                return encoding.encode_address(val)
            return val

        return LoanState(
            app_id=app_id,
            borrower=get_val("borrower", "Unknown"),
            goal_amount=get_val("goal_amount", 0),
            funded_amount=get_val("funded_amount", 0),
            repaid_amount=get_val("repaid_amount", 0),
            status=get_val("status", 0),
            deadline=get_val("deadline", 0),
            guarantor=get_val("guarantor", "None")
        )
    except Exception as e:
        logger.error(f"Error fetching loan state: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Loan error: {str(e)}")

@app.get("/loans", response_model=List[int])
def list_loans():
    main_app_id = int(os.getenv("APP_ID", "1002"))
    return [main_app_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
