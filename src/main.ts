import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { userKeypair } from "./helpers";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createFungible,
  createV1,
  mintV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";

// This gives us access to the block chain
const umiClient = createUmi(clusterApiUrl("devnet"));
const keypair = umiClient.eddsa.createKeypairFromSecretKey(
  userKeypair.secretKey
);

umiClient.use(keypairIdentity(keypair)).use(mplTokenMetadata());

const metadata = {
  name: "Solana Gold",
  symbol: "GOLDSOL",
  uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

const mint = generateSigner(umiClient);
async function createMetadataDetails() {
  await createV1(umiClient, {
    mint,
    authority: umiClient.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umiClient);
}

async function mintToken() {
  await mintV1(umiClient, {
    mint: mint.publicKey,
    authority: umiClient.identity,
    amount: 10_000,
    tokenOwner: umiClient.identity.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umiClient);
}

async function main() {
  //   await createMetadataDetails();
  //   await mintToken();
  const txnSig = await createFungible(umiClient, {
    mint,
    authority: umiClient.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
  }).sendAndConfirm(umiClient);
  console.log(txnSig, mint);
}

main()
  .then(() => {
    console.log("Done creating token ");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
