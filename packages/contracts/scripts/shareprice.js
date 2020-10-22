// Before you can run this you must deploy the Livepeer protocol and Balancer factories

const LivepeerStaker = artifacts.require("LivepeerStaker")
const ERC20 = artifacts.require("ERC20")
const BPOOL = artifacts.require("IBPool")

module.exports = function(callback) {
    (async function() {
        try {
            const livepeerStaker = await LivepeerStaker.deployed()
            const lptAddress = await livepeerStaker.token()
            const tenderLptAddress = await livepeerStaker.tenderToken()

            const lpt = await ERC20.at(lptAddress)
            const tenderLpt = await ERC20.at(tenderLptAddress)

            const bpool = (await livepeerStaker.balancer()).pool

            console.log("Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())
            const pool = await BPOOL.at(bpool)
            const spotPrice = await pool.getSpotPrice(lptAddress, tenderLptAddress)
            console.log("Spot Price:", web3.utils.fromWei(spotPrice))

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