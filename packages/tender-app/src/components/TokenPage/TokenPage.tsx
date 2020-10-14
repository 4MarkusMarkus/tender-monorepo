import React, {Component} from 'react'
import { ConnectButton, FeaturedCards } from "..";
import { Button, Heading, Text } from "rimble-ui"
import {Container, Row, Col} from "react-bootstrap"

type TokenPageProps = {
  title: string,
}

export default class TokenPage extends Component<TokenPageProps> {

  static defaultProps = {
    title: 'Token Page',
  }

  render() {
    const { title } = this.props

    return(
      <Heading className="title">{title}</Heading>
    );
  }
}