import { SystemProgram } from "@solana/web3.js";
// import { createInitializeMintInstruction } from "@solana/spl-token";
import { sendTxUsingExternalSignature } from "../functions";

/**
 * @description  Create Mint Account
 */
export const createMintAccount = async (from: any) => {
  try {
    // Transaction instructions
    const instructions = SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: from.publicKey,
      lamports: 100000,
    });

    const signature = await sendTxUsingExternalSignature(instructions);
    return signature;
  } catch (error: any) {
    return error;
  }
};

// const mint = await createMint(
//   connection,
//   keyPair,
//   keyPair.publicKey,
//   null,
//   9
// );

// return mint;
