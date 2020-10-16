pragma solidity ^0.6.2;

interface IRoundsManager {
    function currentRound() external view returns (uint256);
}