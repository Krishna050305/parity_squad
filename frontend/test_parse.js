const algosdk = require("algosdk");
const enc = "iaNhbXTOAB6EgKNmZWXNA+iiZnbOA7Mhk6NnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqJsds4DsyV7pG5vdGXEJUxlbmRQb29sIERlbW8gRnVuZGluZzogQXBwICM3NTgyMzE4Mjejc25kxCAOe/bS3TfcQnYnpRSG7PB2E3I7/Xx6mdRnD/xXo1HI0qR0eXBlo3BheQ==";
const binary = atob(enc);
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
}
const decodedTxn = algosdk.decodeUnsignedTransaction(bytes);
console.log("Decoded txn note:", decodedTxn.note);
console.log("Transaction dictify:", decodedTxn.get_obj_for_encoding());
try {
  const b64 = Buffer.from(decodedTxn.toByte()).toString("base64");
  console.log("Re-encoded b64:", b64);
  console.log("Match?", b64 === enc);
} catch(e) {
  console.error("Error re-encoding:", e);
}
