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

// WETH Address 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

contract Staker is ProxyTarget, Ownable, IStaker {
    using SafeMath for uint256;

    struct Balancer {
        IBPool pool;
        address rights;
        uint256 tokenInitialLiquidity;
        uint256 tenderTokenInitialLiquidity;
    }

    modifier autoCollect() {
        collect();
        _;
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

    function deposit(uint256 _amount) external virtual override {
        uint256 shares = _amount.mul(1e18).div(sharePrice());
        require(token.transferFrom(msg.sender, address(this), _amount));
        tenderToken.mint(msg.sender, shares);
    }

    function withdraw(uint256 _amount) external virtual override {
        uint256 owed = _amount.mul(sharePrice()).div(1e18);
        require(tenderToken.transferFrom(msg.sender, address(this), _amount), "ERR_TENDER_TRANSFERFROM");
        tenderToken.burn(_amount); 
        token.transfer(msg.sender, owed);
    }

    function collect() public virtual override {}

    function manageBalancerRights(bytes memory _data) public onlyOwner {
        (bool success, bytes memory returnData) = balancer.rights.call(_data);
        require(success, string(returnData));
    }

    function addLiquidity(uint256 _amount) internal {
        // BPool.join() is only available when the pool is finalized
        // We can send tokens to the pool and then BPool.gulp() to incorporate the balances
        // If we send amounts relative to their current weights we don't change the spot price
        // TODO: find a better mechanism for this

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
}