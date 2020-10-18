pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "../Staker.sol";

// interfaces
import "./interfaces/livepeer/IBondingManager.sol";
import "./interfaces/livepeer/IRoundsManager.sol";

contract LivepeerStaker is Staker {

    
    uint256 public liquidityPercentage = 1e17; // we should be able to change this, should be public too, 
    uint256 public mintedForPool;
    uint256 public sentToPool;


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
        uint256 tenderSupply = tenderToken.totalSupply().sub(tenderToken.balanceOf(address(balancer.pool))); // liquidityForPool = this is liquidity of tenderToken we mint when we icrease pool liquidity

        // Get the outstanding balance of LPT for Staker
        uint256 underlyingBalance = token.balanceOf(address(this));
        
        uint256 underlyingPooled = token.balanceOf(address(balancer.pool));

        // Get the amount bonded in Livepeer including compounding rewards
        uint256 underlyingStaked = livepeer.bondingManager.pendingStake(address(this), livepeer.roundsManager.currentRound());
    
        uint256 underlyingAll = underlyingBalance.add(underlyingStaked).add(underlyingPooled);
        if (tenderSupply ==  0 ) { return 1e18; }
        return underlyingAll.mul(1e18).div(tenderSupply);
    }

    function pendingStake() external view returns (uint256) {
        return livepeer.bondingManager.pendingStake(address(this), livepeer.roundsManager.currentRound());
    }

    ////////////helper functions for withdrawals + deposits /////////////

            // checks price of tender token in pool
    function tenderPriceinPool() internal view returns (uint256) {
                // Check arbitrage
        uint256 _tenderPoolPrice = balancer.pool.getSpotPrice(address(tenderToken), address(token)); // tLPT/LPT
        return _tenderPoolPrice;
        

    }

    function targetTokenAmountToPool() internal view returns (uint256 tokenInAmount) {

                // Check arbitrage
        uint256 ONE = 10**18;
        uint256 targetPrice = sharePrice();
        uint256 spotPrice = tenderPriceinPool(); // tLPT/LPT
        address tokenIn = address(token);
        address tokenOut = address(tenderToken);
        uint256 tokenInBalance = balancer.pool.getBalance(tokenIn);
        uint256 tokenInDenorm = balancer.pool.getDenormalizedWeight(tokenIn);
        uint256 tokenOutDenorm = balancer.pool.getDenormalizedWeight(tokenOut);
        // return calcInGivenSpot(targetSpotPrice, inRecord.denorm, inRecord.balance, outRecord.denorm, spotPrice);
        uint priceRatio = targetPrice.div(spotPrice);
        uint wOutRatio = tokenOutDenorm.div(tokenOutDenorm.add(tokenInDenorm));
        uint priceToWeight = priceRatio**wOutRatio; // TODO: SafeMathify this (i.e. check overflow)
        uint normPriceToWeight = priceToWeight.sub(ONE);
        return tokenInBalance.mul(normPriceToWeight);


    }

    function targetTokenAmountToPoolPlusFee() internal view returns (uint256 targetAmountwFee) {
        uint256 ONE = 10**18;
        uint256 targetAmountIn = targetTokenAmountToPool();
        uint256 swapFee = balancer.pool.getSwapFee();
        uint256 onePlusFee = swapFee.add(ONE);
        uint256 helper = targetAmountIn.mul(onePlusFee);
        uint256 targetAmountInPlusFee = helper.div(ONE);
        return targetAmountInPlusFee;

    }



                                // swaps underlying token with balancer
    function swapTokenInBalancerPool(uint256 _amount) internal {
        
        uint256 tenderOut;
        uint256 minOut = 1; // TODO USE MATHUTILS

        // to calc max spot price seems unnecessary, it is external call, which will be costly, there is already condition about minOut which implies price
        //uint256 maxSpotPrice = balancer.pool.getSpotPrice(address(tenderToken), address(token)).mul(200).div(100); // TODO: USE MATHUTILS
        uint256 maxSpotPrice = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

        // Approve token // we could have MAX approve and do not need to approve every time
        token.approve(address(balancer.pool), _amount);
        // take out from balancer

        (tenderOut,) = balancer.pool.swapExactAmountIn(address(token), _amount, address(tenderToken), minOut, maxSpotPrice);

        // burn tender token
        tenderToken.burn(tenderOut);
    }

    function deposit(uint256 _amount) external override(Staker) {
        

        // Transfer LPT to Staker 
        require(token.transferFrom(msg.sender, address(this), _amount), "ERR_TOKEN_TANSFERFROM");

        // Calculate share price
        uint256 _sharePrice = sharePrice();

        // calc shares for sender
        uint256 shares = _amount.mul(1e18).div(_sharePrice);

        // Mint tenderToken for sender
        tenderToken.mint(msg.sender, shares);

        uint256 stakingAmount;
        // calculates how much to send to pool + sends funds there 
        if(_sharePrice <= tenderPriceinPool()) {
            stakingAmount = _amount;
        } else {
            uint256 targetToPool = targetTokenAmountToPoolPlusFee();
           stakingAmount = _amount.sub(targetToPool);
           // swaps amount necessary for arbitrage to pool
           swapTokenInBalancerPool(targetToPool);
        }

        // Split _amount into staking amount and liquidity amount
        //uint256 liquidityAmount = _amount.mul(liquidityPercentage).div(1e18);
        //uint256 stakingAmount = _amount.sub(liquidityAmount)


        // Add Liquidity
        //addLiquidity(liquidityAmount);



        // Bond LPT
        token.approve(address(livepeer.bondingManager), _amount);
        livepeer.bondingManager.bond(stakingAmount, livepeer.delegate);

        emit Deposit(msg.sender, _amount, shares, _sharePrice);
    }

    function withdraw(uint256 _amount) external override(Staker) {

        // transferFrom tenderToken
        require(tenderToken.transferFrom(msg.sender, address(this), _amount), "ERR_TENDER_TRANSFERFROM");

        // uint256 owed = _amount.mul(sharePrice()).div(1e18);
        
        // makes sure it receives at least 50% out
        uint256 outTokenFromPool;
        uint256 minOut = 1;// owed.mul(10).div(100); // TODO USE MATHUTILS

        // to calc max spot price seems unnecessary, it is external call, which will be costly, there is already condition about minOut which implies price
        //uint256 maxSpotPrice = balancer.pool.getSpotPrice(address(tenderToken), address(token)).mul(200).div(100); // TODO: USE MATHUTILS
        uint256 maxSpotPrice = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

        // Approve token 
        tenderToken.approve(address(balancer.pool), _amount);
        // take out from balancer

        (outTokenFromPool,) = balancer.pool.swapExactAmountIn(address(tenderToken), _amount, address(token), minOut, maxSpotPrice);

        // send underlying token out
        require(token.transfer(msg.sender, outTokenFromPool));
                                                                    //sentToPool = sentToPool.add(_amount); // 


        emit Withdraw(msg.sender, _amount, outTokenFromPool);
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