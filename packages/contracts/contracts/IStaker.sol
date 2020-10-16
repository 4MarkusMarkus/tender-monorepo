pragma solidity ^0.6.2;

interface IStaker {

    event Deposit(address indexed staker, uint256 amount, uint256 sharesReceived, uint256 sharePrice);
    event Withdraw(address indexed staker, uint256 shares, uint256 amountReceived);

    function sharePrice() external view returns (uint256);
    function deposit(uint256 _amount) external;
    function withdraw(uint256 _amount) external;
    function collect() external;
}