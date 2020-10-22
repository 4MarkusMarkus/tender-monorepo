   pragma solidity ^0.6.2;

   interface ITokenStaking {
       function authorizeOperatorContract(address _operator, address _operatorContract) external;
       function eligibleStake(
        address _operator,
        address _operatorContract
    ) external view returns (uint256 balance);
        function activeStake(
        address _operator,
        address _operatorContract
    ) external view returns (uint256 balance);
    function getDelegationInfo(address _operator) external view returns (uint256 amount, uint256 createdAt, uint256 undelegatedAt);

    function balanceOf(address _address) external view returns (uint256 balance);
    function ownerOf(address _operator) external view returns (address);
    function beneficiaryOf(address _operator) external view returns (address payable);
    function authorizerOf(address _operator) external view returns (address);
    function commitTopUp(address _operator) external;
   }

   