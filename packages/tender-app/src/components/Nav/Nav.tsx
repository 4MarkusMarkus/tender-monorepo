import React from 'react'
import { ConnectButton } from "..";
import Address from "../Address/Address"
import { Row, Col } from "react-bootstrap"

export default class Nav extends React.Component<any> {

  constructor(props:any) {
    super(props)
  }

  render() {
    let component 
    if (this.props.cachedProvider) {
      component = (
        <Col md={{span:5, offset: 7}}>
          <Address mt={1} address={this.props.address} />
        </Col>
      )
    } else {
      component = (
        <Col md={{ span:2, offset: 10}}>
        <ConnectButton onConnect={this.props.onConnect} />
        </Col>
      )
    }
    return(
      <>
        <Row>
          {component}
        </Row>
      </>
    );
  }
 }