// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract MyContract is EIP712 {
        mapping(address => uint256) private nonces;

        function _myFunction(address owner, uint256 mp)public pure returns(bool) {
            return true;
        }

    constructor(string memory name, string memory version) EIP712(name, version){


    }


    function executeMyFunctionFromSignature(
        bytes memory signature,
        address owner,
        uint256 myParam,
        uint256 deadline
    ) external {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("MyFunction(address owner,uint256 myParam,uint256 nonce,uint256 deadline)"),
            owner,
            myParam,
            nonces[owner],
            deadline
        )));


        address signer = ECDSA.recover(digest, signature);
        require(signer == owner, "MyFunction: invalid signature");
        require(signer != address(0), "ECDSA: invalid signature");

        require(block.timestamp < deadline, "MyFunction: signed transaction expired");
        nonces[owner]++;

        _myFunction(owner, myParam);
    }
}