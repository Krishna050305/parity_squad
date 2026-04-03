import { PeraWalletConnect } from "@perawallet/connect";
import * as algokit from "@algorandfoundation/algokit-utils";
import algosdk from "algosdk";

const peraWallet = new PeraWalletConnect({
    chainId: 416002 // 416002 is Algorand TestNet
});

// Using environment config
const algodClient = algokit.getAlgoClient({
  server: import.meta.env.VITE_ALGOD_SERVER ?? "http://localhost",
  port: import.meta.env.VITE_ALGOD_PORT ?? "4001",
  token: import.meta.env.VITE_ALGOD_TOKEN ?? "a".repeat(64),
});

export const connectWallet = async (): Promise<string> => {
  const accounts = await peraWallet.connect();
  const address = accounts[0];
  localStorage.setItem("connectedAddress", address);
  return address;
};

export const disconnectWallet = async (): Promise<void> => {
  await peraWallet.disconnect();
  localStorage.removeItem("connectedAddress");
};

export const signAndSendTxns = async (encodedTxns: string[]): Promise<string> => {
  // Decode base64 msgpack txns back to Transaction object expected by Pera
  const txnsToSign = encodedTxns.map((enc) => {
    const binary = atob(enc);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    // Decode into native algosdk.Transaction object
    const decodedTxn = algosdk.decodeUnsignedTransaction(bytes);
    return { txn: decodedTxn, signers: [decodedTxn.sender.toString()] };
  });

  // Ensure PeraWallet is initialized properly (in case of page refresh)
  try {
    await peraWallet.reconnectSession();
  } catch (e) {
    console.warn("Could not silently reconnect Pera Wallet session.", e);
  }

  // Sign txns
  console.log("Waiting for user to sign on phone...");
  const signedTxns = await peraWallet.signTransaction([txnsToSign]);
  console.log("Successfully retrieved signature from Pera:", signedTxns);

  // Send raw transaction
  console.log("Broadcasting to Algorand network...");
  let txId: string;
  try {
      const response: any = await algodClient.sendRawTransaction(signedTxns).do();
      console.log("Broadcast response:", response);
      txId = response.txId || response.txid;
      if (!txId) {
          throw new Error("No transaction ID returned from node!");
      }
  } catch (e) {
      console.error("Failed to broadcast:", e);
      throw e;
  }
  
  // Wait for confirmation
  console.log(`Waiting for confirmation of txId: ${txId}...`);
  try {
      await algokit.waitForConfirmation(txId, 4, algodClient);
      console.log("Transaction confirmed!");
  } catch (e) {
      console.error("Wait for confirmation failed:", e);
      throw e;
  }
  
  return txId;
};

