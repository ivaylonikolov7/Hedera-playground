import { Mnemonic, PrivateKey } from "@hashgraph/sdk";

/*
for (let i = 0; i < 10000; i++) {
  const mnemonic = await Mnemonic.generate();
  const privateKeyDirect = await mnemonic.toStandardEd25519PrivateKey();
  const samePrivateKey = privateKeyDirect.publicKey;

  const privateKeyFromStr = await PrivateKey.fromStringED25519(
    privateKeyDirect.toStringDer()
  );
  const samePrivateKeyFromStr = privateKeyFromStr.publicKey;
  if (samePrivateKey.toStringDer() !== samePrivateKeyFromStr.toStringDer()) {
    console.log("Private key mismatch");
    console.log("Private key from mnemonic: ", samePrivateKey);
    console.log("Private key from string: ", samePrivateKeyFromStr);
    break;
  }
}

console.log("Checked 10000 times for ECDSA, no mismatch found");
*/

for (let i = 0; i < 10000; i++) {
  const mnemonic = await Mnemonic.generate12();
  const privateKeyDirect = await mnemonic.toStandardEd25519PrivateKey();
  const samePrivateKey = privateKeyDirect.publicKey;

  const privateKeyFromStr = await PrivateKey.fromStringED25519(
    privateKeyDirect.toStringDer()
  );
  const samePrivateKeyFromStr = privateKeyFromStr.publicKey;
  if (samePrivateKey.toStringDer() !== samePrivateKeyFromStr.toStringDer()) {
    console.log("Private key mismatch");
    console.log("Private key from mnemonic: ", samePrivateKey);
    console.log("Private key from string: ", samePrivateKeyFromStr);
    break;
  }
}

console.log("Checked 10000 times for ED25519, no mismatch found");
/*

for (let i = 0; i < 1000; i++) {
  const mnemonic = await Mnemonic.generate();
  const privateKeyDirect = await mnemonic.toStandardECDSAsecp256k1PrivateKey();
  const samePrivateKey = privateKeyDirect.publicKey;

  const privateKeyFromStr = await PrivateKey.fromStringDer(
    privateKeyDirect.toStringDer()
  );
  const samePrivateKeyFromStr = privateKeyFromStr.publicKey;
  if (samePrivateKey.toStringDer() !== samePrivateKeyFromStr.toStringDer()) {
    console.log("Private key mismatch");
    console.log("Private key from mnemonic: ", samePrivateKey);
    console.log("Private key from string: ", samePrivateKeyFromStr);
    break;
  }
  console.log(i);
}

console.log("ALL GOOD");
//console.log(privateKeyDirect._key);
// console.log(privateKeyDirect.toBytesDer());
//console.log(privateKeyDirect.toBytesDer());
/*const publicKeyDirect = privateKeyDirect.publicKey.toStringRaw();
const privateKeyDirectDer = privateKeyDirect.toBytes();

*/
/*
console.log("Public from PrivateKey directly: ", publicKeyDirect);
console.log("PrivateKey directly: ", privateKeyDirectDer);
console.log(privateKeyDirect.publicKey.toStringRaw());
console.log("=====================");
*/

//console.log(privateKeyDirect.toStringDer());

//console.log(privateKeyFromStr.toBytesDer());
//console.log(privateKeyFromStr.toBytesDer());
// const privateKeyFromStrDer = privateKeyFromStr.toBytes();
// console.log("PrivateKey from string: ", privateKeyFromStrDer);
// const publicKeyFromStr = privateKeyFromStr.publicKey.toStringRaw();
/*
console.log("Public from PrivateKey from string: ", publicKeyFromStr);
console.log("=====================");
*/
