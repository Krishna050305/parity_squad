import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";
import { Buffer } from "buffer";

// Polyfill window.Buffer for algosdk in browser
if (typeof window !== "undefined") {
  (window as any).Buffer = (window as any).Buffer || Buffer;
}

// Ensure instantiated once outside React rendering
export const peraWallet = new PeraWalletConnect({
  chainId: 4160,
  shouldShowSignTxnToast: true
});

export const getAlgodClient = () => {
  return new algosdk.Algodv2("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "http://localhost", "4001");
};

export async function connectWallet(): Promise<string> {
  try {
    const accounts = await peraWallet.connect();
    if (accounts.length > 0) {
      localStorage.setItem("lendpool_address", accounts[0]);
      return accounts[0];
    }
    return "";
  } catch (error: any) {
    if (error?.data?.type !== "USER_REJECT") {
      console.error("Wallet connection failed:", error);
    }
    return "";
  }
}

export function disconnectWallet(): void {
  peraWallet.disconnect();
  localStorage.removeItem("lendpool_address");
}

export async function reconnectWallet(): Promise<string | null> {
  try {
    const accounts = await peraWallet.reconnectSession();
    if (accounts.length > 0) {
      localStorage.setItem("lendpool_address", accounts[0]);
      return accounts[0];
    }
  } catch (error) {
    console.error("Failed to reconnect wallet:", error);
  }
  return null;
}

export async function signAndSendTxns(encodedTxns: string[]): Promise<string> {
  const account = localStorage.getItem("lendpool_address");
  if (!account) throw new Error("Wallet not connected");

  // 1. Decode base64 msgpack strings to Uint8Arrays
  const uint8Txns = encodedTxns.map((enc) => {
    const binary = atob(enc);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  });

  // 2. Prepare SignerTransaction[][] format expected by Pera
  const txGroups = uint8Txns.map((txnBytes) => ({
    txn: algosdk.decodeUnsignedTransaction(txnBytes),
    signers: [account] // Specify who can sign
  }));

  try {
    // 3. Request signature from wallet
    const signedTxnBytesArray = await peraWallet.signTransaction([txGroups]);

    // 4. Send to network
    const algodClient = getAlgodClient();
    const response = await algodClient.sendRawTransaction(signedTxnBytesArray).do();
    const txId = (response as any).txId || (response as any).txid;

    // 5. Wait for confirmation (optional, wait up to 4 rounds)
    await algosdk.waitForConfirmation(algodClient, txId, 4);

    return txId;
  } catch (error: any) {
    if (error?.data?.type === "USER_REJECT") {
      throw new Error("Transaction cancelled by user.");
    }
    const errMsg = error?.message || String(error);
    if (errMsg.includes("overspend")) {
      throw new Error("Insufficient ALGO balance to cover transaction and fees.");
    }
    if (errMsg.includes("Network request error") || errMsg.includes("fetch")) {
      throw new Error("Network error — please check your connection.");
    }
    
    throw new Error(errMsg);
  }
}
