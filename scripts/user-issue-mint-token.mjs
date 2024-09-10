import * as b from "../node_modules/@hashgraph/sdk/src/browser.js";

console.log("test");
/*
// Convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

let client = Client.forTestnet();

//getting following info from hashconnect after connecting the hashpack wallet via browser extension.
//const accountId= ;
//const signer =;

const createAndMintTokenViaHashPack = async () => {
  const accountId = AccountId.fromString("0.0.4481103");
  const initial_supply = 1000;
  const provider = new hashgraph.LocalProvider();
  try {
    const wallet = new Wallet(
      "0.0.4481103",
      "0x3d11515c6794311c87dfdeaac90d4c223c22f3634db8f24690b557ea0ca97c11",
      provider
    );

    // Step 1: Create the token transaction (without signing)
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName("abc")
      .setTokenSymbol("token_symbol")
      .setTreasuryAccountId(accountId) // Use the paired account as the treasury
      .setInitialSupply(initial_supply) // Adjust as needed
      .freezeWithSigner(wallet);

    // Step 2: Serialize the transaction to send it to HashPack for signing
    const serializedTx = arrayBufferToBase64(tokenCreateTx.toBytes());

    // Step 3: Prepare the transaction request for HashPack
    const transactionRequest = {
      accountToSign: accountId, // The user's account ID
      network: "testnet", // or "mainnet"
      transaction: serializedTx,
      returnTransaction: true, // We expect HashPack to return the signed transaction
    };

    // Step 4: Send the transaction request to HashPack for signing
    let response = await hashconnect.signAndReturnTransaction(
      accountId,
      transactionRequest
    );

    // Step 5: Parse the signed transaction returned from HashPack
    const signedTransaction = base64ToArrayBuffer(response.transaction);

    // Step 5: Deserialize the signed transaction
    const signedTx = Transaction.fromBytes(signedTransaction);

    // Step 6: Submit the signed transaction to Hedera network
    const txResponse = await signedTx.execute(client);

    // Step 7: Return the transaction response
    return txResponse;
  } catch (error) {
    console.error("Error creating and minting token:", error);
    throw error;
  }
};

createAndMintTokenViaHashPack()
  .then((txResponse) => console.log("Transaction response:", txResponse))
  .catch((err) => console.error("Transaction failed:", err));
*/
