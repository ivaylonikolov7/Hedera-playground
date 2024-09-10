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

  const infoLogger = new Logger(LogLevel.Silent);
  client.setLogger(infoLogger);
  console.log("Logger set successfully");

  const alice = PrivateKey.generateED25519();
  const bob = PrivateKey.generateED25519();
  const carol = PrivateKey.generateED25519();
  const dave = PrivateKey.generateED25519();
  const elijah = PrivateKey.generateED25519();
  const keyList = new KeyList([alice, bob, carol, dave, elijah]).setThreshold(
    3
  );

  const tx = await new TokenCreateTransaction()
    .setTokenType(TokenType.NonFungibleUnique)
    .setTokenName("NFT")
    .setTokenSymbol("NFT")
    .setNodeAccountIds([new AccountId(3), new AccountId(4)])
    .setSupplyKey(OPERATOR_KEY)
    .setAdminKey(OPERATOR_KEY)
    .setWipeKey(OPERATOR_KEY)
    .setTreasuryAccountId(OPERATOR_ID)
    .setFreezeKey(OPERATOR_KEY)
    .freezeWith(client)
    .sign(alice);

  tx.sign(bob);
  tx.sign(carol);

  console.log(tx);
}

void htsContractFunction();
