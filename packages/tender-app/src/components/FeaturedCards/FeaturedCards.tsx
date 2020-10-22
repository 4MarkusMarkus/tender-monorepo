import React, { Component } from "react";
import { Row, CardDeck, Col } from "react-bootstrap";
import TokenCard from "../TokenCard/TokenCard";
import { Link } from "rimble-ui";
import "./FeaturedCards.scss";
import stakers from "../../data/stakers";

export default class FeaturedCards extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const cards = [];
    let key: string;
    for (key in stakers) {
      cards.push(
        <TokenCard
          provider={this.props.provider}
          info={stakers[key]}
          url={key}
          key={key}
        />
      );
    }
    return (
      <>
        <Col
          className="explore"
          md={{ span: 2, offset: 10 }}
          style={{ marginTop: "3em" }}
        >
          <Link color="#a8b7f0" className="coming-soon">
            More coming soon
          </Link>
        </Col>
        <Col md={{ span: 12 }}>
          <CardDeck>{cards}</CardDeck>
        </Col>
      </>
    );
  }
}
