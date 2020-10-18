import ethers from "ethers"

import contracts from "./contracts"

export async function deposit(amount: string, stakerAddr: string, signer: ethers.providers.JsonRpcSigner) {
   const staker = new ethers.Contract(stakerAddr, contracts.Staker, signer)

   const amountBN = ethers.utils.parseUnits(amount, "ether")

   // deposit
   return await staker.deposit(amountBN)
}

export async function withdraw(amount: string, stakerAddr: string, signer: ethers.providers.JsonRpcSigner) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, signer)

    const amountBN = ethers.utils.parseUnits(amount, "ether")

    // withdraw
    return await staker.withdraw(amountBN)
 }
 
export async function sharePrice(stakerAddr: string, provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, provider)

    return ethers.utils.formatUnits(await staker.sharePrice(), "ether")
}

export async function token(stakerAddr:string, provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, provider)
    return await staker.token()
}

export async function tenderToken(stakerAddr:string, provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const staker = new ethers.Contract(stakerAddr, contracts.Staker, provider)
    return await staker.tenderToken()
}

export async function balance(account:string, tokenAddr: string, provider:ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const erc20 = new ethers.Contract(tokenAddr, contracts.ERC20, provider)

    return ethers.utils.formatUnits(await erc20.balanceOf(account), "ether")
}

export async function allowance(account:string, spender:string, tokenAddr:string, provider:ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider) {
    const erc20 = new ethers.Contract(tokenAddr, contracts.ERC20, provider)
    return ethers.utils.formatUnits(await erc20.allowance(account, spender), "ether")
}

export async function approve(amount: string, spender:string, tokenAddr:string, signer: ethers.providers.JsonRpcSigner) {
    const erc20 = new ethers.Contract(tokenAddr, contracts.ERC20, signer)
    const amountBN = ethers.utils.parseUnits(amount, "ether")
    return await erc20.approve(spender, amountBN)
}
