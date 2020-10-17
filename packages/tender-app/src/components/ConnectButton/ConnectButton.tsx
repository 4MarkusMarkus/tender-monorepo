import React from "react";
import { Button } from "rimble-ui";




class ConnectButton extends React.Component<any> {

  constructor(props: any){
    super(props);
  }

  render() {
    return (

          (<Button.Outline mt={1} bg="white" onClick={this.props.onConnect} style={{zIndex: 99}}>Connect Wallet</Button.Outline>)
  
    )

  }
}

export default ConnectButton;