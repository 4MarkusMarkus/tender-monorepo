const LivepeerStaker = artifacts.require("LivepeerStaker")
const KeepStaker = artifacts.require("KeepStaker")

module.exports = async function(callback) {
    try {
        console.log("LivepeerStaker:", await LivepeerStaker.deployed())
        console.log("KeepStaker:", await KeepStaker.deployed())
        callback()
    } catch (err) {
        callback(err)
    }
}