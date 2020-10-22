const TenderToken = artifacts.require("TenderToken");
const KeepStaker = artifacts.require("KeepStaker")
const CRPFactory = artifacts.require("CRPFactory")
const BFactory = artifacts.require('BFactory');
const CRP = artifacts.require("ConfigurableRightsPool")
const BPool = artifacts.require("BPool")
const ERC20 = artifacts.require("ERC20")

const TokenStaking = artifacts.require("ITokenStaking")

const config = require("./migrations.config")

module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {
            // Deploy tender token 
    tenderToken = await TenderToken.new("Keep Token", "KEEP")

    // Mint the initial liquidity for a 50/50 pool to us
    tenderToken.mint(accounts[0], config.INITIAL_LIQUIDITY.toString())

    // Change TenderToken ownership to keepStaker after deploying it

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
        poolTokenSymbol: 'BPT-tKEEP',
        poolTokenName: 'BPT tender KEEP',
        constituentTokens: [config.KEEP_TOKEN, tenderToken.address], // contract addresses
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
    const keepToken = await ERC20.at(config.KEEP_TOKEN)
    await keepToken.approve(crp.address, config.INITIAL_LIQUIDITY.toString())
    await tenderToken.approve(crp.address, config.INITIAL_LIQUIDITY.toString())

    await crp.createPool(config.INITIAL_LIQUIDITY.toString())

    const bPool = await BPool.at(await crp.bPool())

    // Change crp and bPool ownership to keepStaker after deploying it

    // < / Deploy Balancer Pools... >

    // SKIP: Deploy WETH

    // SKIP:  Deploy OneSwap

    // < Deploy keep Staker ... > 
    const keepConfig = {
        operator: accounts[0],
        operatorContract: config.KEEP_OPERATOR_CONTRACT,
        tokenStaking: config.KEEP_TOKEN_STAKING,
        keepToken: config.KEEP_TOKEN,
        initialDelegation: web3.utils.toWei("100000"),
        initializationPeriod: 1,
    }

    const balancerConfig = {
        pool: bPool.address,
        rights: crp.address,
        tokenInitialLiquidity: config.INITIAL_LIQUIDITY.toString(),
        tenderTokenInitialLiquidity: config.INITIAL_LIQUIDITY.toString()
    }

    const keepStaker = await deployer.deploy(KeepStaker)
    const tokenStaking = await TokenStaking.at(config.KEEP_TOKEN_STAKING)
    // await tokenStaking.authorizeOperatorContract(accounts[0], config.KEEP_OPERATOR_CONTRACT)
    await keepStaker.init(keepToken.address, tenderToken.address, balancerConfig, config.NULL_ADDRESS, config.NULL_ADDRESS)
    await keepToken.approve(keepStaker.address, keepConfig.initialDelegation)
    await keepStaker.setKeepConfig(keepConfig)
    // < / Deploy keep Staker ... >

    // Transfer ownership of contracts to the staker 
    await tenderToken.transferOwnership(keepStaker.address)
    await crp.setController(keepStaker.address)
    
    
    })
};