// Before you can run this you must deploy the Livepeer protocol and Balancer factories

const LivepeerStaker = artifacts.require("LivepeerStaker")
const ERC20 = artifacts.require("ERC20")
const tenderToken = artifacts.require("TenderToken")

const BN = require('bn.js')

module.exports = function(callback) {
    (async function() {
        try {
            const accounts = await web3.eth.getAccounts()
            const livepeerStaker = await LivepeerStaker.deployed()
            const lptAddress = await livepeerStaker.token()
            const tenderLptAddress = await livepeerStaker.tenderToken()

            const TOKEN_UNIT = (new BN(10)).pow(new BN(18))
            const INITIAL_SUPPLY = (new BN(500000)).mul(TOKEN_UNIT)
            const INITIAL_LIQUIDITY = (new BN(1000)).mul(TOKEN_UNIT)
            const INITIAL_WEIGHT = (new BN(1)).mul(TOKEN_UNIT)

            const lpt = await ERC20.at(lptAddress)
            const tenderLpt = await ERC20.at(tenderLptAddress)

                // Mint the tender tokens for next acount + trades them against pool
            tenderToken.mint(accounts[1], INITIAL_LIQUIDITY.toString())

            const transferTender = await tenderLpt.transfer(accounts[1], new BN(10).mul(TOKEN_UNIT)) 

            const bpool = (await livepeerStaker.balancer()).pool
            //console.log(bpool)
            await tenderLpt.approve(bpool, INITIAL_LIQUIDITY.toString(), {from: accounts[1]})
            await tenderLpt.swapExactAmountIn(tenderLpt, new BN(10).mul(TOKEN_UNIT), lpt, TOKEN_UNIT, new BN(1).mul(TOKEN_UNIT), {from: accounts[1]})

            console.log("Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            const tenderSupply = await tenderLpt.totalSupply()
            const bpoolTender = await tenderLpt.balanceOf(bpool)
            console.log("Tender Supply:", web3.utils.fromWei(tenderSupply.sub(bpoolTender)))

            console.log(web3.utils.fromWei(await lpt.balanceOf(bpool)))

            const pendingStake = await livepeerStaker.pendingStake()
    

            callback(null)
        } catch (err) {
            callback(err) 
        }
    }())
}