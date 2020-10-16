pragma solidity ^0.6.2; 

import "./ProxyTarget.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Proxy is ProxyTarget {
    constructor(bytes32 _targetId, IController _controller) public {
        targetId = _targetId;
        controller = _controller;
    }

    fallback() external payable {
        (bool success, bytes memory returnData) = controller.getContract(targetId).delegatecall(msg.data);
        require(success, string(returnData));
    }

    receive() external payable {}
}
