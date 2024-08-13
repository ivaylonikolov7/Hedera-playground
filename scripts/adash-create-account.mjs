import {
  AccountBalanceQuery,
  AccountCreateTransaction,
  AccountId,
  AccountInfoQuery,
  Client,
  Hbar,
  PrivateKey,
  PublicKey,
  TransferTransaction,
} from "@hashgraph/sdk";

async function htsContractFunction() {
  // Get your Hedera account credentials from the portal: https://portal.hedera.com/dashboard
  const myAccountId = AccountId.fromString("0.0.4480606");
  const myPrivateKeyDer = PrivateKey.fromStringDer(
    "3030020100300706052b8104000a04220420ebd38a00161a7bc9a49ed6acffd856bc64de26947bc754c255344534437df7f3"
  );

  // Create your Hedera Testnet client
  const client = Client.forTestnet();
  // Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKeyDer);
  // Set the default maximum transaction fee (in Hbar)
  client.setDefaultMaxTransactionFee(new Hbar(10));
  // Set the maximum payment for queries (in Hbar)
  client.setDefaultMaxQueryPayment(new Hbar(10));
  // Generate a new key pair
  const newAccountPrivateKey = PrivateKey.generateECDSA();

  const newAccountPublicKey = newAccountPrivateKey.publicKey;
  const aliasAccountId = newAccountPublicKey.toAccountId(0, 0);
  /*
   * Note that no queries or transactions have taken place yet.
   * This account "creation" process is entirely local.
   */
  console.log("Transferring some Hbar to the new account");

  const accountCreate = await new AccountCreateTransaction()
    .setKey(newAccountPrivateKey.publicKey)
    .execute(client);

  await accountCreate.getReceipt(client);

  const response = await new TransferTransaction()
    .addHbarTransfer(myAccountId, new Hbar(1).negated())
    .addHbarTransfer(aliasAccountId, new Hbar(1))
    .execute(client);

  console.log(await response.getReceipt(client));

  await response.getReceipt(client);
  const balance = await new AccountBalanceQuery()
    .setAccountId(aliasAccountId)
    .execute(client);
  console.log(`Balances of the new account: ${balance.toString()}`);
  const info = await new AccountInfoQuery()
    .setAccountId(aliasAccountId)
    .execute(client);

  console.log(`The normal account ID: ${info.accountId.toString()}`);
  console.log(`The aliased account ID: 0.0.${info.aliasKey.toString()}`);
  console.log(
    `The private key (use this in sdk/Hedera native wallets): ${newAccountPrivateKey.toString()}`
  );
  console.log(
    `The raw private key (use this for JSON RPC wallet import): ${newAccountPrivateKey.toStringRaw()}`
  );
  console.log("Example complete!");
  console.log(newAccountPublicKey.toEvmAddress());
}

void htsContractFunction();
