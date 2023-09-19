import { expect } from "chai";
import { ethers } from "hardhat";
import { Auction, DauctionNft, Stablecoin } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

const ONE_WEEK = Math.floor(new Date(Date.now() + 7 * 24 * 60 * 60).getTime() / 1000);
console.log(ONE_WEEK);

describe("Auction", function () {
  let auction: Auction,
    dnft: DauctionNft,
    stablecoin: Stablecoin,
    owner: SignerWithAddress,
    seller: SignerWithAddress,
    bidder1: SignerWithAddress,
    bidder2: SignerWithAddress;

  beforeEach(async function () {
    [owner, seller, bidder1, bidder2] = await ethers.getSigners();

    owner._checkProvider();

    const DNFT = await ethers.getContractFactory("DauctionNft");
    dnft = (await DNFT.deploy()) as DauctionNft;

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    stablecoin = (await Stablecoin.deploy()) as Stablecoin;

    const Auction = await ethers.getContractFactory("Auction");
    auction = (await Auction.deploy(dnft.address)) as Auction;
  });

  describe("createAuction", function () {
    it("should allow a user to create an auction", async function () {
      // Mint a new DNFT token and assign it to the seller
      const tx = await dnft.connect(seller).mint(auction.address);

      const receipt = await tx.wait();

      // Get the auction ID from the transaction receipt
      const tokenId = receipt.events?.[0].args?.[0];

      // Create a new auction
      const startTime = Math.floor(Date.now() / 1000);
      const auctionId = await auction
        .connect(seller)
        .createAuction(stablecoin.address, startTime, ONE_WEEK, 10, tokenId, auction.address, { gasLimit: 3e6 });

      // Assert that the auction was created
      expect(await auction.getAuction(auctionId)).to.deep.equal([
        seller.address,
        stablecoin.address,
        startTime,
        ONE_WEEK,
        ethers.constants.AddressZero,
        0,
        10,
        tokenId,
      ]);
    });
  });

  describe("Bidding", function () {
    let auctionId: BigNumber;
    beforeEach(async function () {
      const startTime = Math.floor(Date.now() * 1000);
      auctionId = await auction.connect(seller).createAuction(stablecoin.address, startTime, ONE_WEEK, 10);
    });
    it("should allow users to place bids", async function () {
      // Approve the auction contract to transfer stablecoin on behalf of bidder1
      await stablecoin.connect(bidder1).approve(auction.address, 100);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // Assert that the highest bid is now 100
      expect((await auction.getAuction(auctionId)).highestBid).to.equal(100);
    });

    it("should refund the previous highest bidder", async function () {
      // Approve the auction contract to transfer stablecoin on behalf of bidder1 and bidder2
      await stablecoin.connect(bidder1).approve(auction.address, 100);
      await stablecoin.connect(bidder2).approve(auction.address, 200);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // Place a higher bid on the auction
      await auction.connect(bidder2).placeBid(auctionId, 200);

      // Assert that bidder1 was refunded their bid amount
      expect(await stablecoin.balanceOf(bidder1.address)).to.equal(100);
    });

    it("should revert if the bid is not higher than the current highest bid", async function () {
      // Approve the auction contract to transfer stablecoin on behalf of bidder1
      await stablecoin.connect(bidder1).approve(auction.address, 100);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // Attempt to place a lower bid on the auction
      await expect(auction.connect(bidder2).placeBid(auctionId, 50)).to.be.revertedWith(
        "Bid must be higher than the current highest bid",
      );
    });
  });

  describe("claim & Withdraw", function () {
    let auctionId: BigNumber;

    beforeEach(async function () {
      const startTime = Math.floor(Date.now() * 1000);
      const endTime = startTime + 60;
      const auctionId = await auction.connect(seller).createAuction(stablecoin.address, startTime, ONE_WEEK, 10);

      await stablecoin.connect(bidder1).approve(auction.address, 100);
      await stablecoin.connect(bidder2).approve(auction.address, 200);
      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);
      // Place a higher bid on the auction
      await auction.connect(bidder2).placeBid(auctionId, 200);

      await new Promise(resolve => setTimeout(resolve, endTime - Date.now() * 1000));
    });
    it("should allow the highest bidder to claim the DNFT", async function () {
      // Approve the auction contract to transfer the DNFT on behalf of the seller
      await dnft.connect(seller).setApprovalForAll(auction.address, true);

      // Approve the auction contract to transfer stablecoin on behalf of bidder1
      await stablecoin.connect(bidder1).approve(auction.address, 100);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // End the auction and claim the DNFT
      await auction.connect(bidder1).claim(0);

      // Assert that the DNFT is now owned by bidder1
      expect(await dnft.ownerOf(0)).to.equal(bidder1.address);
    });

    it("should revert if the caller is not the highest bidder", async function () {
      // Approve the auction contract to transfer the DNFT on behalf of the seller
      await dnft.connect(seller).setApprovalForAll(auction.address, true);

      // Approve the auction contract to transfer stablecoin on behalf of bidder1 and bidder2
      await stablecoin.connect(bidder1).approve(auction.address, 100);
      await stablecoin.connect(bidder2).approve(auction.address, 200);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // Attempt to claim the DNFT as bidder2
      await expect(auction.connect(bidder2).claim(0)).to.be.revertedWith("Only the highest bidder can claim");
    });

    it("should revert if the auction has already ended", async function () {
      // Mint a new DNFT token and assign it to the seller

      // Approve the auction contract to transfer the DNFT on behalf of the seller
      await dnft.connect(seller).setApprovalForAll(auction.address, true);

      // Approve the auction contract to transfer stablecoin on behalf of bidder1
      await stablecoin.connect(bidder1).approve(auction.address, 100);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // End the auction and claim the DNFT
      await auction.connect(bidder1).claim(0);

      // Attempt to claim the DNFT again
      await expect(auction.connect(bidder1).claim(0)).to.be.revertedWith("Auction has already ended");
    });
    it("should allow the seller to withdraw the highest bid", async function () {
      // Approve the auction contract to transfer the DNFT on behalf of the seller
      await dnft.connect(seller).setApprovalForAll(auction.address, true);

      // Approve the auction contract to transfer stablecoin on behalf of bidder1 and bidder2
      await stablecoin.connect(bidder1).approve(auction.address, 100);
      await stablecoin.connect(bidder2).approve(auction.address, 200);

      // Place a bid on the auction
      await auction.connect(bidder1).placeBid(auctionId, 100);

      // Place a higher bid on the auction
      await auction.connect(bidder2).placeBid(auctionId, 200);

      // End the auction and withdraw the highest bid
      await auction.connect(seller).withdraw(0);

      // Assert that the seller received the highest bid amount
      expect(await stablecoin.balanceOf(seller.address)).to.equal(200);
    });

    it("should revert if there are no funds to withdraw", async function () {
      // Approve the auction contract to transfer the DNFT on behalf of the seller
      await dnft.connect(seller).setApprovalForAll(auction.address, true);

      // End the auction and attempt to withdraw the highest bid
      await expect(auction.connect(seller).withdraw(auctionId)).to.be.revertedWith("No funds to withdraw");
    });
  });
});
