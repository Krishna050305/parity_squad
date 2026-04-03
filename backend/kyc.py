import hashlib
import re

def verify_email_otp(email: str, otp: str) -> bool:
    """Mock Email OTP validation."""
    if otp == "1234":
        return True
    return False

def verify_phone_otp(phone: str, otp: str) -> bool:
    """Mock Phone OTP validation."""
    if otp == "1234":
        return True
    return False

def hash_pan_aadhaar(document_id: str) -> str:
    """Validate PAN and hash it."""
    # Basic PAN format check (5 chars, 4 digits, 1 char)
    if not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', document_id.upper()):
        raise ValueError("Invalid PAN format")
    
    return hashlib.sha256(document_id.upper().encode()).hexdigest()

def get_tier_for_verification(email_verified: bool, phone_verified: bool, pan_hash: str) -> int:
    """Assigns tier based on verification level."""
    if pan_hash:
        return 3
    if phone_verified:
        return 2
    if email_verified:
        return 1
    return 0
