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
  apy: number,
  logo: string,
  symbol: string
}


interface State {
  tokenAddress: string,
  tenderTokenAddress: string,
  tokenBalance: string,
  tenderBalance: string,
  tokenAllowance: string,
  tenderAllowance: string,
  depositAmount: string,
  withdrawAmount: string
}

export default class TokenPage extends Component<TokenPageProps, State> {

  constructor(props: TokenPageProps) {
    super(props)
    this.state = {
      tokenAddress: "",
      tenderTokenAddress: "",
      tokenBalance: "0",
      tenderBalance: "0",
      tokenAllowance: "0",
      tenderAllowance: "0",
      depositAmount: "0",
      withdrawAmount: "0"
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

  handleDepositInputChange = async (event:any) => {
    await this.setState({...this.state, depositAmount: event.target.value});
  }

  handleWithdrawInputChange = async (event:any) => {
    await this.setState({...this.state, withdrawAmount: event.target.value});
  }

  async componentDidMount() {
    await this.setState({...this.state, tokenAddress: await api.token(this.props.info.stakerAddress, this.props.provider)})
    await this.setState({...this.state, tenderTokenAddress: await api.tenderToken(this.props.info.stakerAddress, this.props.provider)})
    await this.tokenAllowance(this.props.provider)
    await this.tenderTokenAllowance(this.props.provider)
    await this.tokenBalance(this.props.provider).then().catch(e => console.log(e))
    await this.tenderBalance(this.props.provider).then().catch(e => console.log(e))
    console.log(this.state)
  }

  tenderBalance = async (provider:any) => {
    const address = await provider.getSigner().getAddress()
    const bal = await api.balance(address, this.state.tenderTokenAddress, provider)
    await this.setState({...this.state, tenderBalance: bal})
  }

  tokenBalance = async (provider:any) => {
    const address = await provider.getSigner().getAddress()
    const bal = await api.balance(address, this.state.tokenAddress, provider)
    await this.setState({...this.state, tokenBalance: bal})
  }

  tokenAllowance = async (provider:any) => {
    const address = await provider.getSigner().getAddress()
    await this.setState({...this.state, tokenAllowance: await api.allowance(address, this.props.info.stakerAddress, this.state.tokenAddress, this.props.provider)})
  }

  tenderTokenAllowance = async (provider:any) => {
    const address = await provider.getSigner().getAddress()
    await this.setState({...this.state, tenderAllowance: await api.allowance(address, this.props.info.stakerAddress, this.state.tenderTokenAddress, this.props.provider)})
  }

  handleDeposit = async (event:any) => {
    event.preventDefault()
    if (parseInt(this.state.tokenAllowance, 10) < parseInt(this.state.depositAmount, 10)) {
      try {
        await api.approve(this.state.depositAmount, this.props.info.stakerAddress, this.state.tokenAddress, this.props.provider.getSigner())
        await this.setState({...this.state, tokenAllowance: (parseInt(this.state.tokenAllowance, 10) + parseInt(this.state.depositAmount, 10).toString())})
      } catch (e) {
        console.log(e)
        return
      }
      return
    }
    await api.deposit(event.currentTarget.formDeposit.value, this.props.info.stakerAddress, this.props.provider.getSigner())
    await this.tokenBalance(this.props.provider)
    await this.tenderBalance(this.props.provider)

  }

  handleWithdraw = async (event:any) => {
    event.preventDefault()
    if (parseInt(this.state.tenderAllowance, 10) < parseInt(this.state.withdrawAmount, 10)) {
      try {
        await api.approve(this.state.withdrawAmount, this.props.info.stakerAddress, this.state.tenderTokenAddress, this.props.provider.getSigner())
        this.setState({...this.state, tenderAllowance: (parseInt(this.state.tenderAllowance, 10) + parseInt(this.state.withdrawAmount, 10).toString())})
      } catch (e) {
        console.log(e)
        return
      }
      return
    }
    await api.withdraw(event.currentTarget.formWithdraw.value, this.props.info.stakerAddress, this.props.provider.getSigner())
    await this.tenderBalance(this.props.provider)
    await this.tokenBalance(this.props.provider)
  }

  render() {
    const { info } = this.props

    const depositText = () => {
      if (parseInt(this.state.tokenAllowance, 10) >= parseInt(this.state.depositAmount, 10)) {
        return `Deposit ${this.props.info.symbol}`
      } else {
        return `Approve ${this.props.info.symbol}`
      }
    }

    const withdrawText = () => {
      if (parseInt(this.state.tenderAllowance, 10) >= parseInt(this.state.withdrawAmount, 10)) {
        return `Withdraw t${this.props.info.symbol}`
      } else {
        return `Approve t${this.props.info.symbol}`
      }
    }

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
                    <Form.Control  value={this.state.depositAmount} onChange={this.handleDepositInputChange} type="text" placeholder="0" />
                    <Form.Text className="text-muted">
                      Current Balance: {this.state.tokenBalance} {this.props.info.symbol}
                    </Form.Text>
                  </Form.Group>
    <Button disabled={this.state.depositAmount == "0"} type="submit">{depositText()}</Button>
                  </Form>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <Form onSubmit={this.handleWithdraw}>
                  <Form.Group controlId="formWithdraw">
                    <Form.Label>Withdraw Amount</Form.Label>
                    <Form.Control value={this.state.withdrawAmount} onChange={this.handleWithdrawInputChange} type="text" placeholder="0" />
                    <Form.Text className="text-muted">
                      Current Balance: {this.state.tenderBalance} t{this.props.info.symbol}
                    </Form.Text>
                  </Form.Group>
                  <Button disabled={this.state.withdrawAmount == "0"} type="submit">{withdrawText()}</Button>
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