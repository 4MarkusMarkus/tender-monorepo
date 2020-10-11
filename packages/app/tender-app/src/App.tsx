import React from "react";
import logo from "./logo.svg";
import "./App.css";
//import WalletConnectProvider from "@walletconnect/web3-provider";
//import Portis from "@portis/web3";
import ConnectWalletButton from "./components/ConnectWalletButton";
import { Box, Button, Heading, Text } from "rimble-ui";
import ethers from "ethers";
declare global {
  interface Window {
    ethereum: any;
  }
}

//const providerOptions = {
//  walletconnect: {
//    package: WalletConnectProvider, // required
//    options: {
//      infuraId: "INFURA_ID", // required
//    },
//  },
//  portis: {
//    package: Portis, // required
//    options: {
//      id: "PORTIS_ID", // required
//    },
//  },
//};

function App() {
  window.ethereum.enable();
  const read_provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545" //switch to ENV var
  );
  const write_provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner();

  const contractABI = require("./helloWorld.json").abi;
  console.log(contractABI);
  const counter = new ethers.Contract(
    ethers.utils.getAddress("0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F"),
    contractABI,
    write_provider
  );

  (async function() {
    //console.log(await counter);
    read_provider
      .getCode(
        ethers.utils.getAddress("0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F")
      )
      .then(function(code) {
        console.log("Code:", code);
      });
    console.log(await counter.callStatic.helloWorld({ gasLimit: 500000 }));
  })();
  return (
    <div className="app">
      <Box>
        <header className="app-header">
          <span className="logo">🥩🔨</span>
          <Heading className="title">Tenderize.me</Heading>
          <Text className="subtext">Don&apos;t just stake me.  Tenderize me first.</Text>
          <ConnectWalletButton />
        </header>
      </Box>
    </div>
  );
}

export default App;
