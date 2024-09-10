import { Mnemonic } from "@hashgraph/sdk";

const mnemonic = [
  "outer",
  "drastic",
  "print",
  "brave",
  "edge",
  "student",
  "enemy",
  "matrix",
  "chest",
  "just",
  "away",
  "robust",
  "inspire",
  "indicate",
  "trend",
  "beyond",
  "pony",
  "wood",
  "truly",
  "sword",
  "more",
  "major",
  "regular",
  "vicious",
];

console.log("here");
const generatedMnemonic = await Mnemonic.fromWords(mnemonic);
console.log("there");

let rootPrivateKeyNew3,
  nullPrivateKeyNew3,
  rootPrivateKeyNew4,
  nullPrivateKeyNew4;

try {
  console.log("Attempting to generate rootPrivateKeyNew3");
  rootPrivateKeyNew3 =
    await generatedMnemonic.toStandardECDSAsecp256k1PrivateKey();

  console.log(rootPrivateKeyNew3.toStringDer());
  console.log(rootPrivateKeyNew3.publicKey.toStringDer());
  console.log("finished");
} catch (error) {
  console.log("Error generating rootPrivateKeyNew3:", error);
}
