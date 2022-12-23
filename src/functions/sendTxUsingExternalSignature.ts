import {
  Connection,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import { getProvider } from "./getProvider";

export const sendTxUsingExternalSignature = async (
  instructions: TransactionInstruction
) => {
  const provider = getProvider();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  let transaction = new Transaction().add(instructions);
  // Setting the variables for the transaction
  transaction.feePayer = await provider?.publicKey;
  let blockhashObj = await connection.getLatestBlockhash("max");
  transaction.recentBlockhash = await blockhashObj.blockhash;
  // Sign and send transaction
  const { signature }: any = await provider?.signAndSendTransaction(
    transaction
  );

  await connection.getSignatureStatus(signature);
  return signature;
};
