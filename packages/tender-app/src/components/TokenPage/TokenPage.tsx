import React, {Component} from 'react'
import { Card, Button, Heading, Text, Avatar, Input } from "rimble-ui"
import {Container, Row, Col, Tabs, Tab, Form} from "react-bootstrap"
import { Link } from 'react-router-dom';
import { TransactionModal } from '..';
import ethers from "ethers"
import classNames from "classnames";
import "./TokenPage.scss"
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
  withdrawAmount: string,
  transactionModalOpen: boolean,
  activeTab: string
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
      withdrawAmount: "0",
      transactionModalOpen: false,
      activeTab: "deposit"
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
    await api.deposit(this.state.depositAmount, this.props.info.stakerAddress, this.props.provider.getSigner())
    await this.tokenBalance(this.props.provider)
    await this.tenderBalance(this.props.provider)
    await this.tokenAllowance(this.props.provider)
    await this.setState({...this.state, depositAmount: "0"})

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
    await api.withdraw(this.state.withdrawAmount, this.props.info.stakerAddress, this.props.provider.getSigner())
    await this.tenderBalance(this.props.provider)
    await this.tokenBalance(this.props.provider)
    await this.tenderTokenAllowance(this.props.provider)
    await this.setState({...this.state, withdrawAmount: "0"})
  }

  openTransactionModal = () => {
    this.setState({...this.state, transactionModalOpen: true})
  }

  closeTransactionModal = () => {
    this.setState({...this.state, transactionModalOpen: false})
  }

  setTab = (newTab: string) => {
    this.setState({...this.state, activeTab: newTab})
  }

  tabButton(name: string) {
    let active = name === this.state.activeTab
    if (active) {
      return(
        <Button
          onClick={(e:any) => this.setTab(name)}
          className={classNames("tab", {active: active})}
          style={{width: "50%", textTransform: "capitalize", borderRadius: "0"}}>
            {name}
        </Button>
      )
    } else {
      return(
        <Button.Outline
          onClick={(e:any) => this.setTab(name)}
          className={classNames("tab", {active: active})}
          style={{width: "50%", textTransform: "capitalize", borderRadius: "0"}}>
            {name}
        </Button.Outline>
      )
    }

  }

  render() {
    const { info } = this.props
    const logo = require("../../img/" + info.logo)

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
    // <Form.Control  value={this.state.depositAmount} onChange={this.handleDepositInputChange} type="text" placeholder="0" />
    // <Form.Control value={this.state.withdrawAmount} onChange={this.handleWithdrawInputChange} type="text" placeholder="0" />


    return(
      <>
        <TransactionModal isOpen={this.state.transactionModalOpen} onClose={this.closeTransactionModal}/>
        <Container>
        <Link to="/">
          <Button.Text icon="KeyboardArrowLeft">Back</Button.Text>
        </Link>
              <Heading as={"h2"}>About {info.title}</Heading>
          <Row>
            <Col lg={{span: 6}}>
              <Card>
                <Text required="">{info.description}</Text>
              </Card>
            </Col>
            <Col>
              <Card>
                {this.tabButton("deposit")}
                {this.tabButton("withdraw")}
                <Avatar
                          size="large"
                          src={logo}
                          style={{margin: "1em auto 0"}}
                      />
                      <Heading style={{textAlign: "center"}}>{info.title}</Heading>
                      <Heading style={{textAlign: "center"}}>{info.apy}%</Heading>
                { this.state.activeTab === "deposit" &&
                  <Form onSubmit={this.handleDeposit}>
                  <Form.Group controlId="formDeposit">
                   
                    <Form.Label>Deposit Amount</Form.Label>
                    <Input width={1} value={this.state.depositAmount} onChange={this.handleDepositInputChange} type="text" placeholder="0" />
                    <Form.Text className="text-muted">
                      Current Balance: {this.state.tokenBalance} {this.props.info.symbol}
                    </Form.Text>
                  </Form.Group>
                  <Button disabled={this.state.depositAmount == "0"} style={{width: "100%"}} type="submit">{depositText()}</Button>
                  </Form>
                }
                { this.state.activeTab === "withdraw" &&
                  <Form onSubmit={this.handleWithdraw}>
                  <Form.Group controlId="formWithdraw">
                    <Form.Label>Withdraw Amount</Form.Label>
                    <Input width={1} value={this.state.withdrawAmount} onChange={this.handleWithdrawInputChange} type="text" placeholder="0"  />
                    <Form.Text className="text-muted">
                      Current Balance: {this.state.tenderBalance} t{this.props.info.symbol}
                    </Form.Text>
                  </Form.Group>
                  <Button disabled={this.state.withdrawAmount == "0"} style={{width: "100%"}} type="submit">{withdrawText()}</Button>
                  </Form>
                }
              </Card>
            </Col>
          </Row>
        </Container>
        </>
    );
  }
}