const Staker = require("./build/contracts/IStaker.json")
const ERC20 = require("./build/contracts/IERC20.json")

module.exports = {
    staker: Staker.abi,
    erc20: ERC20.abi
}