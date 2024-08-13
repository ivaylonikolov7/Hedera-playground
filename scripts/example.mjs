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
    
    const client = Client.forName(process.env.HEDERA_NETWORK)
      .setOperator(OPERATOR_ID, OPERATOR_KEY);
    console.log('Client created successfully');
    
    const infoLogger = new Logger(LogLevel.Info);
    client.setLogger(infoLogger)
    console.log('Logger set successfully');
}
  
  void htsContractFunction();
  
  