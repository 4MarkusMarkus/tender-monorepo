import React, {Component} from 'react'
import {Row, CardDeck, Col} from 'react-bootstrap'
import TokenCard from '../TokenCard/TokenCard'
import { Link } from 'rimble-ui';
import "./FeaturedCards.css"
import stakers from "../../data/stakers"

export default class FeaturedCards extends Component {
    render() {
        const cards = []
        let key:string
        for (key in stakers) {
            cards.push(<TokenCard info={stakers[key]} url={key} key={key}/>)
        }
        return (
           <Row>
               <Col className="explore" md={{span:2, offset: 10}}>
                <Link>Explore More</Link>
               </Col>
                <Col md={{span: 12}}>
                    <CardDeck>
                        {cards}
                    </CardDeck>
                </Col>
           </Row>
        )
    }
}