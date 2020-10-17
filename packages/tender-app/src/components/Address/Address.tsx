import React, {Component} from 'react'
import { EthAddress } from "rimble-ui";

export default class Address extends Component<any> {
    constructor(props:any) {
        super(props)
    }
    render(){
        return(
            <EthAddress style={{marginTop:4}} address={this.props.address} />
        )
    }
}
