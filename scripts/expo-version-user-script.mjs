import { Client, TransferTransaction, Hbar } from "@hashgraph/sdk";

const client = Client.forTestnet().setOperator(
  process.env.EXPO_PUBLIC_ACCOUNT_ID ?? "",
  process.env.EXPO_PUBLIC_PRIVATE_KEY ?? ""
);

const confirmTransaction = async () => {
  setModalVisible(false);

  const transaction = await new TransferTransaction()
    .addHbarTransfer(accountId, Hbar.fromTinybars(-100000000)) // Convert HBAR to tinybars
    .addHbarTransfer(receiverId, Hbar.fromTinybars(100000000))
    .setTransactionMemo("sanitized-memo")
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  const status = receipt.status;

  if (status.toString() === "SUCCESS") {
    setAlertType("success");
    setAlertMessage("Sending Complete");
    setReceiptNumber(transaction.transactionId.toString());
    clearInputs();
  } else {
    setAlertType("error");
    setAlertMessage("Sending Failed");
  }
};

void confirmTransaction();
