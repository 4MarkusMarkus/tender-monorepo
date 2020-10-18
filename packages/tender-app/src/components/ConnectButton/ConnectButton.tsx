import React from "react";
import { Button } from "rimble-ui";




class ConnectButton extends React.Component<any> {

  constructor(props: any){
    super(props);
  }

  render() {
    return (
      <Button.Outline mt={1} mainColor="#4E66DE" onClick={this.props.onConnect} style={{zIndex: 99, background: "white"}}>Connect Wallet</Button.Outline>
    )
  }
}

export default ConnectButton;