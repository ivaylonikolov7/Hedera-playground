import {
  AccountId,
  Client,
  AccountBalanceQuery,
  TopicMessageQuery,
} from "@hashgraph/sdk";
import "dotenv/config";

const localnodeaddress = "localhost";

const node = {};
node[`${localnodeaddress}:50211`] = new AccountId(3);
const client = Client.forNetwork(node)
  .setMirrorNetwork(`${localnodeaddress}:5600`)
  .setMaxExecutionTime(null);

const topicId = "0.0.1002";

// Subscribe to the topic
const topicQuery = new TopicMessageQuery()
  .setTopicId(topicId)
  .setMaxAttempts(Number.MAX_VALUE)
  .setMaxBackoff(20000);

topicQuery.subscribe(client, null, (message) => {
  let messageAsString = Buffer.from(message.contents, "utf8").toString();
  console.log(
    `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
  );
});

/*
import {
  Client,
  AccountId,
  PrivateKey,
  Logger,
  LogLevel,
  Mnemonic,
  TokenCreateTransaction,
  TokenType,
  TokenMintTransaction,
  TokenInfoQuery,
  TokenAssociateTransaction,
  TokenUpdateTransaction,
  AccountCreateTransaction,
  Hbar,
  AccountBalanceQuery,
  TransferTransaction,
  Status,
  AccountInfoQuery,
  TokenDissociateTransaction,
  TokenDeleteTransaction,
  FileCreateTransaction,
  FileAppendTransaction,
  FileContentsQuery,
  FileDeleteTransaction,
  PublicKey,
  KeyList,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

import * as dotenv from "dotenv";

dotenv.config();

async function htsContractFunction() {
  const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);

  const client = Client.forName(process.env.HEDERA_NETWORK).setOperator(
    OPERATOR_ID,
    OPERATOR_KEY
  );
  console.log("Client created successfully");

  const infoLogger = new Logger(LogLevel.Info);
  client.setLogger(infoLogger);
  console.log("Logger set successfully");

  const topicCreateReponse = await new TopicCreateTransaction()
    .setSubmitKey(OPERATOR_KEY)
    .setTopicMemo("Hedera Topic")
    .execute(client);

  const { topicId } = await topicCreateReponse.getReceipt(client);
  console.log("Topic ID: " + topicId.toString());

  await new TopicMessageQuery()
    .setTopicId(topicId)
    .setStartTime(0)
    .subscribe(client, (message) => {
      console.log("yo");
      console.log(Buffer.from(message.contents, "utf8").toString());
    });

  console.log("Subscribed to topic");

  const topicMessage = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage("Hello Hedera!")
    .execute(client);

  await topicMessage.getReceipt(client);
}

void htsContractFunction();
*/
