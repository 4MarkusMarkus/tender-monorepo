import React from 'react'
import { FeaturedCards } from "..";
import { Heading, Text } from "rimble-ui"
import { Container, Row, Col} from "react-bootstrap"
import "./home.scss"
export default function Home() {
  return(
    <>
    <Container>
      <Row className="app-header">
        <Col md={{ span: 12}}>
          <Heading className="title"style={{marginTop:"1em"}}>Don&apos;t just stake me,</Heading>
          <Heading className="title" >
            <span style={{color:"#4E66DE"}}>Tenderize</span> me first</Heading>
          <Text className="subtext" style={{marginTop:"1em", fontWeight: "600"}}>The tastiest <span style={{color: "#4E66DE", fontWeight:900}}>liquid stake</span> money can buy.</Text>
          <img width="200" src="steak-hammer.svg" alt="logo" />
        </Col>
      </Row>
      <Row>
        <FeaturedCards />
      </Row>
      </Container>
    </>
  );
}