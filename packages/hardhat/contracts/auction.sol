// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./nft.sol";


contract Auction is Ownable {
    using SafeMath for uint256;

    

    struct AuctionInfo {
        address seller;
        IERC20 stablecoin;
        uint256 startTime;
        uint256 endTime;
        uint256 startPrice;
        address highestBidder;
        uint256 highestBid;
        uint256 tokenId;
        address tokenContract;
        bool withdrawn;
    }

    uint256 public auctionCount;
    mapping(uint256 => AuctionInfo) public auctions;

    function getAuction(uint256 _auctionId) external view returns (AuctionInfo memory) {
        return auctions[_auctionId];
    }
 


    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        address indexed stablecoin,
        uint256 tokenId,
        address tokenContract,
        uint256 endTime,
        uint256 startTime,
        uint256 startPrice
    );

    event Withdrawal(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    event Claimed(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );


    modifier onlyAuctionOpen(uint256 _auctionId) {
        require(auctions[_auctionId].startTime <= block.timestamp, "Auction is not open");
        _;
    }

    modifier onlyAuctionEnded(uint256 _auctionId) {
        require(auctions[_auctionId].endTime <= block.timestamp, "Auction has not ended yet");
        _;
    }

    function createAuction(
        address _stablecoin,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _startPrice,
        uint256 _tokenId,
        address _tokenContract
    ) external returns (uint256) {

        require(_endTime > block.timestamp, "End time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_startPrice > 0, "Start price must be greater than 0");


        require( IERC721(_tokenContract).isApprovedForAll(msg.sender, address(this)), "Contract not approved to transfer NFT");

        auctions[++auctionCount] = AuctionInfo({
            seller: msg.sender,
            stablecoin: IERC20(_stablecoin),
            startTime: _startTime,
            endTime: _endTime,
            highestBidder: address(0),
            highestBid: 0,
            startPrice: _startPrice,
            tokenId: _tokenId,
            tokenContract: _tokenContract,
            withdrawn: false
        });

        emit AuctionCreated(auctionCount, msg.sender, _stablecoin, _tokenId, _tokenContract, _endTime, _startTime, _startPrice);
        return auctionCount;

    }


    // function startAuction(uint256 _auctionId) external onlyOwner {
    //     AuctionInfo storage auction = auctions[_auctionId];
    //     require(auction.starTime > block.timestamp, "Auction already started");
    //     auction.startTime = block.timestamp;
    // }

    function placeBid(uint256 _auctionId, uint256 _amount) external onlyAuctionOpen(_auctionId) {
        AuctionInfo storage auction = auctions[_auctionId];
        require(_amount > auction.highestBid, "Bid must be higher than the current highest bid");
        require(auction.stablecoin.transferFrom(msg.sender, address(this), _amount), "Transfer failed");


        // Refund the previous highest bidder
        if (auction.highestBidder != address(0)) {
            auction.stablecoin.transfer(auction.highestBidder, auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = _amount;

        emit BidPlaced(_auctionId, msg.sender, _amount);
    }

    // function endAuction(uint256 _auctionId) public onlyAuctionOpen(_auctionId) {
    //     AuctionInfo storage auction = auctions[_auctionId];
    //     auction.auctionState = AuctionState.Ended;
    //     auction.auctionEnded = true; // Set auctionEnded to true when ending manually

    //     // Transfer funds to the auction seller
    //     auction.stablecoin.transfer(auction.seller, auction.highestBid);

    //     // Transfer the NFT to the highest bidder
    //     _safeMint(auction.highestBidder, _auctionId);
    // }

    function claim(uint256 _auctionId) external onlyAuctionEnded(_auctionId) {
        AuctionInfo storage auction = auctions[_auctionId];
        require(auction.highestBidder == msg.sender, "Only the highest bidder can claim");

        // Transfer the NFT to the highest bidder
        IERC721(auction.tokenContract).safeTransferFrom(auction.seller, auction.highestBidder, _auctionId);

        emit Claimed(_auctionId, msg.sender, auction.highestBid);
    }

    function withdraw(uint256 _auctionId) external onlyAuctionEnded(_auctionId) {
        AuctionInfo storage auction = auctions[_auctionId];
        require(!auction.withdrawn, "Funds already withdrawn");
        auction.stablecoin.transfer(msg.sender, auction.highestBid);
        auction.withdrawn = true;
        emit Withdrawal(_auctionId, msg.sender, auction.highestBid);
    }
}
