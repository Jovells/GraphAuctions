// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./auction.sol";

import "./auction.sol";



contract AuctionWallet is MinimalForwarder  {

        struct ForwardReques {
        bytes32 contract;
        address to;
        // uint256 value;
        // uint256 gas;
        uint256 nonce;
        bytes data;
    }

    address public auctionContract;


    address public owner;
    mapping(address => uint256) private _nonces;

    constructor(address _owner) {
        owner = _owner;
    }

    function _msgSender() internal view returns (address sender) {
        return owner;
    }

    bytes32 private constant _TYPEHASH =
        keccak256("ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)");


    
    function verify(ForwardRequest calldata req, bytes calldata signature, bytes32 _TYPEHASH) public view override returns (bool) {
        address signer = _hashTypedDataV4(
            keccak256(abi.encode(_TYPEHASH, req.from, req.to, req.value, req.gas, req.nonce))
        ).recover(signature);
        return _nonces[req.from] == req.nonce && signer == req.from;
    }




    
    function execute (ForwardRequest calldata req, bytes calldata signature) public payable override returns (bool, bytes memory)  {
            require(msg.sender == owner, "Only owner can perform this action");
            return super.execute( req, signature);
    }

    function transact( ForwardRequest calldata req, bytes calldata signature) public{
        require(verify(req, signature), "MinimalForwarder: signature does not match request");
        _nonces[req.from] = req.nonce + 1;

        (bool success, bytes memory returndata) = req.to.call{gas: req.gas, value: req.value}(
            abi.encodePacked(req.data, req.from)
        );

        if(req.value > 0){
           IERC20(req.from).transfer(req.to, req.value);
        }
        if(req.from == auctionContract){
            Auction auction = Auction(req.from);
            auction.withdraw(req.value);
        }


    }

    	function createAuction(
		address _stablecoin,
		uint256 _startTime,
		uint256 _endTime,
		uint256 _startPrice,
		string memory tokenURI,
		bool _preventSniping
	) external returns (uint256){
        Auction auction = new Auction(_stablecoin, _startTime, _endTime, _startPrice, tokenURI, _preventSniping);
        auctionContract = address(auction);
        return auctionContract.balance;
    }

    modifier isVerified() {
        require(verify(), "Invalid signature");
        _;
    }



	function placeBid(
		uint256 _auctionId,
		uint256 _amount
	) external {


        
        Auction(auctionContract).placeBid(_auctionId, _amount);
    }


	function claim(uint256 _auctionId) public {}

	function withdraw(
		uint256 _auctionId
	) external {

        Auction(auctionContract).withdraw(_auctionId);
	}

}
