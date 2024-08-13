import {
  AccountCreateTransaction,
  AccountId,
  AccountInfoQuery,
  Client,
  PrivateKey,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TransferTransaction,
} from "@hashgraph/sdk";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);
  const client = Client.forNetwork(process.env.HEDERA_NETWORK).setOperator(
    OPERATOR_ID,
    OPERATOR_KEY
  );

  const privateKeyReceiver = PrivateKey.generateECDSA();
  const createRecieverTx = await new AccountCreateTransaction()
    .setKey(privateKeyReceiver)
    .execute(client);

  const receiverId = (await createRecieverTx.getReceipt(client)).accountId;

  const tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("MyToken")
    .setTokenSymbol("MT")
    .setDecimals(4)
    .setInitialSupply(1000000)
    .setSupplyKey(OPERATOR_KEY)
    .setAdminKey(OPERATOR_KEY)
    .setTreasuryAccountId(OPERATOR_ID)
    .execute(client);

  const { tokenId } = await tokenCreateTx.getReceipt(client);

  await (
    await (
      await new TokenAssociateTransaction()
        .setTokenIds([tokenId])
        .setAccountId(receiverId)
        .freezeWith(client)
        .sign(privateKeyReceiver)
    ).execute(client)
  ).getReceipt(client);
  /*
  const transferToken = await new TransferTransaction()
    .addTokenTransfer(tokenId, receiverId, 5)
    .addTokenTransfer(tokenId, OPERATOR_ID, -5)
    .execute(client);
  await transferToken.getReceipt(client);

  // pre token transfer with decimals
  const accountInfoQuery = await new AccountInfoQuery()
    .setAccountId(receiverId)
    .execute(client);
  console.log(
    "pre tokenTransferWithDecimals(...) - ",
    accountInfoQuery.tokenRelationships.get(tokenId).balance.toInt()
  );
  */

  const transferToken2 = await new TransferTransaction()
    .addTokenTransferWithDecimals(tokenId, receiverId, 1, 4)
    .addTokenTransferWithDecimals(tokenId, OPERATOR_ID, 1, 4)
    .addTokenTransfer(tokenId, receiverId, 5)
    .addTokenTransfer(tokenId, OPERATOR_ID, -5)
    .execute(client);

  // REAL TIME BEHAVIOUR
  // 0 + 5 = 5 => dapp shows 0.0005 tokens
  // EXPECTED BEHAVIOUR
  // 10005 + 5 = 10010 => dapp shows 1,001 tokens

  await transferToken2.getReceipt(client);

  // post token transfer with decimals
  const accountInfoQuery2 = await new AccountInfoQuery()
    .setAccountId(receiverId)
    .execute(client);

  10000;
  console.log(
    "post tokenTransferWithDecimals(..) - ",
    accountInfoQuery2.tokenRelationships.get(tokenId).balance
  );
}
void main();
