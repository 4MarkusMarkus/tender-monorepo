import React from "react";
import { FeaturedCards } from "..";
import { Card, Heading, Text, Image } from "rimble-ui";
import { Container, Row, Col } from "react-bootstrap";
import "./Home.scss";
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
          <Row style={{ marginTop: "6em" }}>
            <Col lg={{ span: 6 }} md={{ span: 6 }}>
              <Image src="liquid.png"></Image>
            </Col>
            <Col lg={{ span: 6 }} md={{ span: 6 }}>
              <Heading as={"h4"} style={{ margin: "90px 10%", lineHeight: 2 }}>
                Tenderize is a liquid staking protocol that lets you
                <span style={{ fontWeight: 800 }}> leverage your tokens </span>
                while they stake and
                <span style={{ fontWeight: 800 }}> skip the wait </span>
                at withdraw.
              </Heading>
            </Col>
          </Row>
          <Row style={{ marginTop: "6em" }}>
            <Col>
              <Card>
                <Heading as={"h4"} style={{ margin: "3em 3em 0em 3em" }}>
                  <Row className="step">
                    <Col
                      className="step-label"
                      sm={{ span: 12 }}
                      md={{ span: 3 }}
                      lg={{ span: 2 }}
                    >
                      <span className="highlight">Step 1</span>
                    </Col>
                    <Col
                      className="step-text"
                      sm={{ span: 12 }}
                      md={{ span: 9 }}
                      lg={{ span: 10 }}
                    >
                      Order off our farm-fresh stake menu. Deposit your stake
                      and let the tenderizing begin.
                    </Col>
                  </Row>
                  <Row className="step">
                    <Col
                      className="step-label"
                      sm={{ span: 12 }}
                      md={{ span: 3 }}
                      lg={{ span: 2 }}
                    >
                      <span className="highlight">Step 2</span>
                    </Col>
                    <Col
                      className="step-text"
                      sm={{ span: 12 }}
                      md={{ span: 9 }}
                      lg={{ span: 10 }}
                    >
                      Receive a newly minted,
                      <span className="highlight bold">
                        {" "}
                        tender token{" "}
                      </span>{" "}
                      that represents your initial stake and any earned rewards.
                    </Col>
                  </Row>
                  <Row className="step">
                    <Col
                      className="step-label"
                      sm={{ span: 12 }}
                      md={{ span: 3 }}
                      lg={{ span: 2 }}
                    >
                      <span className="highlight">Step 3</span>
                    </Col>
                    <Col
                      className="step-text"
                      sm={{ span: 12 }}
                      md={{ span: 9 }}
                      lg={{ span: 10 }}
                    >
                      With your new
                      <span className="highlight bold"> tToken</span>, you can
                      skip the wait of your stake's unbonding period. Go
                      utilize, liquidize, and collateralize while you Tenderize.
                    </Col>
                  </Row>
                </Heading>
              </Card>
            </Col>
          </Row>
          <Row style={{ margin: "6em 0" }}>
            <Col lg={{ span: 6 }} md={{ span: 6 }}>
              <Image src="friends.png"></Image>
            </Col>
            <Col lg={{ span: 6 }} md={{ span: 6 }}>
              <Heading as={"h2"} className="friends">
                Friends don't let friends stake...unless they
                <span className="highlight"> Tenderize</span>.
              </Heading>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
