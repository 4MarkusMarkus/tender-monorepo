pragma solidity ^0.6.2; 

import "../IController.sol";
/**
 * @title ProxyTarget
 * @notice The base contract that target contracts used by a proxy contract should inherit from
 */
contract ProxyTarget {
    // Used to look up target contract address in controller's registry
    IController public controller;
    bytes32 public targetId;
}