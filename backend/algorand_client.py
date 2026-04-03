"""
Algorand client helpers for LendPool backend.
Provides AlgodClient and IndexerClient from .env configuration.
"""

import os
import dotenv
from algosdk.v2client.algod import AlgodClient
from algosdk.v2client.indexer import IndexerClient

dotenv.load_dotenv()


def get_algod() -> AlgodClient:
    """Create and return an AlgodClient from .env configuration."""
    token = os.getenv("ALGOD_TOKEN", "a" * 64)
    server = os.getenv("ALGOD_SERVER", "http://localhost")
    port = os.getenv("ALGOD_PORT", "4001")
    return AlgodClient(token, f"{server}:{port}")


def get_indexer() -> IndexerClient:
    """Create and return an IndexerClient from .env configuration."""
    server = os.getenv("INDEXER_SERVER", "http://localhost")
    port = os.getenv("INDEXER_PORT", "8980")
    return IndexerClient("", f"{server}:{port}")
