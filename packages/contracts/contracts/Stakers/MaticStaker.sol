pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "../Staker.sol";

// interfaces
import "./interfaces/matic/IValidatorShare.sol";

contract MaticStaker is Staker {

    // LivepeerStaker only supports on single delegate right now
    // Each delegate would require a separate contract bound to this one to stake and unstake
    struct MaticConfig {
        IValidatorShare validatorShare;
    }

    MaticConfig private matic;

    function setMaticConfig(MaticConfig memory _config) public {
        matic = _config;
    }

    function sharePrice() public override(Staker) view returns (uint256) {
        // Get the totalSupply for tenderToken, minus the pooled amount
        // Pooled amount does not count for shares
        uint256 tenderSupply = tenderToken.totalSupply().sub(tenderToken.balanceOf(address(balancer.pool)));

        // Get the outstanding balance of LPT for Staker
        uint256 outstanding = token.balanceOf(address(this));
        
        uint256 pooled = token.balanceOf(address(balancer.pool));

        uint256 totalStake = matic.validatorShare.totalStake();
    
        uint256 maticFromStaker = outstanding.add(totalStake).add(pooled).sub(balancer.tokenInitialLiquidity);
        if (tenderSupply ==  0 ) { return 1e18; }
        return maticFromStaker.mul(1e18).div(tenderSupply);
    }

    function deposit(uint256 _amount) public override(Staker) {
        collect();
        // Calculate share price
        uint256 sharePrice = sharePrice();

        uint256 shares = _amount.mul(1e18).div(sharePrice);

        // Mint tenderToken
        tenderToken.mint(msg.sender, shares);

         // Transfer LPT to Staker
        require(token.transferFrom(msg.sender, address(this), _amount), "ERR_TOKEN_TANSFERFROM");

        // Check if we need to do arbitrage if spotprice is at least 10% below shareprice
        _amount = arbitrageTokenToTender(_amount);

        // TODO: require proper minimum boundary
        if (_amount <= 1) { return; }

        // Split _amount into staking amount and liquidity amount
        uint256 liquidityAmount = _amount.mul(liquidityPercentage).div(1e18);

        // Add Liquidity
        addLiquidity(liquidityAmount);

        // Bond LPT
        token.approve(address(matic.validatorShare), _amount);
        matic.validatorShare.buyVoucher(_amount.sub(liquidityAmount));

        emit Deposit(msg.sender, _amount, shares, sharePrice);
    }

    function withdraw(uint256 _amount) public override(Staker) {
        collect();
        uint256 owed = _amount.mul(sharePrice()).div(1e18);

        // transferFrom tenderToken
        require(tenderToken.transferFrom(msg.sender, address(this), _amount), "ERR_TENDER_TRANSFERFROM");
        
        // swap with balancer
        // Approve token 
        tenderToken.approve(address(balancer.pool), _amount);
        (uint256 out,) = balancer.pool.swapExactAmountIn(address(tenderToken), _amount, address(token), MIN, MAX);

        // send underlying
        require(token.transfer(msg.sender, out));

        // sellVoucher(out);

        emit Withdraw(msg.sender, _amount, out);
    }

    function collect() public override(Staker) {
        withdrawRewards();

        uint256 amount = token.balanceOf(address(this));
       
        amount = arbitrageTokenToTender(amount);

        // Send a percentage to liquidity pool
        uint256 liquidityAmount = amount.mul(liquidityPercentage).div(1e18);

        matic.validatorShare.buyVoucher(amount.sub(liquidityAmount));
    }

    function withdrawRewards() internal {
        try matic.validatorShare.withdrawRewards() {
            return;
        } catch {
            return;
        }
    }

    function sellVoucher(uint256 _amount) internal {
        try matic.validatorShare.sellVoucher(_amount) {
            return;
        } catch {
            return;
        }
    }

    function arbitrageTokenToTender(uint256 _availableAmount) internal returns (uint256 remainingAmount) {

        // Check if we need to do arbitrage if spotprice is at least 10% below shareprice
        // TODO: use proper maths (MathUtils)
        address _token = address(token);
        address _tenderToken = address(tenderToken);
        uint256 spotPrice = balancer.pool.getSpotPrice(_token, _tenderToken);
        uint256 sharePrice = sharePrice();
        if (spotPrice.mul(110).div(100) < sharePrice) {
            // TODO: This will revert if the price difference is too large 
            uint256 tokenIn = balancerCalcInGivenPrice(_token, _tenderToken, sharePrice, spotPrice);
            if (tokenIn > _availableAmount) {
                tokenIn = _availableAmount;
            }
            token.approve(address(balancer.pool), tokenIn);
            uint256 out;
            try balancer.pool.swapExactAmountIn(_token, tokenIn, _tenderToken, MIN, MAX) {
                // burn the derivative amount we bought up 
                tenderToken.burn(out);
                remainingAmount = _availableAmount.sub(tokenIn);
            } catch {
                remainingAmount = _availableAmount;
                return remainingAmount;
            }

        }
        return remainingAmount;
    }

}