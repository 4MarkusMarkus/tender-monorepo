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
  provider: any;
};

export default class SharePrice extends React.Component<SharePriceProps, any> {
  pricePlaceholder = "-.--";

  constructor(props: SharePriceProps) {
    super(props);
    this.state = {
      startSharePrice: 1.0,
      currentSharePrice: 1.0,
    };
  }

  async componentDidMount() {
    if (this.props.available) {
      this.setState({
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
        <Tooltip message={text} offset="-70, 0" className="tooltip">
          <InfoOutline className="info" />
        </Tooltip>
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
      }
    };

    const changeAmount = () => {
      let change =
        (this.state.currentSharePrice / this.state.startSharePrice - 1) * 100;

      return change === 0 ? this.pricePlaceholder : change.toFixed(2);
    };

    const showInfoIcon = () => {
      return this.props.available;
    };

    const sharePriceChange = () => {
      return (
        <div style={{ margin: "10 0" }}>
          <h3>
            <span className={classNames("price", { offset: showInfoIcon() })}>
              {sharePrice()}
            </span>

            {showInfoIcon() && infoIcon()}
          </h3>
          <h4>
            <span className="ratio">
              <sup>{this.props.symbol}</sup> &#8260;
              <sub>{`t${this.props.symbol}`}</sub>
            </span>
          </h4>
          <div style={{ margin: 5 }}>
            <span>{trendingIcon()}</span>
            <span className="percent">{changeAmount()}%</span>
          </div>
        </div>
      );
    };

    return <div>{sharePriceChange()}</div>;
  }
}
