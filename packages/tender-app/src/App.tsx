import React from "react";
import "./App.scss";
import { Home, Nav, TokenPage, Background } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { BaseStyles, theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";
import stakers from "./data/stakers";
import ethers from "ethers";
import Web3Modal from "web3modal";
declare module "styled-components";

const providerOptions = {
  /* See Provider Options Section */
};

type Provider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider;

interface State {
  provider: Provider;
  address: string;
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      provider: new ethers.providers.JsonRpcProvider(""),
      address: "",
    };
  }

  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public onConnect = async () => {
    let provider = await this.web3Modal.connect();

    this.setWeb3Provider(new ethers.providers.Web3Provider(provider));
    // this.setWeb3Provider(new ethers.providers.JsonRpcProvider("http://localhost:8545"))
    this.setState({
      ...this.state,
      address: await this.state.provider.getSigner().getAddress(),
    });
  };

  renderTokenPage = (routerProps: any) => {
    let infoProp = stakers[routerProps.match.url];
    return <TokenPage info={infoProp} provider={this.state.provider} />;
  };

  renderHomePage = () => {
    return <Home provider={this.state.provider}></Home>;
  };

  setWeb3Provider = (provider: Provider) => {
    this.setState({ provider });
  };

  // a theme with custom spacing and font sizes
  customTheme = {
    ...theme,
    colors: {
      ...theme.colors, // keeps existing colors
      //text: "", // sets color for text
      background: "#F0F1F5", // sets color for background
      primary: "#4E66DE", // sets primary color
      white: "#fff",
    },
  };

  render() {
    return (
      <>
        <ThemeProvider theme={this.customTheme}>
          <BaseStyles>
            <Background />
            <Router>
              <Container>
                <Nav
                  address={this.state.address}
                  cachedProvider={this.web3Modal.cachedProvider}
                  onConnect={this.onConnect}
                />
              </Container>
              <Switch>
                <Route exact path="/" render={() => this.renderHomePage()} />
                <Route
                  path="/stakers/:id"
                  render={(routerProps: any) =>
                    this.renderTokenPage(routerProps)
                  }
                />
              </Switch>
            </Router>
          </BaseStyles>
        </ThemeProvider>
      </>
    );
  }
}

export default App;
