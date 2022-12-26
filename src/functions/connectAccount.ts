import { getProvider } from "./getProvider";
/**
 * @description Return user to connect wallet if it exists.
 */
export const connectAccount = async () => {
  const provider = getProvider();
  try {
    const publicKey = await provider?.connect();
    console.log("Wallet connected:", publicKey?.publicKey.toString());
    return publicKey?.publicKey.toString();
  } catch (err: any) {
    alert(err);
    return err;
    // { code: 4001, message: 'User rejected the request.' }
  }
};
