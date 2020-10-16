pragma solidity ^0.6.2;

interface IController {
    function setContract(bytes32 _id, address _contractAddress) external;
    function getContract(bytes32 _id) external returns (address);
}