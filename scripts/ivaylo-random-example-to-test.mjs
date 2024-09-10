import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountId,
  KeyList,
  TransferTransaction,
  Transaction,
} from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

let user1Key;
let user2Key;
let user3Key;
async function main() {
  if (
    process.env.OPERATOR_ID == null ||
    process.env.OPERATOR_KEY == null ||
    process.env.HEDERA_NETWORK == null
  ) {
    throw new Error(
      "Environment variables OPERATOR_ID, HEDERA_NETWORK, and OPERATOR_KEY are required."
    );
  }
  const client = Client.forName(process.env.HEDERA_NETWORK).setOperator(
    AccountId.fromString(process.env.OPERATOR_ID),
    PrivateKey.fromString(process.env.OPERATOR_KEY)
  );
  // Generate keys for testing
  user1Key = PrivateKey.generate();
  user2Key = PrivateKey.generate();
  user3Key = PrivateKey.generate();
  // Create a multi-sig account with two keys (user1Key, user2Key)
  const keyList = new KeyList([user1Key.publicKey, user2Key.publicKey]);
  const createAccountTransaction = new AccountCreateTransaction()
    .setInitialBalance(new Hbar(2))
    .setKey(keyList);
  const createResponse = await createAccountTransaction.execute(client);
  const createReceipt = await createResponse.getReceipt(client);
  console.log(`New account ID: ${createReceipt.accountId.toString()}`);
  // Create a transfer transaction with multiple node IDs
  const transferTransaction = new TransferTransaction()
    .addHbarTransfer(createReceipt.accountId, new Hbar(-1))
    .addHbarTransfer("0.0.3", new Hbar(1))
    .setNodeAccountIds([new AccountId(3), new AccountId(4), new AccountId(5)]) // multiple nodes
    .freezeWith(client);
  // Convert transaction to bytes for signing
  const transferTransactionBytes = transferTransaction.toBytes();
  // User1 signs the transaction
  const user1Signature = user1Key.signTransaction(
    Transaction.fromBytes(transferTransactionBytes)
  );
  // User2 signs the transaction
  const user2Signature = user2Key.signTransaction(
    Transaction.fromBytes(transferTransactionBytes)
  );
  // Simulate adding signatures to the transaction
  let signedTransaction = Transaction.fromBytes(transferTransactionBytes)
    .addSignature(user1Key.publicKey, user1Signature)
    .addSignature(user2Key.publicKey, user2Signature);
  console.log("Transaction signed with multiple signatures");
  // Optionally sign with additional users if needed (e.g., user3Key)
  const user3Signature = user3Key.signTransaction(
    Transaction.fromBytes(transferTransactionBytes)
  );
  signedTransaction.addSignature(user3Key.publicKey, user3Signature);
  // Execute the transaction with the collected signatures
  try {
    const result = await signedTransaction.execute(client);
    const receipt = await result.getReceipt(client);
    console.log(`Transaction status: ${receipt.status.toString()}`);
  } catch (error) {
    console.error("Error executing transaction:", error);
  }
  client.close();
}
void main();
