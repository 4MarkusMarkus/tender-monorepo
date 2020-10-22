pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "../Staker.sol";

import "./interfaces/keep/IKeepToken.sol";
import "./interfaces/keep/ITokenStaking.sol";
import "./interfaces/keep/IKeepRandomBeaconOperator.sol";

contract KeepStaker is Staker {

    struct KeepConfig {
        IKeepToken keepToken;
        ITokenStaking tokenStaking;
        address operator;
        address operatorContract;
        uint256 initialDelegation;
        uint256 initializationPeriod;
    }

    KeepConfig keep; 

    uint256 nextInitializationRound;
    uint256 amountAwaitTopUp; 

    function setKeepConfig(KeepConfig memory _config) public {
        keep = _config;
        bytes memory extraData = abi.encodePacked(address(this), _config.operator, address(this));
        require(_config.keepToken.transferFrom(msg.sender, address(this), _config.initialDelegation));
        keep.keepToken.approveAndCall(address(_config.tokenStaking), _config.initialDelegation, extraData);
        keep.tokenStaking.authorizeOperatorContract(_config.operator, _config.operatorContract);

        nextInitializationRound = block.number.add(_config.initializationPeriod);
    }

    function sharePrice() public override(Staker) view returns (uint256) {
        uint256 tenderSupply = tenderToken.totalSupply().sub(tenderToken.balanceOf(address(balancer.pool)));
        
        uint256 balanceThis = token.balanceOf(address(this));
        uint256 balanceOperator = keep.tokenStaking.balanceOf(keep.operator);
        uint256 keepPooled = token.balanceOf(address(balancer.pool));

        uint256 keepFromStaker = balanceThis.add(balanceOperator).sub(keep.initialDelegation).add(keepPooled).sub(balancer.tokenInitialLiquidity).add(amountAwaitTopUp);

        if (tenderSupply == 0) { return 1e18; }

        return keepFromStaker.mul(1e18).div(tenderSupply);
    }

    function deposit(uint256 _amount) public override(Staker) {
        uint256 sharePrice = sharePrice();

        uint256 shares = _amount.mul(1e18).div(sharePrice);

        tenderToken.mint(msg.sender, shares);

        // Split _amount into staking amount and liquidity amount
        uint256 liquidityAmount = _amount.mul(liquidityPercentage).div(1e18);

        require(token.transferFrom(msg.sender, address(this), _amount), "ERR_TOKEN_TRANSFERFROM");

        addLiquidity(liquidityAmount);

        if (block.number > nextInitializationRound) {
            uint256 currentBalance = keep.keepToken.balanceOf(address(this));
            if (amountAwaitTopUp > 0) {
                keep.tokenStaking.commitTopUp(keep.operator);
                amountAwaitTopUp = 0;
            }
            nextInitializationRound = block.number.add(keep.initializationPeriod);
            bytes memory extraData = abi.encodePacked(address(this), keep.operator, address(this));
            keep.keepToken.approveAndCall(address(keep.tokenStaking), currentBalance, extraData);
            amountAwaitTopUp = amountAwaitTopUp.add(currentBalance);
        } 
    }

    function withdraw(uint256 _amount) public override(Staker) {
        collect();
        super.withdraw(_amount);
    }

}