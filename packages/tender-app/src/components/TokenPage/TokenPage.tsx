import React, {Component} from 'react'
import {  Button, Heading, Text } from "rimble-ui"
import {Container, Row, Col, Tabs, Tab, Form} from "react-bootstrap"
import { Link } from 'react-router-dom';
import ethers from "ethers"
import * as api from "../../api/staker"

export type TokenPageProps = {
  info: CardInfo,
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
}

type CardInfo = {
  description: string,
  stakerAddress: string,
  title: string,
  available: boolean,
}

interface State {
  tokenBalance: string,
  tenderBalance: string,
}

export default class TokenPage extends Component<TokenPageProps, State> {

  constructor(props: TokenPageProps) {
    super(props)
    this.state = {
      tokenBalance: "0",
      tenderBalance: "0",
    }
    // this.tokenBalance(this.props.provider).then().catch(e => console.log(e))
  }

  static defaultProps = {
    info: {
      description: '',
      stakerAddress: '',
      title: '',
      available: false
    },
  }

  componentDidMount() {
    this.tokenBalance(this.props.provider).then().catch(e => console.log(e))
    this.tenderBalance(this.props.provider).then().catch(e => console.log(e))
  }

  tenderBalance = async (provider:any) => {
    const address = await provider.getSigner().getAddress()
    api.tenderBalance(address, this.props.info.stakerAddress, provider).then(bal => {
      this.setState({...this.state, tenderBalance: bal})
    }).catch(e => console.log(e))
  }

  tokenBalance = async (provider:any) => {
    const address = await provider.getSigner().getAddress()
    api.tokenBalance(address, this.props.info.stakerAddress, provider).then(bal => {
      this.setState({...this.state, tokenBalance: bal})
    }).catch(e => console.log(e))
  }

  handleDeposit = async (event:any) => {
    event.preventDefault()
    await api.deposit(event.currentTarget.formDeposit.value, this.props.info.stakerAddress, this.props.provider.getSigner())
  }

  handleWithdraw = async (event:any) => {
    event.preventDefault()
    await api.withdraw(event.currentTarget.formWithdraw.value, this.props.info.stakerAddress, this.props.provider.getSigner())
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
                  <Form onSubmit={this.handleDeposit}>
                  <Form.Group controlId="formDeposit">
                    <Form.Label>Deposit Amount</Form.Label>
                    <Form.Control type="text" placeholder="0" />
                    <Form.Text className="text-muted">
                      Current Balance: {this.state.tokenBalance} 
                    </Form.Text>
                  </Form.Group>
                  <Button type="submit">Deposit</Button>
                  </Form>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <Form onSubmit={this.handleWithdraw}>
                  <Form.Group controlId="formWithdraw">
                    <Form.Label>Withdraw Amount</Form.Label>
                    <Form.Control type="text" placeholder="0" />
                    <Form.Text className="text-muted">
                      Current Balance: {this.state.tenderBalance}
                    </Form.Text>
                  </Form.Group>
                  <Button type="submit">Withdraw</Button>
                  </Form>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
        </>
    );
  }
}