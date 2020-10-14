import React, {Component} from 'react'
import { EthAddress } from "rimble-ui";

export default class Address extends Component {
    render(){
        return(
            <EthAddress address="0x00000000000" />
        )
    }
}
