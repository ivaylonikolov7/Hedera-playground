import {
  Hbar,
  Client,
  AccountId,
  TokenType,
  PrivateKey,
  AccountBalanceQuery,
  FileCreateTransaction,
  TokenCreateTransaction,
  ContractCreateTransaction,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  AccountCreateTransaction,
  AccountAllowanceApproveTransaction,
  TokenAssociateTransaction,
  TransferTransaction,
  Signer,
  Wallet,
  PublicKey,
  LocalProvider,
  AccountBalance
} from "@hashgraph/sdk";


import * as dotenv from "dotenv";

dotenv.config();

async function htsContractFunction() {
  const PUBLIC_KEY = AccountId.fromString(process.env.OPERATOR_ID);
  const PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);
  
  const client = Client.forName(process.env.HEDERA_NETWORK)
    .setOperator(process.env.OPERATOR_ID, process.env.OPERATOR_KEY);

  const provider = new LocalProvider(client);
  const wallet = new Wallet(PUBLIC_KEY, PRIVATE_KEY, provider)

  console.log(process.env.OPERATOR_KEY)

  const response = await new AccountCreateTransaction()
    .setKey(PRIVATE_KEY)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

    
    const receipt = await response.getReceipt(client);
    const newAccountId = receipt.accountId.toString();

    const senderBalance = await new AccountBalanceQuery()
      .setAccountId(PUBLIC_KEY)
      .execute(client);

      const receiverBalance = await new AccountBalanceQuery(newAccountId)
        .setAccountId(newAccountId)
        .execute(client);

        console.log(senderBalance.hbars.toString());
        console.log(receiverBalance.hbars.toString())


        // return funds back to owner 


        const returnFundsTx = await new TransferTransaction()
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
        .addHbarTransfer(PUBLIC_KEY, Hbar.fromTinybars(-1000))
        .execute(client);

        console.log('you have returned funds to the owner');
        
      /*
    const receiverBalance = 

      console.log(newBalanace.hbars.toString());

    const sendTx = await new TransferTransaction()
      .addHbarTransfer(wall)
      .setAccountId()
      */
}

void htsContractFunction();

