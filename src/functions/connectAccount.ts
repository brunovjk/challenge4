import { getProvider } from "./getProvider";
/**
 * @description Return user to connect wallet if it exists.
 */
export const connectAccount = async () => {
  const provider = getProvider();
  try {
    const account = await provider?.connect();
    console.log("Wallet connected:", account?.publicKey.toString());

    return [account, account?.publicKey.toString()];
  } catch (err: any) {
    alert(err);
    return err;
    // { code: 4001, message: 'User rejected the request.' }
  }
};
