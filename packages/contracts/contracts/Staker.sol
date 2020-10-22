pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

// libraries
import "@openzeppelin/contracts/math/SafeMath.sol";

// local imports 
import "./Proxy/ProxyTarget.sol";
import "./Token/TenderToken.sol";

// external imports
import "@openzeppelin/contracts/access/Ownable.sol";

// interfaces 
import "./IStaker.sol";
import "./Token/ITenderToken.sol";
import "./Swap/IBPool.sol";
import "./Swap/IOneInch.sol";
import "./Swap/IWETH.sol";

import "./Balancer/contracts/test/BNum.sol";

// WETH Address 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

contract Staker is ProxyTarget, Ownable, BNum, IStaker {
    using SafeMath for uint256;

    uint256 internal constant ONE = 1e18;
    uint256 internal constant MAX = 2**256-1;
    uint256 internal constant MIN = 1; 
    uint256 internal constant liquidityPercentage = 1e17;

    struct Balancer {
        IBPool pool;
        address rights;
        uint256 tokenInitialLiquidity;
        uint256 tenderTokenInitialLiquidity;
    }

    // Tokens
    // Underlying asset
    IERC20 public token;
    // Derivative
    ITenderToken public tenderToken;

    // Swap
    Balancer public balancer; 
    IOneInch oneInch;
    IWETH weth;

    // TODO: WETH and oneInch can be constants 
    // Balancer Pool needs to be created in constructor because we can not add liquidity for both tokens otherwise
    // Will have to approve _token before calling init and in init call _token.transferFrom then mint the same amount of tenderToken
    // And add both to the pool
    function init(IERC20 _token, ITenderToken _tenderToken, Balancer memory _balancer, IOneInch _oneInch, IWETH _weth) public virtual {
        token = _token;
        tenderToken = _tenderToken;
        balancer = _balancer;
        oneInch = _oneInch;
        weth = _weth;
    }

    function sharePrice() public virtual override view returns (uint256) {
        uint256 tenderSupply = tenderToken.totalSupply().sub(tenderToken.balanceOf(address(balancer.pool)));
        uint256 outstanding = token.balanceOf(address(this));
        if (tenderSupply ==  0 ) { return 1e18; }
        return outstanding.mul(1e18).div(tenderSupply);
    }

    function deposit(uint256 _amount) public virtual override {
        // Calculate share price
        uint256 sharePrice = sharePrice();

        uint256 shares = _amount.mul(1e18).div(sharePrice);

        // Mint tenderToken
        tenderToken.mint(msg.sender, shares);

         // Transfer LPT to Staker
        require(token.transferFrom(msg.sender, address(this), _amount), "ERR_TOKEN_TANSFERFROM");

        // Check if we need to do arbitrage if spotprice is at least 10% below shareprice
        // TODO: use proper maths (MathUtils)
        address _token = address(token);
        address _tenderToken = address(tenderToken);
        uint256 spotPrice = balancer.pool.getSpotPrice(_token, _tenderToken);
        if (spotPrice.mul(110).div(100) < sharePrice) {
            uint256 tokenIn = balancerCalcInGivenPrice(_token, _tenderToken, sharePrice, spotPrice);
            if (tokenIn > _amount) {
                tokenIn = _amount;
            }
            token.approve(address(balancer.pool), tokenIn);
            (uint256 out,) = balancer.pool.swapExactAmountIn(_token, tokenIn, _tenderToken, MIN, MAX);
            // burn the derivative amount we bought up 
            tenderToken.burn(out);
            _amount  = _amount.sub(tokenIn);
        }

        // TODO: require proper minimum boundary
        if (_amount <= 1) { return; }

        // Split _amount into staking amount and liquidity amount
        uint256 liquidityAmount = _amount.mul(liquidityPercentage).div(1e18);

        // Add Liquidity
        addLiquidity(liquidityAmount);

        emit Deposit(msg.sender, _amount, shares, sharePrice);
    }

    function withdraw(uint256 _amount) public virtual override {
        uint256 owed = _amount.mul(sharePrice()).div(1e18);

        // transferFrom tenderToken
        require(tenderToken.transferFrom(msg.sender, address(this), _amount), "ERR_TENDER_TRANSFERFROM");
        
        // swap with balancer
        // Approve token 
        tenderToken.approve(address(balancer.pool), _amount);
        (uint256 out,) = balancer.pool.swapExactAmountIn(address(tenderToken), _amount, address(token), MIN, MAX);

        // send underlying
        require(token.transfer(msg.sender, out));

        emit Withdraw(msg.sender, _amount, out);
    }

    function collect() public virtual override {}

    function manageBalancerRights(bytes memory _data) public onlyOwner {
        (bool success, bytes memory returnData) = balancer.rights.call(_data);
        require(success, string(returnData));
    }

    function addLiquidity(uint256 _amount) internal {
        // mint tenderTokens for _amount 
        // tenderTokens in the pool will not count towards the share price
        address pool = address(balancer.pool);

        // To not change the balance of the pool we must calculate
        // How many tenderTokens to mint based on its weight relative to the underlying token
        uint256 tenderWeight = balancer.pool.getNormalizedWeight(address(tenderToken));
        uint256 tokenWeight = uint256(1e18).sub(tenderWeight);
        uint256 tenderMintAmount = _amount.mul(tenderWeight.mul(1e18).div(tokenWeight)).div(1e18);

        tenderToken.mint(pool, tenderMintAmount);
        token.approve(pool, _amount);
        require(token.transfer(pool, _amount));

        // Gulp the tokens into the pool
        balancer.pool.gulp(address(tenderToken));
        balancer.pool.gulp(address(token));
    }

    function balancerCalcInGivenPriceSansFee(address _tokenIn, address _tokenOut, uint256 _targetPrice, uint256 _spotPrice) internal view returns (uint256 tokenIn) {
        uint256 tokenOutDenorm = balancer.pool.getDenormalizedWeight(_tokenOut);
        uint256 weightRatio = bdiv(
            tokenOutDenorm,
            badd(balancer.pool.getDenormalizedWeight(_tokenIn), tokenOutDenorm)
        );

        uint256 priceRatio = bdiv(_targetPrice, _spotPrice);
        uint256 norm = bpow(priceRatio, weightRatio);
        return bmul(
            balancer.pool.getBalance(_tokenIn),
            bsub(norm, ONE)
        );
    }

    function balancerCalcInGivenPrice(address _tokenIn, address _tokenOut, uint256 _targetPrice, uint256 _spotPrice) internal view returns (uint256 tokenIn) {
        uint256 tokenIn = balancerCalcInGivenPriceSansFee(_tokenIn, _tokenOut, _targetPrice, _spotPrice);
        uint256 swapFee = balancer.pool.getSwapFee();
        return tokenIn.mul(swapFee.add(ONE)).div(ONE);
    }
}