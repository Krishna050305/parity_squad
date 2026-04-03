import os
from algosdk.v2client import algod, indexer
from dotenv import load_dotenv

load_dotenv()

def _format_address(server_env: str, port_env: str, default_server: str, default_port: str) -> str:
    addr = os.getenv(server_env, default_server)
    port = os.getenv(port_env, default_port)
    if ":" not in addr.replace("http://", "").replace("https://", ""):
        addr = f"{addr}:{port}"
    return addr

def get_algod() -> algod.AlgodClient:
    algod_address = _format_address("ALGOD_SERVER", "ALGOD_PORT", "http://localhost", "4001")
    algod_token = os.getenv("ALGOD_TOKEN", "a"*64)
    return algod.AlgodClient(algod_token, algod_address)

def get_indexer() -> indexer.IndexerClient:
    indexer_address = _format_address("INDEXER_SERVER", "INDEXER_PORT", "http://localhost", "8980")
    indexer_token = os.getenv("INDEXER_TOKEN", "a"*64)
    return indexer.IndexerClient(indexer_token, indexer_address)
