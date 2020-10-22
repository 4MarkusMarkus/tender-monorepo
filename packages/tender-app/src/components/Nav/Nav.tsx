import React from "react";
import { ConnectButton } from "..";
import Address from "../Address/Address";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

export default class Nav extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const logo = require("../../img/tenderizeLogo.svg");

    let component;
    if (this.props.cachedProvider) {
      component = (
        <Col md={{ span: 3, offset: 6 }}>
          <Address address={this.props.address} />
        </Col>
      );
    } else {
      component = (
        <Col md={{ span: 3, offset: 6 }}>
          <ConnectButton onConnect={this.props.onConnect} />
        </Col>
      );
    }
    return (
      <>
        <Row>
          <Col md={{ span: 3 }} lg={{ span: 3 }}>
            <Link to="/">
              <img src={logo} alt="logo" style={{ marginTop: "1em" }} />
            </Link>
          </Col>
          {component}
        </Row>
      </>
    );
  }
}
