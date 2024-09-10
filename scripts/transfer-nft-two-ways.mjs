import {
  Client,
  AccountId,
  PrivateKey,
  Logger,
  LogLevel,
  TokenCreateTransaction,
  TokenType,
  TokenMintTransaction,
  AccountCreateTransaction,
  Hbar,
  TransferTransaction,
  NftId,
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

  const tx = await new TokenCreateTransaction()
    .setTokenType(TokenType.NonFungibleUnique)
    .setTokenName("NFT")
    .setTokenSymbol("NFT")
    .setSupplyKey(OPERATOR_KEY)
    .setAdminKey(OPERATOR_KEY)
    .setWipeKey(OPERATOR_KEY)
    .setTreasuryAccountId(OPERATOR_ID)
    .setFreezeKey(OPERATOR_KEY)
    .execute(client);
  const { tokenId } = await tx.getReceipt(client);

  const receiverPrivkey = PrivateKey.generateED25519();
  const receiverPubkey = receiverPrivkey.publicKey;
  const { accountId: receiverId } = await (
    await new AccountCreateTransaction()
      .setKey(receiverPrivkey)
      .setInitialBalance(new Hbar(10))
      .setMaxAutomaticTokenAssociations(100)
      .execute(client)
  ).getReceipt(client);

  await (
    await new TokenMintTransaction()
      .setTokenId(tokenId)
      .addMetadata(Buffer.from("-"))
      .execute(client)
  ).getReceipt(client);

  const serialNumber = 1;

  const nftId = new NftId(tokenId, serialNumber);
  console.log(
    await (
      await new TransferTransaction()
        .addNftTransfer(nftId, OPERATOR_ID, receiverId)
        .execute(client)
    ).getReceipt(client)
  );
}

void htsContractFunction();
