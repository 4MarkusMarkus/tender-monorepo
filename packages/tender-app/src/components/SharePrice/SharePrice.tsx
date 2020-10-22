import React from "react";
import * as api from "../../api/staker";
import { Tooltip } from "rimble-ui";
import { TrendingUp, TrendingDown, InfoOutline } from "@rimble/icons";
import classNames from "classnames";
import "./SharePrice.scss";

type SharePriceProps = {
  available: boolean;
  symbol: string;
  stakerAddress: string;
  showInfo: boolean;
  provider: any;
};

export default class SharePrice extends React.Component<SharePriceProps, any> {
  pricePlaceholder = "----";

  constructor(props: SharePriceProps) {
    super(props);
    this.state = {
      startSharePrice: 1.0,
      currentSharePrice: 1.0,
    };
  }

  static defaultProps = {
    available: "",
    symbol: "",
    stakerAddress: "",
    showInfo: true,
    provider: {},
  };

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
    const infoIcon = () => {
      const text = `${sharePrice()} ${
        this.props.symbol
      } tokens currently staked through\n Tenderize for every
         t${this.props.symbol} in circulation`;

      return (
        <span>
          <Tooltip message={text} placement="right" className="tooltip">
            <InfoOutline className="info" />
          </Tooltip>
        </span>
      );
    };

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
        <div style={{ margin: "10 0" }}>
          <h3
            className={classNames("price", {
              "info-margin": this.props.showInfo,
            })}
            style={{ marginLeft: "36px" }}
          >
            {sharePrice()}
            {this.props.showInfo && infoIcon()}
          </h3>
          <h4>
            <span className="ratio">
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
