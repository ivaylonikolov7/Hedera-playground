import {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
  TopicCreateTransaction,
  AccountCreateTransaction,
  Mnemonic,
  Hbar,
  HbarUnit,
} from "@hashgraph/sdk";

import dotenv from "dotenv";

dotenv.config();

async function htsContractFunction() {
  const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);

  const client = Client.forName(process.env.HEDERA_NETWORK).setOperator(
    OPERATOR_ID,
    OPERATOR_KEY
  );
  console.log("Client created successfully");

  const accounts = [];
  for (let accountIndex = 0; accountIndex < 1; ++accountIndex) {
    const mnemonic = await Mnemonic.generate12();
    const accountPrivateKeyObj =
      await mnemonic.toStandardECDSAsecp256k1PrivateKeyCustomDerivationPath(
        "",
        `m/44'/60'/0'/0/${accountIndex}`
      );
    const accountPrivateKey = `0x${accountPrivateKeyObj.toStringRaw()}`;
    const accountEvmAddress = `0x${accountPrivateKeyObj.publicKey.toEvmAddress()}`;
    accounts[accountIndex] = {
      privateKey: accountPrivateKey,
      evmAddress: accountEvmAddress,
      id: "",
    };
  }
}

void htsContractFunction();
