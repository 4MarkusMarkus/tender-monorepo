import React from "react";
import logo from "./logo.svg";
import ConnectWalletButton from "./components/ConnectWalletButton";
import "./App.css";
import { Box, Button, Heading, Text } from "rimble-ui";

function App() {
  return (
    <div className="app">
      <Box>
        <header className="app-header">
          <span className="logo">🥩🔨</span>
          <Heading className="title">Tenderize.me</Heading>
          <Text className="subtext">Don&apos;t just stake me.  Tenderize me first.</Text>
          <ConnectWalletButton />
        </header>
      </Box>
    </div>
  );
}

export default App;
