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
  console.log('=====================');
  console.log('STEP 1')
  console.log('=====================');
  const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);
  
  const client = Client.forName(process.env.HEDERA_NETWORK)
    .setOperator(OPERATOR_ID, OPERATOR_KEY);
  console.log('Client created successfully');

  console.log('=====================');
  console.log('STEP 2');
  console.log('=====================');
  
  const infoLogger = new Logger(LogLevel.Info);
  client.setLogger(infoLogger)
  console.log('Logger set successfully');

  console.log('=====================');
  console.log('STEP 3');
  console.log('=====================');

  // generate private key using ECDSA
  const ecdsaKey = PrivateKey.generateECDSA();

  // generate private key using ED25519
  const ed25519Key = PrivateKey.generateED25519();

  // generate private key from mnemonic
  const mnemonic = await Mnemonic.generate();
  const mnemonicKey = await mnemonic.toStandardECDSAsecp256k1PrivateKey("", 0);

  console.log(`1.ECDSA key = ${ecdsaKey.toString()}`);
  console.log(`2.ED25519 key = ${ed25519Key.toString()}`);
  console.log(`3. Private key from mnemonic = ${mnemonicKey.toString()}`);

  console.log('=====================');
  console.log('STEP 4');
  console.log('=====================');

  const newAccountResponse = await new AccountCreateTransaction()
    .setKey(ecdsaKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  const newAccountReceipt = await newAccountResponse.getReceipt(client);
  if(newAccountReceipt.status !== Status.Success){
    throw new Error("Account creation failed")
    
  }
  console.log('Account created successfully');

  const accountBalance = await new AccountBalanceQuery()
  .setAccountId(newAccountReceipt.accountId)
  .execute(client);

  const accountInfo = await new AccountInfoQuery()
    .setAccountId(newAccountReceipt.accountId)
    .execute(client);

  if(accountBalance.hbars.toTinybars().eq(1000)){
    console.log('Account balance is correct');
  }

  const {accountId: newAccountId} = newAccountReceipt;

  console.log('=====================');
  console.log('STEP 5');
  console.log('=====================');

  const transferTx = await new TransferTransaction()
  .addHbarTransfer(OPERATOR_ID, Hbar.fromTinybars(-1000))
  .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
  .execute(client);

  const transferTxReceipt = await transferTx.getReceipt(client);
  
  const newAccountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  if(newAccountBalance.hbars.toTinybars().eq(2000)){
    console.log('Transfer successful');
  } else{
    throw new Error("Transfer failed");
  }
   
  console.log('=====================');
  console.log('STEP 6');
  console.log('=====================');

  const adminKey = PrivateKey.generateED25519();
  const supplyKey = PrivateKey.generateED25519();
  const wipeKey = PrivateKey.generateED25519();
  const freezeKey = PrivateKey.generateED25519();
  const pauseKey = PrivateKey.generateED25519();
  const feeScheduleKey = PrivateKey.generateED25519();
  const metadataKey = PrivateKey.generateED25519();
  const kycKey = PrivateKey.generateED25519();
  
  let createTokenTxResponse = await new TokenCreateTransaction()
    .setTokenType(TokenType.FungibleCommon)
    .setTokenName('LimeCoin')
    .setTokenSymbol('LIME')
    .setMetadata('LimeCoin is a fungible token')
    .setInitialSupply(1)
    .setTreasuryAccountId(OPERATOR_ID)
    .setAdminKey(adminKey)
    .setMetadataKey(metadataKey)
    .setWipeKey(wipeKey)
    .setKycKey(kycKey)
    .setFreezeKey(freezeKey)
    .setFeeScheduleKey(feeScheduleKey)
    .setPauseKey(pauseKey)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  let signedTokenTxResponse = await createTokenTxResponse.sign(adminKey)
    createTokenTxResponse = await signedTokenTxResponse.execute(client);

    const createTokenReceipt = await createTokenTxResponse.getReceipt(client);

    const { tokenId } = createTokenReceipt;

    console.log('Generated token ID: ' + tokenId);

    console.log('=====================');
    console.log('STEP 7');
    console.log('=====================');
    
    const tokenMintTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(1000)
      .freezeWith(client)

      const signedTokenMintTx = await tokenMintTx.sign(supplyKey);
      const tokenMintResponse = await signedTokenMintTx.execute(client);

    await tokenMintResponse.getReceipt(client);

    const tokenInfoQuery = await new TokenInfoQuery()
      .setTokenId(tokenId)
      .execute(client);

    if(tokenInfoQuery.totalSupply.notEquals(1001)){
      throw new Error("Token mint failed");
    }

    const isInvalidTokenInfo = tokenInfoQuery.name !== 'LimeCoin' ||
      tokenInfoQuery.symbol !== 'LIME';
    
    if (isInvalidTokenInfo) {
      throw new Error("Token info is incorrect");
    }

    console.log('Тoken info is correct');

    console.log('=====================');
    console.log('STEP 8');
    console.log('=====================');

    const tokenUpdateteTx = await new TokenUpdateTransaction()
      .setTokenId(tokenId)
      .setTokenName('LimeCoin_v2')
      .freezeWith(client)
      .sign(adminKey);

    const tokenUpdateResponse = await tokenUpdateteTx.execute(client);
    await tokenUpdateResponse.getReceipt(client);

    const newTokenInfoResponse = await new TokenInfoQuery()
      .setTokenId(tokenId)

    const tokenInfo = await newTokenInfoResponse.execute(client)

    if(tokenInfo.name !== 'LimeCoin_v2'){
      throw new Error("Token update failed");
    }
    console.log('Token updated successfully');

    console.log('=====================');
    console.log('STEP 9');
    console.log('=====================');

    const userAccountTx = await new AccountCreateTransaction()
      .setKey(ed25519Key)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(client);

    const userAccountResponse = await userAccountTx.getReceipt(client);
    const { accountId: user } = userAccountResponse;
 
    let associateTxResponse = await new TokenAssociateTransaction()
      .setTokenIds([tokenId])
      .setAccountId(user)
      .freezeWith(client)
      .sign(ed25519Key);  

    associateTxResponse = await associateTxResponse.execute(client);
    await associateTxResponse.getReceipt(client);

  
    
    const tokenInfoAfterAssociateTx = await new TokenInfoQuery()
      .setTokenId(tokenId)
      .execute(client);
    


    console.log('=====================');
    console.log('STEP 10');
    console.log('=====================');

    const disassociateTx = await new TokenDissociateTransaction()
      .setTokenIds([tokenId])
      .setAccountId(user)
      .freezeWith(client)
      .sign(ed25519Key);
    
    const disassociateResponse = await disassociateTx.execute(client);
    await disassociateResponse.getReceipt(client);
    
    const tokenInfoAfterDisassociateTx = await new TokenInfoQuery()
      .setTokenId(tokenId)
      .execute(client);


        /*
      TODO: check if keys are correct 
      TODO: check if max supply should be indeed 0 after association??
      TODO: token info details after association/disassociation??
        */
    
    console.log('=====================');
    console.log('STEP 11');
    console.log('=====================');

    const deleteTokenTransaction = await new TokenDeleteTransaction()
      .setTokenId(tokenId)
      .freezeWith(client)
      .sign(adminKey);
    
    const deleteTokenResponse = await deleteTokenTransaction.execute(client);
    const deleteTokenReceipt = await deleteTokenResponse.getReceipt(client);

   if(deleteTokenReceipt.status !== Status.Success){
     throw new Error("Token deletion failed");
   }
   console.log('Token deleted successfully');

   const tokenInfoAfterDelete = await new TokenInfoQuery()
    .setTokenId(tokenId)
    .execute(client);

    if(tokenInfoAfterDelete.isDeleted !== true){
      throw new Error("Token deletion failed");
    }
    console.log('Token deleted successfully');

    console.log('=====================');
    console.log('STEP 12');
    console.log('=====================');

    const createFileTx = await new FileCreateTransaction()
      .setContents('Hello, Hedera!')
      .setKeys([OPERATOR_KEY])
      .execute(client);

    const createFileReceipt = await createFileTx.getReceipt(client);
    const fileId = createFileReceipt.fileId;
    
    const appendFileTx = await new FileAppendTransaction()
      .setFileId(fileId)
      .setContents('Hello, Hedera again!')
      .execute(client);

    await appendFileTx.getReceipt(client);

    const viewFileContents = await new FileContentsQuery()
      .setFileId(fileId)
      .execute(client);
    
    console.log('File Content - ' + viewFileContents.toString());

    console.log('=====================');
    console.log('STEP 13');
    console.log('=====================');

    const deleteFileTx = await new FileDeleteTransaction()
      .setFileId(fileId)
      .freezeWith(client)
      .sign(OPERATOR_KEY);
    
    const deleteFileBytes = deleteFileTx.toBytes();
    const deleteFileDeserialize = FileDeleteTransaction.fromBytes(deleteFileBytes);
    
    const executeDeleteFile = await deleteFileDeserialize.execute(client)
    const deleteFileReceipt = await executeDeleteFile.getReceipt(client);

    if(deleteFileReceipt.status !== Status.Success){
      throw new Error("File deletion failed");
    }
    console.log('File deleted successfully');

    const viewFileContentsAfterDelete = await new FileContentsQuery()
      .setFileId(fileId)
      .execute(client);

    // TODO: check if file content throws error

    if(viewFileContentsAfterDelete.toString() !== ''){
      throw new Error("File deletion failed");
    }
    console.log('File content is null');

    console.log('=====================');
    console.log('Extra: STEP 14');
    console.log('CREATE NON FUNGIBLE TX and remove key like in HIP540')
    console.log('=====================');

    const nonfungibleTokenCreateTx = await new TokenCreateTransaction()
      .setTokenType(TokenType.NonFungibleUnique)
      .setTokenName('Limecheta')
      .setTokenSymbol('LIMECH')
      .setTreasuryAccountId(OPERATOR_ID)
      .setAdminKey(adminKey)
      .setWipeKey(wipeKey)
      .setFreezeKey(freezeKey)
      .setPauseKey(pauseKey)
      .setSupplyKey(supplyKey)
      .setFeeScheduleKey(feeScheduleKey)
      .setMetadataKey(metadataKey)
      .freezeWith(client);

      const signedNonFungibleTokenTx = await nonfungibleTokenCreateTx.sign(adminKey);
      await signedNonFungibleTokenTx.execute(client);

      const emptyKeyList = KeyList.of();
      const removeWipeKeyTx = await new TokenUpdateTransaction()
        .setTokenId(tokenId)
        .setWipeKey(emptyKeyList)
        .freezeWith(client)
        .sign(adminKey);

        await removeWipeKeyTx.execute(client);

        console.log('Updated wipe key successfully');
}

void htsContractFunction();

