import {
    Client,
    AccountId,
    PrivateKey,
    Logger,
    LogLevel,
    TokenCreateTransaction,
    TokenType,
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
  
    // generate private key using ECDSA
    const adminKey = PrivateKey.generateECDSA();
    // private key to secp256k1
    console.log({der: adminKey.publicKey.toStringDer()});
    console.log({raw: adminKey.publicKey.toStringRaw()});
    console.log({hex: adminKey.publicKey.toString()});
    console.log({private: adminKey.toString()});
    console.log({der: adminKey.toStringDer()});
    console.log({rawPrivate: adminKey.toStringRaw()});
    console.log('Admin key generated successfully');

    const newTokenTx = await new TokenCreateTransaction()
      .setTokenType(TokenType.FungibleCommon)
      .setTokenName("ExampleToken")
      .setTokenSymbol("EXT")
      .setTreasuryAccountId(OPERATOR_ID)
      .setAdminKey(adminKey)
      .setSupplyKey(adminKey)
      .setInitialSupply(1000)
      .freezeWith(client)

    const signedTokenTx = await newTokenTx.sign(adminKey);
    
    console.log('Signed Tx Admin Key: ' + signedTokenTx._adminKey.toString(), "Admin key: " + adminKey.toString());
    const tokenReceipt = await signedTokenTx.execute(client);
    console.log(tokenReceipt)
  }
  
  void htsContractFunction();
  
  