import React from "react";
import { FeaturedCards } from "..";
import { Heading, Text } from "rimble-ui";
import { Container, Row, Col } from "react-bootstrap";
import "./home.scss";
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
                The tastiest
                <span style={{ color: "#4E66DE" }}> liquid stake</span>
              </Heading>
              <Heading className="title">money can buy.</Heading>
              <Text
                className="subtext"
                style={{ marginTop: "1em", fontWeight: "600" }}
              >
                Make staking
                <span style={{ color: "#4E66DE", fontWeight: 900 }}>
                  {" easier "}
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
