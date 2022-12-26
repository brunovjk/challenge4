import React, { useState, useEffect } from "react";
import "./SPL.css";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import {
  getProvider,
  connectAccount,
  disconnect,
  getWalletBalance,
  createMintAccount,
  createTokenAccount,
} from "../functions";

export default function SPL() {
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  // create state variable for the connected wallet key
  const [connectedWallet, setConnectedWallet] = useState({
    publicKey: undefined,
    balance: undefined,
  });
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
    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);
  /**
   * @description prompts user to connect wallet if it exists.
   * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    setLoading({ ...loading, connect: true });
    try {
      const publicKey = await connectAccount();
      const balance = await getWalletBalance(publicKey);
      setConnectedWallet({
        publicKey: publicKey,
        balance: balance,
      });
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
  /**
   * @description prompts user to Create Tokens to Connected Account
   * This function is called when the Create Tokens to Connected Account button is clicked
   */
  const createSPLTokens = async () => {
    const connection = new web3.Connection(
      web3.clusterApiUrl("devnet"),
      "confirmed"
    );
    try {
      if (connectedWallet.publicKey !== undefined) {
        const mintAccount: web3.PublicKey = await createMintAccount(
          connectedWallet.publicKey
        );
        const tokenAccount: web3.PublicKey = await createTokenAccount(
          connectedWallet.publicKey,
          mintAccount
        );
        console.log(tokenAccount);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className="Component">
        <button
          className={`Button ${
            (connectedWallet.publicKey === undefined || loading.connect) &&
            "disabled"
          }`}
          onClick={createSPLTokens}
        >
          Create Tokens to Connected Account
        </button>
      </div>
      {/*
       * Mint SPLTokenTest and send to connected wallet
       */}
      <div className="Component">
        <div className="Token-details margin1rem">
          <div className="Token-name subtitleLarge">SPLTokenTest</div>
          <div className="Token-creator">
            0000000000000000000000000000000000000000
          </div>
        </div>
        {provider ? (
          <>
            {connectedWallet.publicKey !== undefined ? (
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
              {connectedWallet.balance !== undefined
                ? connectedWallet.balance
                : "--"}
            </div>
          </div>
          <button className="Button mint">Mint</button>
        </div>
      </div>
      {/*
       * Candy Machine UI
       */}
      <div className="Component">Candy Machine UI</div>
    </div>
  );
}
