import {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
  TopicCreateTransaction,
} from "@hashgraph/sdk";

import dotenv from "dotenv";

dotenv.config();

async function htsContractFunction() {
  const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);

  const client = Client.forName(process.env.HEDERA_NETWORK).setOperator(
    OPERATOR_ID,
    OPERATOR_KEY
  );
  console.log("Client created successfully");

  const nextMetricsMessage = "test";
  const adminKey = PrivateKey.generateECDSA();

  const newTopicTx = await new TopicCreateTransaction()
    .setAdminKey(adminKey)
    .freezeWith(client)
    .sign(adminKey);

  const newTopicResponse = await newTopicTx.execute(client);
  const { topicId } = await newTopicResponse.getReceipt(client);

  for (let i = 0; i < 10000; i++) {
    await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(nextMetricsMessage))
      .freezeWith(client)
      .sign(adminKey);
    // (await topicMsgSubmitTx.execute(client)).getReceipt(client);
  }

  console.log("Finished sending messages");
}

void htsContractFunction();
