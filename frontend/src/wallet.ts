import { PeraWalletConnect } from "@perawallet/connect";
import * as algokit from "@algorandfoundation/algokit-utils";

const peraWallet = new PeraWalletConnect();

// Using localnet config
const algodClient = algokit.getAlgoClient({
  server: "http://localhost",
  port: "4001",
  token: "a".repeat(64),
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
  // Decode base64 msgpack txns back to Uint8Array expected by Pera
  const txnsToSign = encodedTxns.map((enc) => {
    const binary = atob(enc);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return { txn: bytes }; // PeraWallet takes simple Uint8Array wrapped struct
  });

  // Sign txns
  const signedTxns = await peraWallet.signTransaction([txnsToSign]);

  // Send raw transaction
  const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
  
  // Wait for confirmation
  await algokit.waitForConfirmation(txId, 4, algodClient);
  
  return txId;
};
