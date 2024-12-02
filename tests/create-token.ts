import * as anchor from "@coral-xyz/anchor";
import {Program, Wallet} from "@coral-xyz/anchor";
import {CreateToken} from "../target/types/create_token";
import {Buffer} from "node:buffer";

import {getExplorerLink,} from "@solana-developers/helpers";
import {PublicKey, sendAndConfirmTransaction, Transaction,} from "@solana/web3.js";
import {createCreateMetadataAccountV3Instruction} from "@metaplex-foundation/mpl-token-metadata";

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

    // const metadata = {
    //     name: 'Home Did Token',
    //     symbol: 'HOME-DID',
    //     uri: 'https://github.com/tnexus/assets/blob/main/token/home.json',
    // };

    const metadataData = {
        name: 'Home Did Token',
        symbol: 'HOME-DID',
        // Arweave / IPFS / Pinata etc link using metaplex standard for offchain data
        uri: 'https://github.com/tnexus/assets/blob/main/token/home.json',
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
    };

    // it("Create an SPL Token!", async () => {
    //   const mintKeypair = new Keypair();
    //
    //   // SPL Token default = 9 decimals
    //   const transactionSignature = await program.methods
    //       .createTokenMint(9, metadata.name, metadata.symbol, metadata.uri)
    //       .accounts({
    //         payer: wallet.publicKey,
    //         mintAccount: mintKeypair.publicKey,
    //       })
    //       .signers([mintKeypair])
    //       .rpc();
    //
    //   console.log('Success!');
    //   console.log(`   Mint Address: ${mintKeypair.publicKey}`);
    //   console.log(`   Transaction Signature: ${transactionSignature}`);
    // });

    it('should ', async () => {

        const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        );

        const tokenMintAccount = new PublicKey("DV6uUKMo5fNLjXKzjUesWSWEAJqosVcabjAJLkykxRu8");

        const user = wallet;

        const metadataPDAAndBump = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                tokenMintAccount.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID,
        );

        const metadataPDA = metadataPDAAndBump[0];

        const transaction = new Transaction();

        const createMetadataAccountInstruction =
            createCreateMetadataAccountV3Instruction(
                {
                    metadata: metadataPDA,
                    mint: tokenMintAccount,
                    mintAuthority: user.publicKey,
                    payer: user.publicKey,
                    updateAuthority: user.publicKey,
                },
                {
                    createMetadataAccountArgsV3: {
                        collectionDetails: null,
                        data: metadataData,
                        isMutable: true,
                    },
                },
            );

        transaction.add(createMetadataAccountInstruction);

        const transactionSignature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [user.payer],
        );

        const transactionLink = getExplorerLink(
            "transaction",
            transactionSignature,
            "devnet",
        );

        console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}`);

        const tokenMintLink = getExplorerLink(
            "address",
            tokenMintAccount.toString(),
            "devnet",
        );

        console.log(`✅ Look at the token mint again: ${tokenMintLink}`);
    });
});
