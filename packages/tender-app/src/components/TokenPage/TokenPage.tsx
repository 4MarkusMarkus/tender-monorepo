import React, {Component} from 'react'
import {  Button, Heading, Text } from "rimble-ui"
import {Container, Row, Col, Tabs, Tab, Form} from "react-bootstrap"
import { Link } from 'react-router-dom';

export type TokenPageProps = {
  info: CardInfo
}

type CardInfo = {
  description: string,
  stakerAddress: string,
  title: string,
  available: boolean,
}


export default class TokenPage extends Component<TokenPageProps> {

  static defaultProps = {
    info: {
      description: '',
      stakeraddress: '',
      title: '',
      available: false
    },
  }

  render() {
    const { info } = this.props

    return(
      <>
      <Link to="/">
        <Button.Text icon="KeyboardArrowLeft">Back</Button.Text>
      </Link>
      <Container>
        <Row>
          <Col lg={{span: 6}}>
            <Heading>{info.title}</Heading>
            <Text>{info.description}</Text>
          </Col>
          <Col>
            <Tabs transition={false} defaultActiveKey="deposit">
              <Tab eventKey="deposit" title="Deposit">
                <Form.Group controlId="formDeposit">
                  <Form.Label>Deposit Amount</Form.Label>
                  <Form.Control type="text" placeholder="0" />
                  <Form.Text className="text-muted">
                    Current Balance: 0 
                  </Form.Text>
                </Form.Group>
              </Tab>
              <Tab eventKey="withdraw" title="Withdraw">
                <Form.Group controlId="formWithdrawal">
                  <Form.Label>Withdraw Amount</Form.Label>
                  <Form.Control type="text" placeholder="0" />
                  <Form.Text className="text-muted">
                    Current Balance: 0 
                  </Form.Text>
                </Form.Group>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}