// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./auction.sol";

contract AuctionAbstracted {


	function createAuction(
		address _stablecoin,
		uint256 _startTime,
		uint256 _endTime,
		uint256 _startPrice,
		string memory tokenURI,
		bool _preventSniping
	) external returns (uint256){}



	function placeBid(
		uint256 _auctionId,
		uint256 _amount
	) external {}


	function claim(uint256 _auctionId) public {}

	function withdraw(
		uint256 _auctionId
	) external {

	}
}
