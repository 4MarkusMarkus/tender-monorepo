const Staker = artifacts.require("Staker")
const TenderToken = artifacts.require("TenderToken")
const Token = artifacts.require("VariableSupplyToken")

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
const BN = require('bn.js')

module.exports = function(callback) {
    (async function() {
        try {
            const accounts = await web3.eth.getAccounts()
            const TOKEN_UNIT = (new BN(10)).pow(new BN(18))
            const INITIAL_LIQUIDITY = (new BN(1000)).mul(TOKEN_UNIT)

            const token = await Token.new("TestToken", "TEST")
            const tenderToken = await TenderToken.new("TestToken", "TEST")
            const staker = await Staker.new()
            await tenderToken.transferOwnership(staker.address)
            await staker.init(token.address, tenderToken.address, {pool: NULL_ADDRESS, rights: NULL_ADDRESS, tokenInitialLiquidity: "1", tenderTokenInitialLiquidity: "1"}, NULL_ADDRESS, NULL_ADDRESS)
    
            console.log("TestToken:", token.address)
            console.log("TenderTestToken:", tenderToken.address)
            console.log("TestStaker:", staker.address)
            console.log("\n")
            await token.mint(accounts[0], web3.utils.toWei("1000000000"))

            // Example usage 
            const deposit = web3.utils.toWei("1000")
            console.log("Depositing...")
            await token.approve(staker.address, deposit)
            await staker.deposit(deposit)
            console.log("tTEST balance:", web3.utils.fromWei(await tenderToken.balanceOf(accounts[0])))

            console.log("Withdrawing....")
            await tenderToken.approve(staker.address, deposit)
            await staker.withdraw(deposit)
            console.log("tTEST balance:", web3.utils.fromWei(await tenderToken.balanceOf(accounts[0])))

            callback(null)
        } catch (err) {
            callback(err)
        }
    }())
}