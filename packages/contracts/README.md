# Typescript Solidity Dev Starter Kit

This is a starter kit for developing, testing, and deploying smart contracts with a full Typescript environment. This stack uses [Buidler](https://buidler.dev) as the platform layer to orchestrate all the tasks. [Ethers](https://docs.ethers.io/ethers.js/html/index.html) is used for all Ethereum interactions and testing.

[Blog Post](https://medium.com/@rahulsethuram/the-new-solidity-dev-stack-buidler-ethers-waffle-typescript-tutorial-f07917de48ae)

## Using this Project

Clone this repository, then install the dependencies with `npm install`. Build everything with `yarn build`. https://buidler.dev has excellent docs, and can be used as reference for extending this project.

## Available Functionality

### Build Contracts

`yarn compile`

### Generate TypeChain Typings

`yarn build`

### Run Contract Tests & Get Callstacks

In one terminal run `yarn buidler node`

Then in another run `yarn test`

Notes:

 - As is, the tests fail on purpose. This is to show the Solidity stack traces that Buidler enables!
 - The gas usage table may be incomplete (the gas report currently needs to run with the `--network localhost` flag; see below).

### Run Contract Tests and Generate Gas Usage Report

In one terminal run `yarn buidler node`

Then in another run `yarn test -- --network localhost`

Notes:

 - When running with this `localhost` option, you get a gas report but may not get good callstacks
 - See [here](https://github.com/cgewecke/eth-gas-reporter#installation-and-config) for how to configure the gas usage report.

### Run Coverage Report for Tests

`yarn coverage`

Notes:

 - running a coverage report currently deletes artifacts, so after each coverage run you will then need to run `npx buidler clean` followed by `yarn build` before re-running tests
 - the branch coverage is 75%

### Deploy to Ethereum

Create/modify network config in `buidler.config.ts` and add API key and private key, then run:

`yarn buidler run --network rinkeby scripts/deploy.ts`

### Verify on Etherscan

Add Etherscan API key to `buidler.config.ts`, then run:

`yarn buidler verify-contract --contract-name Counter --address <DEPLOYED ADDRESS>`

## Enhancement Wish List

- Better migrations strategy (Buidler working on this)

PRs and feedback welcome!
