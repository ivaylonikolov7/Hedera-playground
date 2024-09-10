import { FileInfoQuery } from "@hashgraph/sdk";
import {
  FileUpdateTransaction,
  Mnemonic,
  PrivateKey,
  Client,
  AccountId,
} from "@hashgraph/sdk";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Operator ID: ", process.env.OPERATOR_ID);
  const OPERATOR_ID = AccountId.fromString("0.0.2");
  const OPERATOR_KEY = PrivateKey.fromStringED25519(
    "302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137"
  );

  const client = Client.forName(process.env.HEDERA_NETWORK).setOperator(
    OPERATOR_ID,
    OPERATOR_KEY
  );

  console.log("Client created successfully");

  const tx = await new FileUpdateTransaction()
    .setFileId("0.0.111")
    .setContents("Hello, Hedera!")
    .execute(client);

  await tx.getReceipt(client);
  console.log("yo");
  //console.log(await tx.getReceipt(client));
}

void main();
