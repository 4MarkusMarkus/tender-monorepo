import React, {Component} from 'react'
import {Card, Col} from 'react-bootstrap'
import "./TokenCard.css"
export default class TokenCard extends Component {
    constructor(props: any) { super(props) }
    
    render() {
        return (
            <Col md={{span:4}}>
                <Card className="card" style={{ width: '100%' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>
            </Col>
        )
    }
}