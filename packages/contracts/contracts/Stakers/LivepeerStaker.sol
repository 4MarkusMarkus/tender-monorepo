pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "../Staker.sol";

// interfaces
import "./interfaces/livepeer/IBondingManager.sol";
import "./interfaces/livepeer/IRoundsManager.sol";

contract LivepeerStaker is Staker {

    uint256 internal constant liquidityPercentage = 1e17;

    // LivepeerStaker only supports on single delegate right now
    // Each delegate would require a separate contract bound to this one to stake and unstake
    struct LivepeerConfig {
        IBondingManager bondingManager;
        IRoundsManager roundsManager;
        address delegate; // in the future this will be multiple delegates but then we also have to get the pending stake for each separate contract that delegates instead of this contract
    }

    LivepeerConfig private livepeer;

    function setLivepeerConfig(LivepeerConfig memory _config) public {
        livepeer = _config;
    }

    function sharePrice() public override(Staker) view returns (uint256) {
        // Get the totalSupply for tenderToken, minus the pooled amount
        // Pooled amount does not count for shares
        uint256 tenderSupply = tenderToken.totalSupply().sub(tenderToken.balanceOf(address(balancer.pool)));

        // Get the outstanding balance of LPT for Staker
        uint256 outstanding = token.balanceOf(address(this));
        
        uint256 lptPooled = token.balanceOf(address(balancer.pool));

        // Get the amount bonded in Livepeer including compounding rewards
        uint256 pendingStake = livepeer.bondingManager.pendingStake(address(this), livepeer.roundsManager.currentRound());
    
        uint256 lptFromStaker = outstanding.add(pendingStake).add(lptPooled).sub(balancer.tokenInitialLiquidity);
        if (tenderSupply ==  0 ) { return 1e18; }
        return lptFromStaker.mul(1e18).div(tenderSupply);
    }

    function pendingStake() external view returns (uint256) {
        return livepeer.bondingManager.pendingStake(address(this), livepeer.roundsManager.currentRound());
    }

    function deposit(uint256 _amount) external override(Staker) {
        // Calculate share price
        uint256 sharePrice = sharePrice();

        uint256 shares = _amount.mul(1e18).div(sharePrice);

        // Mint tenderToken
        tenderToken.mint(msg.sender, shares);

        // Split _amount into staking amount and liquidity amount
        uint256 liquidityAmount = _amount.mul(liquidityPercentage).div(1e18);

        // Transfer LPT to Staker
        require(token.transferFrom(msg.sender, address(this), _amount), "ERR_TOKEN_TANSFERFROM");

        // Add Liquidity
        addLiquidity(liquidityAmount);

        // Bond LPT
        token.approve(address(livepeer.bondingManager), _amount);
        livepeer.bondingManager.bond(_amount.sub(liquidityAmount), livepeer.delegate);

        emit Deposit(msg.sender, _amount, shares, sharePrice);
    }

    function withdraw(uint256 _amount) external override(Staker) {
        uint256 owed = _amount.mul(sharePrice()).div(1e18);

        // transferFrom tenderToken
        require(tenderToken.transferFrom(msg.sender, address(this), _amount), "ERR_TENDER_TRANSFERFROM");
        
        // swap with balancer
        uint256 out;
        uint256 minOut = owed.mul(90).div(100); // TODO USE MATHUTILS
        uint256 maxSpotPrice = balancer.pool.getSpotPrice(address(tenderToken), address(token)).mul(110).div(100); // TODO: USE MATHUTILS
        // Approve token 
        tenderToken.approve(address(balancer.pool), _amount);
        (out,) = balancer.pool.swapExactAmountIn(address(tenderToken), _amount, address(token), minOut, maxSpotPrice);

        // send underlying
        require(token.transfer(msg.sender, out));

        emit Withdraw(msg.sender, _amount, out);
    }

    function collect() public override(Staker) {
        // TODO: check pending fees
        uint256 balanceBefore = address(this).balance;
        livepeer.bondingManager.withdrawFees();
        uint256 balanceAfter = address(this).balance;

        // TODO: Require minimum
        uint256 swapAmount = balanceAfter.sub(balanceBefore);
        if (swapAmount < 1) {
            // don't revert here because otherwise deposits/withdrawals would revert as well 
            return;
        }

        // Wrap in WETH
        weth.deposit{value: swapAmount}();

        // Swap to LPT
        // TODO: turn into internal helper
        (uint256 returnAmount, uint256[] memory distribution) = oneInch.getExpectedReturn(IERC20(address(weth)), token, swapAmount, 2, 0);
        weth.approve(address(oneInch), swapAmount);
        returnAmount = oneInch.swap(IERC20(address(weth)), token, swapAmount, returnAmount, distribution, 0);

        // TODO: roll over if minimum isn't reached
        if (returnAmount < 1) { 
            return;
        }

        // TODO: Check arbitrage 

        // Send a percentage to liquidity pool
        uint256 liquidityAmount = returnAmount.mul(liquidityPercentage).div(1e18);

        livepeer.bondingManager.bond(returnAmount.sub(liquidityAmount), address(this));
    }

}