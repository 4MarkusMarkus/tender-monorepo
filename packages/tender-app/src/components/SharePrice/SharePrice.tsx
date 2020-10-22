import React from "react";
import * as api from "../../api/staker";
import { TrendingUp, TrendingDown } from "@rimble/icons";
import "./SharePrice.scss";

export default class SharePrice extends React.Component<any, any> {
  pricePlaceholder = "-.--";

  constructor(props: any) {
    super(props);
    this.state = {
      startSharePrice: 1.0,
      currentSharePrice: 1.5,
    };
  }

  async componentDidMount() {
    if (this.props.available) {
      await this.setState({
        ...this.state,
        currentSharePrice: parseFloat(
          await api.sharePrice(this.props.stakerAddress, this.props.provider)
        ),
      });
    }
  }

  render() {
    const sharePrice = () => {
      if (this.props.available) {
        return this.state.currentSharePrice.toFixed(2).toString();
      } else {
        return this.pricePlaceholder;
      }
    };

    const trendingIcon = () => {
      if (this.state.currentSharePrice > this.state.startSharePrice) {
        return <TrendingUp color="success" className="trending" />;
      } else if (this.state.currentSharePrice < this.state.startSharePrice) {
        return <TrendingDown color="alert" className="trending" />;
      } else {
        return <TrendingUp color="white" className="trending" />;
      }
    };

    const changeAmount = () => {
      let change =
        (this.state.currentSharePrice / this.state.startSharePrice - 1) * 100;

      return change === 0 ? this.pricePlaceholder : change.toFixed(2);
    };
    const sharePriceChange = () => {
      return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <h3 className="price">{sharePrice()}</h3>
          <h4>
            <span style={{ fontSize: 15 }}>
              <sup>{this.props.symbol}</sup> &#8260;
              <sub>{`t${this.props.symbol}`}</sub>
            </span>
          </h4>
          <span>
            <span>{trendingIcon()}</span>
            <span className="percent">{changeAmount()}%</span>
          </span>
        </div>
      );
    };

    return <div style={{ textAlign: "center" }}>{sharePriceChange()}</div>;
  }
}
