import { FileAppendTransaction } from "@hashgraph/sdk";

async function run() {
  const contentLength = 632421;
  const content = generateUInt8Array(contentLength);

  const transaction = new FileAppendTransaction()
    .setTransactionValidDuration(180)
    .setContents(content)
    .setChunkSize(4096);

  //console.log(transaction.contents.length); //632421 (content length)

  const transactionBytes = transaction.toBytes();

  const transactionFromBytes =
    FileAppendTransaction.fromBytes(transactionBytes);

  console.log(transactionFromBytes.contents.length); //4096 (default chunk size)
}
run();

function generateUInt8Array(length) {
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = Math.floor(Math.random() * 256);
  }

  return uint8Array;
}
