import React from "react";
import { FeaturedCards } from "..";
import { Card, Heading, Text, Image } from "rimble-ui";
import { Container, Row, Col } from "react-bootstrap";
export default class Home extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <>
        <Container>
          <Row className="app-header">
            <Col md={{ span: 12 }}>
              <Heading className="title" style={{ marginTop: "1em" }}>
                Don&apos;t just stake me,
              </Heading>
              <Heading className="title">
                <span style={{ color: "#4E66DE" }}>Tenderize</span> me first
              </Heading>
              <Text
                className="subtext"
                style={{ marginTop: "1em", fontWeight: "600" }}
              >
                Make
                <span style={{ color: "#4E66DE", fontWeight: 900 }}>
                  {" staking easier "}
                </span>
                to chew.
              </Text>
              <img width="150" src="steak-hammer.svg" alt="logo" />
            </Col>
          </Row>
          <Row>
            <FeaturedCards provider={this.props.provider} />
          </Row>
        </Container>
      </>
    );
  }
}
