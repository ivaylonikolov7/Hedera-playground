import {
  Client,
  AccountId,
  PrivateKey,
  Logger,
  LogLevel,
  Mnemonic,
} from "@hashgraph/sdk";

import * as dotenv from "dotenv";

dotenv.config();

async function htsContractFunction() {
  const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY);
  const words = [
    "flower",
    "camera",
    "awkward",
    "coil",
    "father",
    "lava",
    "hair",
    "course",
    "switch",
    "adult",
    "symptom",
    "evidence",
  ];

  const mnemonic = await Mnemonic.fromWords(words);
  const ed25519PrivKey = await mnemonic.toStandardEd25519PrivateKey();
  const privKeyCapitalCase = ed25519PrivKey.toStringRaw().toUpperCase();
  console.log("Capital case of private key", privKeyCapitalCase);
  console.log(
    "Public key",
    ed25519PrivKey.publicKey.toStringRaw().toUpperCase()
  );
  //const depricatedPrivatekey = await mnemonic.toEd25519PrivateKey();
  //const privKey = await mnemonic.toStandardEd25519PrivateKey();

  /*console.log("Private key from mnemonic", privKey.toStringDer());
  console.log("Private key from mnemonic raw", privKey.toStringRaw());
  console.log(privKey._key);
  console.log("public key from mnemonic", privKey.publicKey.toStringRaw());
  */

  /*
  const privKeyDirect = PrivateKey.fromStringED25519(
    "302e020100300506032b6570042204208dd10cfec6fddfef379f2b6e34838d2e7aabe2ebc32e7dcadbba47d86da75e02"
  );
  console.log("Direct private key", privKeyDirect);
  console.log("Direct public key", privKeyDirect.publicKey.toStringDer());

  const privKeyNon = await mnemonic.toEd25519PrivateKey();
  console.log("private key from mnemonic deprecated", privKeyNon.toStringDer());
  */
}

void htsContractFunction();
