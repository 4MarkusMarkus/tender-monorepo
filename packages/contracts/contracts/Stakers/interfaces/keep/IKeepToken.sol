pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IKeepToken is IERC20 {
    function approveAndCall(address _spender, uint256 _value, bytes calldata _extraData) external returns (bool success);
}