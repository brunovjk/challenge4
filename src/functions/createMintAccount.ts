import * as web3 from "@solana/web3.js";
import { buildCreateMintTransaction } from "./mintTokenTransactions";
import { sendTxUsingExternalSignature } from "./sendTxUsingExternalSignature";
/**
 * @description  Create Mint Account
 */
export const createMintAccount = async (account: any) => {
  console.log(new web3.PublicKey(account));
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    const transaction = await buildCreateMintTransaction(
      connection,
      new web3.PublicKey(account),
      9
    );

    const signature = await sendTxUsingExternalSignature(transaction);
    return signature;
  } catch (error: any) {
    return error;
  }
};
