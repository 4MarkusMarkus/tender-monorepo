import React from "react";
import ethers from "ethers"
import Web3Modal from "web3modal";
import { Button } from "rimble-ui";

const providerOptions = {
  /* See Provider Options Section */
};

class ConnectButton extends React.Component {

  constructor(props: any){
    super(props);
  }

  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public onConnect = async () => {
    let provider = await this.web3Modal.connect()

     const signer = new ethers.providers.Web3Provider(provider).getSigner()

     console.log("connected: ", signer);
  // Save signer in redux store
  }

  render() {
    return (<Button.Outline mt={1} bg="white" onClick={this.onConnect} style={{zIndex: 99}}>Connect Wallet</Button.Outline>)
  }
}

export default ConnectButton;