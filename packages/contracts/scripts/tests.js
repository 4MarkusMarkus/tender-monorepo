// Before you can run this you must deploy the Livepeer protocol and Balancer factories

const LivepeerStaker = artifacts.require("LivepeerStaker")
const ERC20 = artifacts.require("ERC20")
const BPool = artifacts.require("BPool")



module.exports = function(callback) {
    (async function() {
        try {
            const accounts = await web3.eth.getAccounts()
            const livepeerStaker = await LivepeerStaker.deployed()
            
            
            
            console.log("Initial Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            const lptAddress = await livepeerStaker.token()
            const tenderLptAddress = await livepeerStaker.tenderToken()
            const bpoolAdress = (await livepeerStaker.balancer()).pool
            const lpt = await ERC20.at(lptAddress)
            const tenderLpt = await ERC20.at(tenderLptAddress)
            const bpool = await BPool.at(bpoolAdress)

            console.log("===== Adresses =====")
            console.log("LPT token address: ", lpt.address)
            console.log("tenderLpt token address: ", tenderLpt.address)
            console.log("bpool token address: ", bpool.address)


            const deposit = web3.utils.toWei("20")

            console.log("===== Deposit before =====")

            console.log("LPT Balance Before: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance Before: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))
            console.log("Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            await lpt.approve(livepeerStaker.address, deposit)
            await livepeerStaker.deposit(deposit)

            console.log("===== Deposit after =====")
            console.log("Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            console.log("LPT Balance After Deposit: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance After Deposit: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            console.log("==== Withdraw ====")
            await tenderLpt.approve(livepeerStaker.address, deposit)
            console.log("==== approved ====")
            await livepeerStaker.withdraw(deposit)
            console.log("LPT Balance After Withdraw: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance After Withdraw: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            console.log("After Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            // console.log("==== trading against balancer from a diff account balancer ====")
            // console.log("check LPT balance of account 1: ",web3.utils.fromWei(await tenderLpt.balanceOf(accounts[1])) )
            // console.log((await bpool.getCurrentTokens())
            // console.log((await bpool.getSpotPriceSansFee(tenderLpt.address, bpool.address)).toString())


            callback(null)
        } catch (err) {
            callback(err)
        }
    }())
}