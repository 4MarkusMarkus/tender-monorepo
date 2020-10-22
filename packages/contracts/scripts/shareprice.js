// Before you can run this you must deploy the Livepeer protocol and Balancer factories // shareprice.js

const LivepeerStaker = artifacts.require("LivepeerStaker")
const ERC20 = artifacts.require("ERC20")
module.exports = function(callback) {
    (async function() {
        try {
            const livepeerStaker = await LivepeerStaker.deployed()
            const lptAddress = await livepeerStaker.token()
            const tenderLptAddress = await livepeerStaker.tenderToken()

            const lpt = await ERC20.at(lptAddress)
            const tenderLpt = await ERC20.at(tenderLptAddress)


            const bpoolAddress = (await livepeerStaker.balancer()).pool
            // const bpoolUnerlIniLiqidity = (await livepeerStaker.balancer()).tokenInitialLiquidity
            // const bpoolTENDERlIniLiqidity = (await livepeerStaker.balancer()).tenderTokenInitialLiquidity

            

            console.log("Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            const tenderTotalSupply = await tenderLpt.totalSupply()
            const tenderMintedforP = await (await livepeerStaker.balancer()).tenderMintedForPool
            const bpoolTender = await tenderLpt.balanceOf(bpoolAddress)

            const underInLivePeer = await lpt.balanceOf(livepeerStaker.address)
            const underInPool = await lpt.balanceOf(bpoolAddress)
            const underPendingStake = await livepeerStaker.pendingStake()


            console.log("----------------------------------")
            console.log("LPT pool balance: ", web3.utils.fromWei(await lpt.balanceOf(bpoolAddress)))
            console.log("tLPT pool balance: ", web3.utils.fromWei(await tenderLpt.balanceOf(bpoolAddress)))
            console.log("tLPT pool price: ", web3.utils.fromWei(await livepeerStaker.tenderPriceinPool()))

            console.log("----------------------------------")
            console.log("underInLivePeer:", web3.utils.fromWei(underInLivePeer))
            console.log("underPendingStake:", web3.utils.fromWei(underPendingStake))
            console.log("underInPool:", web3.utils.fromWei(underInPool))

            console.log("----------------------------------")
            console.log("underTogetherOutstanding:", web3.utils.fromWei(underInLivePeer.add(underPendingStake).add(underInPool)))
        

            console.log("----------------------------------")
            console.log("Tender outstanding Supply:", web3.utils.fromWei(tenderTotalSupply.add(tenderMintedforP).sub(bpoolTender)))
            console.log("tenderTotalSupply:", web3.utils.fromWei(tenderTotalSupply))
            console.log("tenderMintedforP:", web3.utils.fromWei(tenderMintedforP))
            console.log("bpoolTender:", web3.utils.fromWei(bpoolTender))
            
            console.log("----------------------------------")
            console.log("Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            
            // console.log("----------------------------------")

            // console.log("Underlying initial liquidity:", web3.utils.fromWei(bpoolUnerlIniLiqidity))
            // console.log("Tender initial liquidity:", web3.utils.fromWei(bpoolTENDERlIniLiqidity))
            // console.log("underInPool:", web3.utils.fromWei(underInPool))



            //const pendingStake = await livepeerStaker.pendingStake()
    

            callback(null)
        } catch (err) {
            callback(err)
        }
    }())
}