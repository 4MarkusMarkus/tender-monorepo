pragma solidity ^0.6.2;

interface IBondingManager{
    // staking actions
    function bond(uint256 _amount, address _to) external;
    function unbond(uint256 _amount) external;
    function rebond(uint256 _unbondingLockId) external;
    function rebondFromUnbonded(address _to, uint256 _unbondingLockId) external;
    function withdrawStake(uint256 _unbondingLockId) external;
    function withdrawFees() external;

    // state 
    function pendingStake(address _delegator, uint256 _endRound) external view returns (uint256);
    function pendingFees(address _delegator, uint256 _endRound) external view returns (uint256);
    function transcoderTotalStake(address _transcoder) external view returns (uint256);
    function getDelegatorUnbondingLock(address _delegator, uint256 _unbondingLockId) external view returns (uint256 amount, uint256 withdrawRound);
}