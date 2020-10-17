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
        <Col md={{span:3, offset: 6}}>
          <Address address={this.props.address} />
        </Col>
      )
    } else {
      component = (
        <Col md={{ span:3, offset: 6}}>
        <ConnectButton onConnect={this.props.onConnect} />
        </Col>
      )
    }
    return(
      <>
        <Row>
        <Col md={{ span: 3 }} lg={{ span:3 }}>
          <img src="tenderizeLogo.svg" alt="logo" style={{marginTop: "1em"}}/>
        </Col>
          {component}
        </Row>
      </>
    );
  }
 }