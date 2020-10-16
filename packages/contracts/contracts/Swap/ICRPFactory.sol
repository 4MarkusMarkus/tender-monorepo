pragma solidity ^0.6.2; 
pragma experimental ABIEncoderV2;

struct PoolParams {
        // Balancer Pool Token (representing shares of the pool)
        string poolTokenSymbol;
        string poolTokenName;
        // Tokens inside the Pool
        address[] constituentTokens;
        uint[] tokenBalances;
        uint[] tokenWeights;
        uint swapFee;
}

struct Rights {
        bool canPauseSwapping;
        bool canChangeSwapFee;
        bool canChangeWeights;
        bool canAddRemoveTokens;
        bool canWhitelistLPs;
        bool canChangeCap;
}


interface CRPFactory {
    event LogNewCrp(
        address indexed caller,
        address indexed pool
    );

    function isCrp(address addr) external view returns (bool);
    function newCrp(address factoryAddress, PoolParams calldata poolParams, Rights calldata rights) external returns (address);
}