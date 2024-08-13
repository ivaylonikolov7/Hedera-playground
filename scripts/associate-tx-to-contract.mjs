import {
    TokenAssociateTransaction,
    PrivateKey,
    AccountId,
    Client,
    LocalProvider,
    TokenId
  } from "@hashgraph/sdk";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const PUBLIC_KEY = AccountId.fromString(process.env.OPERATOR_ID);
    const PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);
    
    const client = Client.forTestnet()
      .setOperator(PUBLIC_KEY, PRIVATE_KEY);

    const abcToken = new TokenId(0, 0, 4482710)
    console.log('what the ---')
    const tx = await new TokenAssociateTransaction()
    .setAccountId(PUBLIC_KEY)
    .setTokenIds([abcToken])
    .freezeWith(client)
    .execute(client);

    const receipt = await tx.getReceipt(client);
    console.log(receipt)
    
    console.log('peter out')
}
void main();