import React from 'react'
import * as api from "../../api/staker"
import {TrendingUp, TrendingDown} from '@rimble/icons';


export default class SharePrice extends React.Component<any, any> {
    constructor(props:any) {
        super(props)
        this.state = {
            startSharePrice: 1.00,
            currentSharePrice: 1.00,
        }   
    }

 
    async componentDidMount() {
        if (this.props.available) {
            await this.setState({...this.state, currentSharePrice: parseFloat(await api.sharePrice(this.props.stakerAddress, this.props.provider))})
        }
    }

    render() {

        const sharePrice = () => {
            if (this.props.available) {
                return this.state.currentSharePrice.toFixed(2).toString()
            } else {
               return  "-.--"
            }
        }
        const sharePriceChange = () => {
            const change = (this.state.currentSharePrice / this.state.startSharePrice - 1).toFixed(2)
            if (this.state.currentSharePrice > this.state.startSharePrice) {
              return (
                  <div style={{marginTop: 10, marginBottom: 10}}>
              <h3>{sharePrice()}</h3>
              <h5><span style={{fontSize: 15}}><sup>{this.props.symbol}</sup> &#8260; <sub>{`t${this.props.symbol}`}</sub></span></h5>
              <h5><span> <TrendingUp color="success" />{change} %</span></h5>
                </div>
                )
            } else if (this.state.currentSharePrice < this.state.startSharePrice) {
                return (
                    <div style={{marginTop: 10, marginBottom: 10}}>
                <h3>{sharePrice()}</h3>
                <h5><span style={{fontSize: 15}}><sup>{this.props.symbol}</sup> &#8260; <sub>{`t${this.props.symbol}`}</sub></span></h5>
                <h5><span> <TrendingDown color="alert" />{change} %</span></h5>
                  </div>
                  )
            } else {
                return (
                    <div style={{marginTop: 10, marginBottom: 10}}>
                <h3>{sharePrice()}</h3>
                <h5><span style={{fontSize: 15}}><sup>{this.props.symbol}</sup> &#8260; <sub>{`t${this.props.symbol}`}</sub></span></h5>
                <h5><span><TrendingUp color="white" /> --.- %</span></h5>
                  </div>
                  )
            }
          }

          return (<div style={{textAlign: "center"}}>{sharePriceChange()}</div>)
    }
}