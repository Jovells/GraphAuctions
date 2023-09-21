// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DauctionNft is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    event minted(uint256 indexed tokenId);

    constructor() ERC721("DauctionNft", "DNFT") {}

    function mint(address operator, string memory tokenUri) external {
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        setApprovalForAll(operator, true);
        emit minted(tokenId);
    }
}