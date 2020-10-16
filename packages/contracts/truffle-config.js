require("babel-register")
require("babel-polyfill")

const KeystoreProvider = require("truffle-keystore-provider")
const Web3 = require("web3")

let mochaConfig = {}

// CLI options
for (let i = 0; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case "-g":
        case "--grep":
            if (process.argv.length == i + 1 || process.argv[i+1].startsWith("-")) {
                console.error(`${process.argv[i]} option requires argument`)
                process.exit(1)
            }
            const re = new RegExp(process.argv[i + 1])
            mochaConfig.grep = new RegExp(process.argv[i + 1])
            console.log("RegExp: " + i + ": " + re)
            break
        case "-r":
        case "--report":
            mochaConfig.reporter = "eth-gas-reporter"
            mochaConfig.reporterOptions = {
                rst: true,
                currency: "USD"
            }
            break
    }
}

const memoizeProviderCreator = () => {
    let keystoreProviders = {}

    return (account, dataDir, providerUrl, readOnly) => {
        if (readOnly) {
            return new Web3.providers.HttpProvider(providerUrl)
        } else {
            if (providerUrl in keystoreProviders) {
                return keystoreProviders[providerUrl]
            } else {
                const provider = new KeystoreProvider(account, dataDir, providerUrl)
                keystoreProviders[providerUrl] = provider
                return provider
            }
        }
    }
}

const createProvider = memoizeProviderCreator()

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 10000000
    },
    rinkeby: {
      provider: () => {
          return createProvider(process.env.RINKEBY_ACCOUNT, process.env.DATA_DIR, "https://rinkeby.infura.io", process.env.READ_ONLY)
      },
      network_id: 4,
      gas: 10000000
    },
    mainnet: {
      provider: () => {
          return createProvider(process.env.MAINNET_ACCOUNT, process.env.DATA_DIR, "https://mainnet.infura.io", process.env.READ_ONLY)
      },
      network_id: 1,
      gas: 10000000
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.2",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,
      // parser: "solcjs",
      settings: {
          optimizer: {
              enabled: true,
              runs: 200
          }
      }
    }
  }
}
