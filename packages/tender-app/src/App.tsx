import React from "react";
import "./App.css";
import { Home, Nav, TokenPage, Background } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap"
import stakers from "./data/stakers"

function App() {

  const renderTokenPage = (routerProps:any) => {
    let infoProp = stakers[routerProps.match.url]
    return (<TokenPage info={infoProp} />)
  }
  /*
    Set route changes
  */
  //const [route, setRoute] = useState();
  //useEffect(() => {
  //  console.log("SETTING ROUTE",window.location.pathname)
  //  //setRoute(window.location.pathname)
  //}, [ window.location.pathname ]);

  /*
    Return the app!
  */
  return (
    <>
    <Background />
    <Router>
      <Container>
        <Nav />
      </Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/stakers/:id" render = { (routerProps:any) => renderTokenPage(routerProps)} />
        </Switch>
    </Router>
    </>
  );
}

export default App;
