const KeepStaker = artifacts.require("Keepstaker")
const ERC20 = artifacts.require("ERC20")
const TokenStaking = artifacts.require("ITokenStaking")
const STakeDelegatable = artifacts.require("IStakeDelegatable")
const config = require("../migrations/migrations.config")
module.exports = async function(callback) {
    try {
        const accounts = await web3.eth.getAccounts()
    
        const keepStaker = await KeepStaker.deployed()
        const keepToken = await ERC20.at(config.KEEP_TOKEN)
        const tokenStaking = await TokenStaking.at(config.KEEP_TOKEN_STAKING)

        const tenderAddr = await keepStaker.tenderToken()
        const bpool = (await keepStaker.balancer()).pool
        const tendertoken = await ERC20.at(tenderAddr)

        console.log("Shareprice:", web3.utils.fromWei(await keepStaker.sharePrice()))

        await keepToken.approve(keepStaker.address, web3.utils.toWei("33300000"))
        await keepStaker.deposit(web3.utils.toWei("33300000"))

        const balanceOfStaker = await keepToken.balanceOf(keepStaker.address)
        const balanceOfOperator = await tokenStaking.balanceOf(accounts[0])
        const keepPooled = await keepToken.balanceOf(bpool)
        const keepForStaker = balanceOfStaker.add(balanceOfOperator).sub(web3.utils.toBN(web3.utils.toWei("100000"))).add(keepPooled).sub(config.INITIAL_LIQUIDITY)

        console.log("balanceOfStaker", web3.utils.fromWei(balanceOfStaker))
        console.log("balanceOfOperator", web3.utils.fromWei(balanceOfOperator))

        const tenderSupply = await tendertoken.totalSupply()
        const tenderPooled = await tendertoken.balanceOf(bpool)
        const tenderOut = await tenderSupply.sub(tenderPooled)
        console.log("Tender Outstanding:", web3.utils.fromWei(tenderOut))
        console.log("Keep outstanding:", web3.utils.fromWei(keepForStaker))

     
        // console.log("owner", await tokenStaking.ownerOf(accounts[0]))
        // console.log("beneficiary", await tokenStaking.beneficiaryOf(accounts[0]))
        // console.log("authorizerOf", await tokenStaking.authorizerOf(accounts[0]))
        callback()
    } catch (e) {
        callback(e)
    }
}