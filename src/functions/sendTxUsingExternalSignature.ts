import * as web3 from "@solana/web3.js";
import { getProvider } from "./getProvider";

export const sendTxUsingExternalSignature = async (
  _transaction: web3.Transaction
) => {
  const provider = getProvider();
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  let transaction = _transaction;
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
