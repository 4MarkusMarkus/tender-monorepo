import React, {Component} from 'react'
import {Card, Col} from 'react-bootstrap'
import { Link } from "react-router-dom"
import {  Button, Heading, Text, Avatar } from "rimble-ui"
import classNames from "classnames";
import "./TokenCard.scss"
import {SharePrice} from ".."
import {ethers} from "ethers"
type TokenCardProps = {
    url: string,
    info: CardInfo
    provider:ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
}

type CardInfo = {
    description: string,
    stakerAddress: string,
    title: string,
    available: boolean,
    apy: number,
    logo: string,
    symbol: string
}

export default class TokenCard extends Component<TokenCardProps> {

    static defaultProps = {
        title: 'Card Title',
        description: '',
        image: 'https://airswap-token-images.s3.amazonaws.com/DAI.png',
        stakerAddress: '',
        url: '/',
        apy: 0.0,
        available: false,
    }

    render() {
        const { url, info } = this.props
        const logo = require("../../img/" + info.logo)
        const ctaText = () => {
            return info.available ? "Discover" : "Coming Soon"
        }

        const renderCard = () => {
            return(
                <Card className={classNames({ disabled: !info.available})}style={{marginTop: "1em"}}>
                    <Avatar
                        size="large"
                        src={logo}
                        style={{margin: "1em auto 0"}}
                    />
                    <Card.Body style={{ textTransform: "capitalize", textAlign: "center" }}>
                        <Card.Title>
                            <h2>{info.title.toUpperCase()}</h2>
                        </Card.Title>
                        <SharePrice symbol={this.props.info.symbol} available={this.props.info.available} stakerAddress={this.props.info.stakerAddress} provider={this.props.provider} />
                        <Button className="cta" disabled={!info.available}>{ctaText()}</Button>
                    </Card.Body>
                </Card>
            )
        }

        return (
            <Col xs={{span:12}} sm={{span:6}} md={{span:4}} lg={{span:4}}>
                { info.available ? (
                    <Link to={url} className="card-link">{renderCard()}</Link>
                ) : (
                    renderCard()
                )}

            </Col>
        )
    }
}