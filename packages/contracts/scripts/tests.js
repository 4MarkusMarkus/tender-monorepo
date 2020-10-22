// Before you can run this you must deploy the Livepeer protocol and Balancer factories // tests.js

const LivepeerStaker = artifacts.require("LivepeerStaker")
const ERC20 = artifacts.require("ERC20")
const BPool = artifacts.require("BPool")

const BN = require('bn.js')

module.exports = function(callback) {
    (async function() {
        try {
            const accounts = await web3.eth.getAccounts()
            const livepeerStaker = await LivepeerStaker.deployed()
            const TOKEN_UNIT = (new BN(10)).pow(new BN(18))
            const INITIAL_SUPPLY = (new BN(500000)).mul(TOKEN_UNIT)
            const INITIAL_LIQUIDITY = (new BN(1000)).mul(TOKEN_UNIT)
            const INITIAL_WEIGHT = (new BN(1)).mul(TOKEN_UNIT)
            const MAX = web3.utils.toTwosComplement(-1);

            console.log("Initial Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            const lptAddress = await livepeerStaker.token()
            const tenderLptAddress = await livepeerStaker.tenderToken()
            const balancerAddress = await (await livepeerStaker.balancer()).pool
            

            

            const lpt = await ERC20.at(lptAddress)
            const tenderLpt = await ERC20.at(tenderLptAddress)
            const bpool = await BPool.at(balancerAddress)

            const deposit = web3.utils.toWei("200")


            await lpt.approve(bpool.address, INITIAL_LIQUIDITY.toString())
            await tenderLpt.approve(bpool.address, INITIAL_LIQUIDITY.toString())

            console.log("balancer address: ", bpool.address)


            // console.log("===== Swap tLPT deposit to balancer =====")
            // const swapTenderIn = (await bpool.swapExactAmountIn(tenderLptAddress, deposit.toString(), tenderLptAddress, "1", deposit.toString()))
            // // console.log("swaptenderin  ", swapTenderIn.toString())
            // console.log("LPT Balance After Deposit: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            // console.log("tLPT Balance After Deposit: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))
            // console.log("After Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())




            console.log("===== Deposit =====")
            console.log("LPT Balance Before: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance Before: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            await lpt.approve(livepeerStaker.address, deposit)
            await livepeerStaker.deposit(deposit)

            console.log("LPT Balance After Deposit: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance After Deposit: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            // console.log("==== Withdraw ====")
            // await tenderLpt.approve(livepeerStaker.address, deposit)
            // await livepeerStaker.withdraw(deposit)
            // console.log("LPT Balance After Withdraw: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            // console.log("tLPT Balance After Withdraw: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            console.log("After Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            callback(null)
        } catch (err) {
            callback(err)
        }
    }())
}