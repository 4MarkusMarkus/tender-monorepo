import ethers from "ethers"

import contracts from "./contracts"

export async function deposit(amount: string, stakerAddr: string, signer: ethers.providers.JsonRpcSigner) {
   const staker = new ethers.Contract(stakerAddr, contracts.Staker, signer)
   const tokenAddr = await staker.token()
   const token = new ethers.Contract(tokenAddr, contracts.ERC20, signer)

   const amountBN = ethers.utils.parseUnits(amount, "ether")
   // approve token
   await token.approve(stakerAddr, amountBN)

   // deposit
   await staker.deposit(amountBN)
}

export async function withdraw(amount: string, stakerAddr: string, signer: ethers.providers.JsonRpcSigner) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, signer)

    const tenderAddr = await staker.tenderToken()
    const tender = new ethers.Contract(tenderAddr, contracts.ERC20, signer)

    const amountBN = ethers.utils.parseUnits(amount, "ether")

    // approve tender token
    await tender.approve(stakerAddr, amountBN)

    // withdraw
    await staker.withdraw(amountBN)
 }
 
export async function sharePrice(stakerAddr: string, provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, provider)

    return ethers.utils.formatUnits(await staker.sharePrice(), "ether")
}

export async function tenderBalance(account:string, stakerAddr:string, provider:ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, provider)

    const tenderAddr = await staker.tenderToken()
    const tender = new ethers.Contract(tenderAddr, contracts.ERC20, provider)

    return ethers.utils.formatUnits(await tender.balanceOf(account), "ether")
}

export async function tokenBalance(account: string, stakerAddr:string, provider:ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, provider)
    const tokenAddr = await staker.token()
    const token = new ethers.Contract(tokenAddr, contracts.ERC20, provider)

    return ethers.utils.formatUnits(await token.balanceOf(ethers.utils.getAddress(account)), "ether")
}