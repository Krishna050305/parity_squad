/**
 * LendPool Wallet — Unified wallet integration.
 *
 * Uses @txnlab/use-wallet-react for connection management
 * and PeraWalletConnect for signing (needed for mobile).
 */

import { PeraWalletConnect } from '@perawallet/connect';
import * as algokit from '@algorandfoundation/algokit-utils';

// ── Pera instance for signing ───────────────────────────────────
const peraWallet = new PeraWalletConnect();

// ── Algod client (localnet config) ──────────────────────────────
const algodServer = import.meta.env.VITE_ALGOD_SERVER || 'http://localhost';
const algodPort = import.meta.env.VITE_ALGOD_PORT || '4001';
const algodToken = import.meta.env.VITE_ALGOD_TOKEN || 'a'.repeat(64);

const algodClient = algokit.getAlgoClient({
  server: algodServer,
  port: algodPort,
  token: algodToken,
});

// ── Connect wallet (Pera direct approach) ───────────────────────
export const connectWallet = async (): Promise<string> => {
  try {
    const accounts = await peraWallet.connect();
    const address = accounts[0];
    localStorage.setItem('connectedAddress', address);
    return address;
  } catch (err: any) {
    // If already connected, try to reconnect
    if (err?.data?.type === 'ALREADY_CONNECTED') {
      const reconnected = await peraWallet.reconnectSession();
      if (reconnected.length > 0) {
        localStorage.setItem('connectedAddress', reconnected[0]);
        return reconnected[0];
      }
    }
    throw err;
  }
};

// ── Disconnect wallet ───────────────────────────────────────────
export const disconnectWallet = async (): Promise<void> => {
  await peraWallet.disconnect();
  localStorage.removeItem('connectedAddress');
};

// ── Get connected address ───────────────────────────────────────
export const getConnectedAddress = (): string | null => {
  return localStorage.getItem('connectedAddress');
};

// ── Sign and send transactions (Pera signing) ───────────────────
export const signAndSendTxns = async (encodedTxns: string[]): Promise<string> => {
  // Decode base64 msgpack txns back to Uint8Array expected by Pera
  const txnsToSign = encodedTxns.map((enc) => {
    const binary = atob(enc);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { txn: bytes };
  });

  // Sign txns via Pera
  const signedTxns = await peraWallet.signTransaction([txnsToSign]);

  // Send raw transaction
  const { txId } = await algodClient.sendRawTransaction(signedTxns).do();

  // Wait for confirmation
  await algokit.waitForConfirmation(txId, 4, algodClient);

  return txId;
};

// ── Reconnect on page load ──────────────────────────────────────
export const tryReconnect = async (): Promise<string | null> => {
  try {
    const accounts = await peraWallet.reconnectSession();
    if (accounts.length > 0) {
      localStorage.setItem('connectedAddress', accounts[0]);
      return accounts[0];
    }
  } catch {
    // Silent fail — user not previously connected
  }
  return null;
};

// ── Export algod client for direct use ───────────────────────────
export { algodClient };
