import React, { useState, useEffect } from "react";
import "./App.css";
import { Home, Nav, TokenPage } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap"

function App() {
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
    <Router>
      <Container>
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/livepeer">
            <TokenPage title="Livepeer"/>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
