import * as anchor from "@coral-xyz/anchor";
import {Program, Wallet} from "@coral-xyz/anchor";
import { CreateToken } from "../target/types/create_token";
import {Buffer} from "node:buffer";
import {Keypair, PublicKey} from "@solana/web3.js";

// describe("create-token", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());
//
//   const program = anchor.workspace.CreateToken as Program<CreateToken>;
//
//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

describe("nft-token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const connection = provider.connection;
  const wallet = provider.wallet as Wallet;

  const program = anchor.workspace.CreateToken as Program<CreateToken>;

    const metadata = {
        name: 'Home Did Token',
        symbol: 'HOME-DID',
        uri: 'https://github.com/tnexus/assets/blob/main/token/home.json',
    };

  it("Create an SPL Token!", async () => {
    const mintKeypair = new Keypair();

    // SPL Token default = 9 decimals
    const transactionSignature = await program.methods
        .createTokenMint(6, metadata.name, metadata.symbol, metadata.uri)
        .accounts({
          payer: wallet.publicKey,
          mintAccount: mintKeypair.publicKey,
        })
        .signers([mintKeypair])
        .rpc();

    console.log('Success!');
    console.log(`   Mint Address: ${mintKeypair.publicKey}`);
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });
});
