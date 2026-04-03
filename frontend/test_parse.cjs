const algosdk = require("algosdk");
const fs = require("fs");
const enc_array = JSON.parse(fs.readFileSync("/tmp/group_txns.json", "utf8"));

const txnsToSign = enc_array.map((enc) => {
    const binary = atob(enc);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const decodedTxn = algosdk.decodeUnsignedTransaction(bytes);
    return { txn: decodedTxn, signers: [decodedTxn.sender.toString()] };
});

txnsToSign.forEach((t, idx) => {
   console.log(`Txn ${idx} type:`, t.txn.type);
   console.log(`Txn ${idx} group ID exists?`, !!t.txn.group);
   console.log(`Txn ${idx} signers:`, t.signers);
   try {
     const encodedUnsigned = algosdk.encodeUnsignedTransaction(t.txn);
     const b64 = Buffer.from(encodedUnsigned).toString("base64");
     console.log(`Txn ${idx} Re-encoded match?`, b64 === enc_array[idx]);
   } catch(e) {
     console.error("Error re-encoding:", e);
   }
});
