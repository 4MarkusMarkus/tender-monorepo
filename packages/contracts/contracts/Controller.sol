pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Controller is Ownable {

    event SetContract(bytes32 id, address contractAddress);

    // Track contract ids and contract info
    mapping (bytes32 => address) private registry;

    constructor() public {}

    /**
     * @notice Register contract id and mapped address
     * @param _id Contract id (keccak256 hash of contract name)
     * @param _contractAddress Contract address
     */
    function setContract(bytes32 _id, address _contractAddress) external onlyOwner {
        registry[_id] = _contractAddress;

        emit SetContract(_id, _contractAddress);
    }

    /**
     * @notice Get contract address for an id
     * @param _id Contract id
     */
    function getContract(bytes32 _id) public view returns (address) {
        return registry[_id];
    }
}