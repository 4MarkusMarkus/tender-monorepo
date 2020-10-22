pragma solidity ^0.6.2;

interface IStakeDelegatable {

    function balanceOf(address _address) external view returns (uint256 balance);


    function ownerOf(address _operator) external view returns (address);

    function beneficiaryOf(address _operator) external view returns (address payable);

    function authorizerOf(address _operator) external view returns (address);
}