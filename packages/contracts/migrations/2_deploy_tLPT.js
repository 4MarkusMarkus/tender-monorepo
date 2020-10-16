// Pre-Requisites:
// 1. Deploy Livepeeer Protocol
// 2. Get LPT into an account (accounts[0] will have this in local dev env)
// 3. Deploy Balancer Factories
// (4. Deploy WETH)
// (5. Deploy OneSwap)

// Deploy TenderToken
// Mint TenderToken equal to some LPT amount (need some on hand) 
// Approve TenderToken
// Transfer TenderToken ownership
// Approve LPT 
// Create new CRP 
// Initialise CRP
// Transfer ownership of CRP

// Deploy Livepeer Staker (we can skip proxy setup on testnet)

const TenderToken = artifacts.require("TenderToken");
const LivepeerStaker = artifacts.require("LivepeerStaker")
const CRPFactory = artifacts.require("CRPFactory")
const BFactory = artifacts.require('BFactory');
const CRP = artifacts.require("ConfigurableRightsPool")
const BPool = artifacts.require("BPool")
const ERC20 = artifacts.require("ERC20")

const config = require("./migrations.config")
module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {
            // Deploy tender token 
    tenderToken = await deployer.deploy(TenderToken, "Livepeer Token", "LPT")

    // Mint the initial liquidity for a 50/50 pool to us
    tenderToken.mint(accounts[0], config.INITIAL_LIQUIDITY.toString())

    // Change TenderToken ownership to LivepeerStaker after deploying it

    // <  Deploy Balancer pools... >

    // Factories
    const crpFactory = await CRPFactory.at(config.CRP_FACTORY)
    const bfactory = await BFactory.at(config.BPOOL_FACTORY)

    // Permissions
    const permissions = {
        canPauseSwapping: true,
        canChangeSwapFee: true,
        canChangeWeights: true,
        canAddRemoveTokens: true,
        canWhitelistLPs: false,
        canChangeCap: false,
    };

    // poolParams
    const poolParams = {
        poolTokenSymbol: 'BTP-tLPT',
        poolTokenName: 'BTP tender LPT',
        constituentTokens: [config.LIVEPEER_TOKEN, tenderToken.address], // contract addresses
        tokenBalances: [config.INITIAL_LIQUIDITY.toString(), config.INITIAL_LIQUIDITY.toString()],
        tokenWeights: [config.INITIAL_WEIGHT.toString(), config.INITIAL_WEIGHT.toString()],
        swapFee: config.SWAP_FEE
    };

    const tx = await crpFactory.newCrp(
        bfactory.address,
        poolParams,
        permissions
    );

    const crp = await CRP.at(tx.logs[0].args.pool)

    // approve the constituent tokens
    const livepeerToken = await ERC20.at(config.LIVEPEER_TOKEN)
    await livepeerToken.approve(crp.address, config.INITIAL_LIQUIDITY.toString())
    await tenderToken.approve(crp.address, config.INITIAL_LIQUIDITY.toString())

    await crp.createPool(config.INITIAL_LIQUIDITY.toString())

    const bPool = await BPool.at(await crp.bPool())

    // Change crp and bPool ownership to LivepeerStaker after deploying it

    // < / Deploy Balancer Pools... >

    // SKIP: Deploy WETH

    // SKIP:  Deploy OneSwap

    // < Deploy Livepeer Staker ... > 
    const livepeerConfig = {
        delegate: accounts[0],
        bondingManager: config.LIVEPEER_BONDINGMANAGER,
        roundsManager: config.LIVEPEER_ROUNDSMANAGER
    }

    const balancerConfig = {
        pool: bPool.address,
        rights: crp.address,
        tokenInitialLiquidity: config.INITIAL_LIQUIDITY.toString(),
        tenderTokenInitialLiquidity: config.INITIAL_LIQUIDITY.toString()
    }

    const livepeerStaker = await deployer.deploy(LivepeerStaker)

    await livepeerStaker.init(livepeerToken.address, tenderToken.address, balancerConfig, config.NULL_ADDRESS, config.NULL_ADDRESS)

    await livepeerStaker.setLivepeerConfig(livepeerConfig)
    // < / Deploy Livepeer Staker ... >

    // Transfer ownership of contracts to the staker 
    await tenderToken.transferOwnership(livepeerStaker.address)
    await crp.setController(livepeerStaker.address)

    // TODO: Transfer Balancer Pool Tokens to Livepeer Staker
    })
};
