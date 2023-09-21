// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//test usdt contract for hardhat tests
//use openzepplin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//test usdt contract for hardhat tests
//implement ERC20 contract
contract Stablecoin is ERC20 {
    //constructor
    constructor() ERC20("USDT", "USDT") {
        //mint 1000 tokens to the deployer
        _mint(msg.sender, 10000 * 10**decimals());
    }
}
