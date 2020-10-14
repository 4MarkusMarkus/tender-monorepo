import React, { useState, useEffect } from "react";
import "./App.css";
import { ConnectButton, FeaturedCards, Home } from "./components";
import { Flex, Box, Button, Heading, Text } from "rimble-ui";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {Container, Row, Col} from "react-bootstrap"

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
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/livepeer">
            <Heading className="title"><span className="logo"></span>INSERT TOKEN PAGE<span className="logo"></span></Heading>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
