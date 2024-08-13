import {
  Client,
  AccountId,
  PrivateKey,
  Logger,
  LogLevel,
  TokenType,
  TokenRejectTransaction,
  TokenCreateTransaction,
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

  const newTokenTx = await new TokenCreateTransaction()
    .setTokenType(TokenType.FungibleCommon)
    .setTokenName("ExampleToken")
    .setTokenSymbol("EXT")
    .setTreasuryAccountId(OPERATOR_ID)
    .setAdminKey(OPERATOR_KEY)
    .setSupplyKey(OPERATOR_KEY)
    .setInitialSupply(1000)
    .execute(client);

  const { tokenId } = await newTokenTx.getReceipt(client);

  const tokenRejectTx = await new TokenRejectTransaction()
    .setOwnerId(OPERATOR_ID)
    .addTokenId(tokenId)
    .execute(client);

  const tokenRejectReceipt = await tokenRejectTx.getReceipt(client);
  console.log("Token rejection receipt:", tokenRejectReceipt);
}

void htsContractFunction();
