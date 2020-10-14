import React, {Component} from 'react'
import { ConnectButton, FeaturedCards } from "..";
import { Button, Heading, Text } from "rimble-ui"
import {Container, Row, Col} from "react-bootstrap"

export default function Home() {
  return(
    <>
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
      <Row>
        <FeaturedCards />
      </Row>
    </>
  );
}