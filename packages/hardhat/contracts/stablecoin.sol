// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//test usdt contract for hardhat tests
//use openzepplin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//test usdt contract for hardhat tests
//implement ERC20 contract
contract Stablecoin is ERC20 {
    function decimals() public override pure returns (uint8){
        return 6;
    }
    //constructor
    constructor() ERC20("AuctionUSDC", "AUSDC") {
        //mint 1000 tokens to the deployer
        _mint(msg.sender, 10000000000 * 10**decimals());
    }
    function mint() public{
        _mint(msg.sender, 10 * 10**decimals());
    }
}
