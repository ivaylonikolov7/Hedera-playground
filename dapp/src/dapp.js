import { Client, TokenCreateTransaction } from "@hashgraph/sdk";

const PRIVATE_KEY =
  "3030020100300706052b8104000a042204203d11515c6794311c87dfdeaac90d4c223c23f3634db8f24690b557ea0ca97c11";
const ACCOUNT_ID = "0.0.4481104";
const INITIAL_SUPPLY = 100;

const client = Client.forTestnet().setOperator(ACCOUNT_ID, PRIVATE_KEY);

try {
  await (
    await new TokenCreateTransaction()
      .setTokenName("ABC")
      .setTokenSymbol("abc")
      .setInitialSupply(INITIAL_SUPPLY)
      .setTreasuryAccountId(ACCOUNT_ID)
      .execute(client)
  ).getReceipt(client);
} catch (ex) {
  console.log(ex);
}
