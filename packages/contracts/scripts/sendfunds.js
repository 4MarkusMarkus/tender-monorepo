const ERC20 = artifacts.require("ERC20")
const config = require("../migrations/migrations.config")
module.exports = async function(callback) {
    try {

        const recipient =  "0xd2E982b4A72552Be984c8b4Caafce7F4475184E4"

        const lpt = await ERC20.at(config.LIVEPEER_TOKEN)
        const keep = await ERC20.at(config.KEEP_TOKEN)
        
        await lpt.transfer(recipient, web3.utils.toWei("50"))
        await keep.transfer(recipient, web3.utils.toWei("1000"))
        callback()
    } catch (err) {
        callback(err)
    }
 }