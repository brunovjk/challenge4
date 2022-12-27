import React, { useState, useEffect } from "react";
import "./SPL.css";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import {
  getProvider,
  connectAccount,
  disconnect,
  getTokenBalance,
  mintTokensTo,
} from "../functions";

export default function SPL() {
  const MINT_ACCOUNT_ADRESS: string =
    "G4366ppihJf2STjcPseMiDkDWnR4kiwkcYCo6kN3Fo32";
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  // create state variable for the connected wallet key
  const [connectedWallet, setConnectedWallet] = useState<
    ConnectedWallet | undefined
  >();

  // create state variable for handling last transaction hash
  // const [lastHash, setLastHash] = useState();
  // create state variable control loading button
  const [loading, setLoading] = useState({
    create: false,
    connect: false,
    disconnect: false,
    transfer: false,
  });
  // this is the function that runs whenever the component updates (e.g. render, refresh)
  useEffect(() => {
    const provider = getProvider();

    // if the phantom provider exists, set this as the provider
    if (provider) {
      setProvider(provider);
      provider.on("accountChanged", async () => {
        const balance: number | undefined = await getTokenBalance(
          provider.publicKey,
          new web3.PublicKey(MINT_ACCOUNT_ADRESS)
        );
        if (balance !== undefined) {
          setConnectedWallet({
            publicKey: provider.publicKey,
            balance: balance,
          });
        }
      });
    } else setProvider(undefined);
  }, []);

  /**
   * @description prompts user to connect wallet if it exists.
   * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    setLoading({ ...loading, connect: true });
    try {
      const publicKey: web3.PublicKey | undefined = await connectAccount();
      if (publicKey !== undefined) {
        const balance: number | undefined = await getTokenBalance(
          publicKey,
          new web3.PublicKey(MINT_ACCOUNT_ADRESS)
        );
        if (balance !== undefined) {
          setConnectedWallet({
            publicKey: publicKey,
            balance: balance,
          });
        }
      }
    } catch (err) {
      alert(err);
      console.log("Connect error:", err);
      // { code: 4001, message: 'User rejected the request.' }
    }
    setLoading({ ...loading, connect: false });
  };
  /**
   * @description prompts user to disconnect wallet if connected.
   * This function is called when the disconnect wallet button is clicked
   */
  const disconnectWallet = async () => {
    setLoading({ ...loading, disconnect: true });

    try {
      await disconnect();
      setConnectedWallet({
        publicKey: undefined,
        balance: undefined,
      });
    } catch (err) {
      alert(err);
      console.log("Disconnect error:", err);
      // { code: 4001, message: 'User rejected the request.' }
    }
    setLoading({ ...loading, disconnect: false });
  };
  // /**
  //  * @description prompts user to Create Tokens to Connected Account
  //  * This function is called when the Create Tokens to Connected Account button is clicked
  //  */
  // const createSPLTokens = async () => {
  //   const connection = new web3.Connection(
  //     web3.clusterApiUrl("devnet"),
  //     "confirmed"
  //   );
  //   try {
  //     if (connectedWallet?.publicKey !== undefined) {
  //       const mintAccount: web3.PublicKey = await createMintAccount(
  //         connectedWallet.publicKey
  //       );
  //       const mintInfo: token.Mint = await token.getMint(
  //         connection,
  //         mintAccount
  //       );
  //       const tokenAccount: web3.PublicKey = await createTokenAccount(
  //         connectedWallet.publicKey,
  //         mintAccount
  //       );
  //       setTokenAccount(mintAccount);
  //       await mintTokensTo(
  //         connectedWallet.publicKey,
  //         mintAccount,
  //         100 * 10 ** mintInfo.decimals,
  //         tokenAccount
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  /**
   * @description prompts user to Mint Tokens to Connected Account
   * This function is called when the Mint Tokens to Connected Account button is clicked
   */
  const mintSPLTokens = async (amount: number) => {
    const connection = new web3.Connection(
      web3.clusterApiUrl("devnet"),
      "confirmed"
    );
    try {
      if (connectedWallet?.publicKey !== undefined) {
        const mintInfo: token.Mint = await token.getMint(
          connection,
          new web3.PublicKey(MINT_ACCOUNT_ADRESS)
        );
        const tokenAccount: web3.PublicKey | undefined =
          await token.getAssociatedTokenAddress(
            mintInfo.address,
            connectedWallet.publicKey
          );
        console.log("tokenAccount:", tokenAccount.toString());
        if (tokenAccount !== undefined && mintInfo.mintAuthority !== null) {
          await mintTokensTo(
            mintInfo.mintAuthority,
            connectedWallet.publicKey,
            mintInfo.address,
            amount * 10 ** mintInfo.decimals,
            tokenAccount
          );
          const balance: number | undefined = await getTokenBalance(
            connectedWallet.publicKey,
            mintInfo.address
          );
          if (balance !== undefined) {
            setConnectedWallet({
              ...connectedWallet,
              balance: balance,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* <div className="Component">
        <button
          className={`Button ${
            (connectedWallet?.publicKey === undefined || loading.connect) &&
            "disabled"
          }`}
          onClick={createSPLTokens}
        >
          Create Tokens to Connected Account
        </button>
      </div> */}
      {/*
       * Mint SPLTokenTest and send to connected wallet
       */}
      <div className="Component">
        <div className="Token-details margin1rem">
          <div className="Token-name subtitleLarge">SPLTokenTest</div>
          <div className="Token-creator">{MINT_ACCOUNT_ADRESS}</div>
        </div>
        {provider ? (
          <>
            {connectedWallet?.publicKey !== undefined ? (
              <button
                className={`Button margin1rem ${
                  loading.disconnect && "disabled"
                }`}
                onClick={disconnectWallet}
              >
                {!loading.disconnect ? "Disconnect Wallet" : "Disconnecting..."}
              </button>
            ) : (
              <button
                className={`Button margin1rem ${loading.connect && "disabled"}`}
                onClick={connectWallet}
              >
                {!loading.connect
                  ? "Connect to Phantom Wallet"
                  : "Connecting..."}
              </button>
            )}
          </>
        ) : (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}

        <div className="BalanceAndMint margin1rem">
          <div className="Balance">
            <div className="subtitle">SPLTokenTest Balance</div>
            <div className="Balance-number">
              {connectedWallet?.balance !== undefined ? (
                <>
                  <span>{connectedWallet.balance}</span>
                  <span className="subtitle"> STT</span>
                </>
              ) : (
                "--"
              )}
            </div>
          </div>
          <button
            className={`Button mint ${
              connectedWallet?.publicKey === undefined && "disabled"
            }`}
            onClick={() => mintSPLTokens(10)}
          >
            Mint 10 SST
          </button>
        </div>
      </div>
      {/*
       * Candy Machine UI
       */}
      <div className="Component">Candy Machine UI</div>
    </div>
  );
}
