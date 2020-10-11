import React from "react";
import "./App.css";
import { ConnectButton, FeaturedCards } from "./components";
import { Flex, Box, Button, Heading, Text } from "rimble-ui";

import {Container, Row, Col} from "react-bootstrap"
//declare global {
//  interface Window {
//    ethereum: any;
//  }
//}

/*
*/
//const web3Modal = new Web3Modal({
//  // network: "mainnet", // optional
//  cacheProvider: true, // optional
//  providerOptions: {
//    walletconnect: {
//      package: WalletConnectProvider, // required
//      options: {
//        infuraId: "INFURA_ID" //TODO Make this an ENV,
//      },
//    },
//  },
//});
//
//const logoutOfWeb3Modal = async () => {
//  await web3Modal.clearCachedProvider();
//  setTimeout(() => {
//    window.location.reload();
//  }, 1);
//};


function App() {
  //const [injectedProvider, setInjectedProvider] = useState();

  ///*
  //* Web3 modal account login setup
  //*/
  //const provider = await web3Modal.connect();

  //useEffect(() => {
  //  if (web3Modal.cachedProvider) {
  //    loadWeb3Modal();
  //  }
  //}, [loadWeb3Modal]);

  //const userProvider = useUserProvider(injectedProvider);

  /*
     Ethers test contract
     TODO: Delete this, nephew
  window.ethereum.enable();
  const read_provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545" //switch to ENV var
  );
  const write_provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner();

  const contractABI = require("./temp-abi/helloWorld.json").abi;
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
  */


  /*
    Return the app!
  */
  return (
      <Container>
        <Row>
          <Col md={{ span:2, offset: 10}}>
          <ConnectButton />
          </Col>
        </Row>
        <Row className="app-header">
          <Col md={{ span: 10, offset: 1}}>
            <Heading className="title"><span className="logo">🥩</span>Tenderize.me<span className="logo">🔨</span></Heading>
            <Text className="subtext">Don&apos;t just stake me.  Tenderize me first.</Text>
          </Col>
        </Row>
        <FeaturedCards></FeaturedCards>
      </Container>
  );
}

export default App;
