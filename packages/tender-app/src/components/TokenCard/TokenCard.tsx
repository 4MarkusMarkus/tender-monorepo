import React, {Component} from 'react'
import {Card, Col} from 'react-bootstrap'
import { Link } from "react-router-dom"
import "./TokenCard.scss"

type TokenCardProps = {
    url: string,
    info: CardInfo
}

type CardInfo = {
    description: string,
    stakerAddress: string,
    title: string,
    available: boolean,
}

export default class TokenCard extends Component<TokenCardProps> {

    static defaultProps = {
        title: 'Card Title',
        description: '',
        stakerAddress: '',
        url: '/',
        available: false,
    }

    render() {
        const { url, info } = this.props

        return (
            <Col md={{span:4}}>
                <Link to={url} className="card-link">
                    <Card className="card" style={{ width: '100%' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>{info.title}</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </Link>
            </Col>
        )
    }
}