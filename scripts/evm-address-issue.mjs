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

  const tokenIdResponse = await new TokenCreateTransaction()
    .setTokenName("TestToken")
    .setTokenSymbol("TST")
    .setDecimals(0)
    .setInitialSupply(100)
    .setTreasuryAccountId(OPERATOR_ID)
    .setAdminKey(OPERATOR_KEY)
    .execute(client);

  const { tokenId } = await tokenIdResponse.getReceipt(client);

  const receiverKey = PrivateKey.generateED25519();
  const receiverAccResponse = await new AccountCreateTransaction()
    .setKey(receiverKey)
    .setInitialBalance(new Hbar(10))
    .execute(client);

  const receiverAccId = (await receiverAccResponse.getReceipt(client))
    .accountId;

  const assocTx = await new TokenAssociateTransaction()
    .setAccountId("0x34fe5d75bd7ee95273ac9883c460d71edb0a2b6e")
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(receiverKey);

  const assocResponse = await assocTx.execute(client);
  console.log(await assocResponse.getReceipt(client));
  console.log("Successfully associated token to account");
  /* 
  const infoLogger = new Logger(LogLevel.Info);
  client.setLogger(infoLogger);
  console.log("Logger set successfully");
  
  */
}

void htsContractFunction();
