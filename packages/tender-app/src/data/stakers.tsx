type Stakers = {
    [key: string]: {
        description: string,
        stakerAddress: string,
        title: string,
        available: boolean,
        apy: number,
        logo: string,
        symbol: string
    }
}

const stakers: Stakers =  {
    "/stakers/livepeer": {
        title: "Livepeer",
        description: "The Livepeer project aims to deliver a live video streaming network protocol that is fully decentralized, highly scalable, crypto token incentivized, and results in a solution which can serve as the live media layer in the decentralized development (web3) stack. In addition, Livepeer is meant to provide an economically efficient alternative to centralized broadcasting solutions for any existing broadcaster. In this document we describe the Livepeer Protocol - a delegated stake based protocol for incentivizing participants in a live video broadcast network in a game-theoretically secure way.",
        stakerAddress: "0x6f84742680311CEF5ba42bc10A71a4708b4561d1",
        available: true,
        apy: 23.3,
        logo: "livepeer.svg",
        symbol: "LPT"
    },
    "/stakers/keep": {
        title: "Keep",
        description: "Keeps provide a bridge between the world of public blockchains and private data. It enables a new wave of ground-up innovation for blockchain developers",
        stakerAddress: "",
        available: false,
        apy: 8.1,
        logo: "keep.svg",
        symbol: "KEEP"
    },
    "/stakers/graph": {
        title: "The Graph",
        description: "The Graph is an indexing protocol for querying networks like Ethereum and IPFS. Anyone can build and publish open APIs, called subgraphs, making data easily accessible.",
        stakerAddress: "",
        available: false,
        apy: 6.5,
        logo: "graph.svg",
        symbol: "GRT"
    }
}

export default stakers