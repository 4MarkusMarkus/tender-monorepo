pragma solidity ^0.6.2;

interface IValidatorShare {
    function buyVoucher(uint256 _amount) external;
    function sellVoucher(uint256 _minClaimAmount) external;
    function withdrawRewards() external;
    function unStakeClaimTokens() external;
    function reStake() external;
    function totalStake() external view returns (uint256);
}