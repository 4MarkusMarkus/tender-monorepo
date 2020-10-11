import React, {Component} from 'react'
import {Row, CardDeck, Col} from 'react-bootstrap'
import TokenCard from '../TokenCard/TokenCard'
import { Link } from 'rimble-ui';
import "./FeaturedCards.css"

export default class FeaturedCards extends Component {
    render() {
        return (
           <Row>
               <Col className="explore" md={{span:2, offset: 10}}>
                <Link>Explore More</Link>
               </Col>
                <Col md={{span: 12}}>
                    <CardDeck>
                    <TokenCard></TokenCard>
                    <TokenCard></TokenCard>
                    <TokenCard></TokenCard>
                </CardDeck>
                </Col>
           </Row>
        )
    }
}