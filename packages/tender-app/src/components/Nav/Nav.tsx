import React from 'react'
import { ConnectButton } from "..";
import { Row, Col } from "react-bootstrap"

export default function Nav() {
  return(
    <>
      <Row>
        <Col md={{ span:2, offset: 10}}>
        <ConnectButton />
        </Col>
      </Row>
    </>
  );
}