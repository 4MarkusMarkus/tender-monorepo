type Stakers = {
    [key: string]: {
        description: string,
        stakerAddress: string,
        title: string,
        available: boolean,
    }
}

const stakers: Stakers =  {
    "/stakers/livepeer": {
        title: "Livepeer",
        description: "The Livepeer project aims to deliver a live video streaming network protocol that is fully decentralized, highly scalable, crypto token incentivized, and results in a solution which can serve as the live media layer in the decentralized development (web3) stack. In addition, Livepeer is meant to provide an economically efficient alternative to centralized broadcasting solutions for any existing broadcaster. In this document we describe the Livepeer Protocol - a delegated stake based protocol for incentivizing participants in a live video broadcast network in a game-theoretically secure way. We present solutions for the scalable verification of decentralized work, as well as the prevention of useless work in an attempt to game the token allocations in an inflationary system.",
        stakerAddress: "",
        available: true,
    },
    "/stakers/keep": {
        title: "Keep",
        description: "Keeps provide a bridge between the world of public blockchains and private data. It enables a new wave of ground-up innovation for blockchain developers",
        stakerAddress: "",
        available: false,
    },
    "/stakers/aave": {
        title: "Aave",
        description: "Aave is an open source and non-custodial protocol enabling the creation of money markets. Users can earn interest on deposits and borrow assets.",
        stakerAddress: "",
        available: false,
    }
}

export default stakers