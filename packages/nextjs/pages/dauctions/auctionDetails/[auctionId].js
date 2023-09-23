import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Chip, Input, MenuItem, Select, Stack, TextField, TextareaAutosize, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EventListing from "../../../components/dauctions/eventListing";
import { useRouter } from "next/router";
import { useScaffoldContractRead } from "../../../hooks/scaffold-eth/useScaffoldContractRead";
import { useAccount, useWalletClient } from "wagmi";
import { useScaffoldContractWrite } from "../../../hooks/scaffold-eth/useScaffoldContractWrite";
import { getTxnEventData, getTxnEventArg, Time  } from "../../../utils/auctions";
import { convertIpfsUrl } from "../../../utils/auctions";
import { stablecoins } from "../../../utils/auctions";
import { useScaffoldContract } from "../../../hooks/scaffold-eth/useScaffoldContract";
import {GraphURL} from "../../../utils/auctions/";

const d = {
  dateCreated: Time.formatDate(1634198400),
  name: 'Honda Civic',
  auctioneer: { name: 'Ghana Ports', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
  startTime: Time.formatDate(1634298400),
  endTime: Time.formatDate(1634298400),
  highestBid: 5000,
  highestBidder: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  externalLink: 'https://www.google.com',
  decription: "Lorem ipsum bibendum. Sed vel nisl vel velit bibendum bibendum. Sed vel nisl vel velit bibendum bibendum.",
  imageUrl: 'https://th.bing.com/th/id/OIP.b8TMej-xNjY_4Y_Hz-ETJQHaE8?pid=ImgDet&rs=1',
  currency: stablecoins[0],
};

// export async function getServerSideProps({ params }) {
//   const auctionId = params.auctionId;

//   const queryUrl = 'https://api.studio.thegraph.com/query/53468/auctiontest/version/latest';
//   const query = `{
//     auctionCreateds(where: {auctionId: ${auctionId}}) {
//       id
//       auctionId
//       seller
//       stablecoin
//       blockNumber
//       blockTimestamp
//       endTime
//       startPrice
//       startTime
//       tokenContract
//       tokenId
//       transactionHash
//     }
//   }`;

//   const res = await fetch(queryUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     },
//     body: JSON.stringify({ query }),
//   }).catch((error) => console.log(error));

//   const data = await res.json()

//   console.log(data.data.auctionCreateds)
    

//   return { props: { auctionId, auction : data?.data?.auctionCreateds?.[0] || null } }
// }

function convertBigIntsToNumbers(obj) {
  if (typeof obj === 'bigint') {
    return Number(obj);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntsToNumbers(value)])
    );
  } else {
    return obj;
  }
}

function AuctionDetails() {
  const [events, setEvents] = useState(null);
  const router = useRouter()
  const {data: auctionDetailsFromContract} = useScaffoldContractRead({
    contractName: "Auction",
    functionName: "getAuction",
    args: [router.query.auctionId],
  })

  const account = useAccount()

  const bidder = useScaffoldContractWrite({
    contractName: "Auction",
    functionName: "placeBid",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
  });
  const stableCoin = useScaffoldContractWrite({
    contractName: "AUSDC",
    functionName: "approve",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
  });

  const withdrawer = useScaffoldContractWrite({
    contractName: "Auction",
    functionName: "withdraw",
  });
   const claimer = useScaffoldContractWrite({
    contractName: "Auction",
    functionName: "claim",
  });

  const {data: tokenUriFromContract} = useScaffoldContractRead({
    contractName: "DauctionNft",
    functionName: "tokenURI",
    args: [auctionDetailsFromContract?.tokenId],
  })


  const [auction, setAuction] = useState({});
  
  const [bid, setBid] = useState(0);

  useEffect(() => {
    if (tokenUriFromContract) {
      console.log('auctionDetailsFromContract',auctionDetailsFromContract, 'tokenUriFromContract', tokenUriFromContract,
  
      )
      let auc = convertBigIntsToNumbers(auctionDetailsFromContract);
      async function getAuctionData() {

        const metadata = await (await fetch(convertIpfsUrl(tokenUriFromContract))).json();
        const imageUrl = convertIpfsUrl(metadata.image);
        auc =  { ...metadata, ...auc, imageUrl}
        console.log(auc)
        setAuction(auc);
        setBid((auc.startPrice + 1) * 10 ** -6)
      }
      try {
          getAuctionData()
        } catch (error) {
          console.log(error)
        }
    }

  }, [auctionDetailsFromContract, tokenUriFromContract]);

  //read withdrawal and Bid EVents from The Graph
  useEffect(() => {
    if(router.query.auctionId){
      console.log('r', router.query.auctionId)
      async function getAuctionEvents() {
        const query = `{
          claimeds(where: {auctionId: ${router.query.auctionId}}) {
            id
            auctionId
            bidder
            blockNumber
            blockTimestamp
            transactionHash
            amount
          }
          withdrawals(where: {auctionId: ${router.query.auctionId}}) {
            auctionId
            bidder
            blockNumber
            blockTimestamp
            transactionHash
            amount
          }
          bidPlaceds(where: {auctionId: ${router.query.auctionId}}) {
            auctionId
            bidder
            blockNumber
            blockTimestamp
            transactionHash
            amount
          }
        }`;
  
        const res = await fetch(GraphURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ query }),
        }).catch((error) => console.log(error));
  
        const data = await res.json()
        console.log('eventsFromgraph', data)
        setEvents(data?.data)
        return data
  
      }
      
      getAuctionEvents()
    }
  },[router.query.auctionId])
  

  const { data: walletClient } = useWalletClient();
  const { data: auctionContract } = useScaffoldContract({
    contractName: "Auction",
    walletClient,
  });

  async function handleBid() {
    const parsedBid = parseInt(bid*10 ** 6)
    if (parsedBid  <= auction.highestBid) {

      throw new Error('Bid must be higher than highest bid');
    }
    await stableCoin.writeAsync({
      functionName: 'approve',
      args:[auctionContract.address, parsedBid ],
      onBlockConfirmation: (txnReceipt) => {
        bidder.writeAsync({
          args:[router.query.auctionId, parsedBid],
          onBlockConfirmation: (txnReceipt) => {
              const data = getTxnEventData(txnReceipt, 'BidPlaced',  auctionContract.abi);
    
          }
        });
        console.log('txnReceipt');

      }
    });
    
  }
  async function handleWithdraw() {
    console.log('withdraw');
    withdrawer.writeAsync({
      contractName: "Auction",
      functionName: "withdraw",
      args: [router.query.auctionId],
    })
  }
  async function handleClaim() {
    console.log('claim');
    claimer.writeAsync({
      contractName: "Auction",
      functionName: "claim",
      args: [router.query.auctionId],
    })
  }


  const isWinner = auction.highestBidder === (account?.address);
  const isSeller = auction.seller === (account?.address);
  const bidEnded = auction.endTime < Date.now() / 1000;
  const claimed = bidEnded && auction.claimed && isWinner;
  const withDrawable = bidEnded && !auction.withdrawn && isSeller;
  const claimable = !claimed && isWinner
  console.log({bidEnded, claimable, claimed, withDrawable, hb:auction.highestBidder,  c: (auction.highestBidder === (account?.address)),  cd : (events?.claimeds[0]?.bidder ),
    ac: (auction?.claimed),
    withDrawable});
  const auctionStarted = auction.startTime <= Date.now() / 1000;
  const timeDifference = Time.getTimeDifference(auctionStarted ? auction.endTime : auction.startTime)
  return (
    auction&&
    <Grid mx={'auto'} pt={5} container alignItems="flex-start" maxWidth={'600px'}>
      <Box sx={{
        width: 1,
        height: '300px',
        borderRadius: '10px',
        border: '1px solid grey',
        backgroundImage: `url(${auction.imageUrl})` || '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      >
        {!auction.imageUrl && (
          <InsertPhotoIcon sx={{ fontSize: 30, color: 'grey.500' }} />
        )}
      </Box>
      <Stack direction={"row"} justifyContent={'space-between'} alignItems="flex-start">

        <Grid width={0.5} pt={2}>

          <Typography variant="h4" fontWeight={'bold'} >{auction.name}</Typography>
          <Typography variant="caption" color={'text.disabled'} > Created on {Time.formatDate(auction.timestamp || auction.startTime)}</Typography>
          <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > Created By</Typography>
          <Tooltip title={auction.seller}>

          <Typography fontWeight={'bold'} >{`${auction.seller?.slice(0, 6)}...${auction.seller?.slice(-6)}`}</Typography>
          </Tooltip>
          <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > Start Time</Typography>
          <Typography  >{Time.formatDate(auction.startTime)}</Typography>
          <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > End Time</Typography>
          <Typography  >{Time.formatDate(auction.endTime)}</Typography>
          <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > Description</Typography>
          <Typography  >{auction.description}</Typography>
          <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > External Link</Typography>
          <Typography  >{auction.externalLink}</Typography>
        </Grid>

        <Grid bgcolor={'#f2f2f2'} ml={2} mt={2} p={3} borderRadius={3}>
          <Typography variant="caption"  >Auction {auctionStarted ? 'ends' : 'starts' } in:</Typography>
          <Stack direction='row'>
            <Stack whiteSpace="pre">
              <Typography variant="h4" fontWeight={'bold'} >{timeDifference.days } : </Typography>
              <Typography variant="caption" color={'text.disabled'} >Days</Typography>
            </Stack>
            <Stack whiteSpace="pre">
              <Typography variant="h4" fontWeight={'bold'} >{timeDifference.hours} : </Typography>
              <Typography variant="caption" color={'text.disabled'} >Hours</Typography>
            </Stack>
            <Stack whiteSpace="pre">
              <Typography variant="h4" fontWeight={'bold'} >{timeDifference.minutes }</Typography>
              <Typography variant="caption" color={'text.disabled'} >Minutes</Typography>
            </Stack>
          </Stack>
          {auctionStarted &&<>
          <Typography mt={2} display={'block'} variant="caption" >Highest Bid</Typography>
          <Typography variant="h5" display={'inline'} fontWeight={'bold'} >{(auction.highestBid * 10 ** -6).toFixed(2)}</Typography>
          <Typography variant="h5" display={'inline'} color={'text.secondary'} > {stablecoins.find(coin=> coin.address === auction.stablecoin)?.name}</Typography>
          <Stack >
            {isWinner && <>
              <Typography sx={{ bgcolor: 'black', p: 2, borderRadius: 2, fontWeight: 'bold', color: 'lightGreen' }} display={"block"} mt={2} mb={1} variant="caption" width={160}  >
                Congratulations! You won the Auction!
              </Typography>
              {!claimed ? <><Typography display={"block"} mt={2} mb={1} variant="caption" width={180}  >
                You can claim your item now:</Typography>

                <Button onClick={handleClaim} sx={{ mb: 2 }} variant="contained">Claim</Button>
              </> : <Typography display={"block"} mt={2} mb={1} variant="caption" width={180}  >
                You have claimed this item.
              </Typography>

              }</>
            }
            {isSeller && (!auction.withdrawn? <>
              <Typography display={"block"} mt={2} mb={1} variant="caption" width={160}  >
                Bidding has ended. You can Withdraw now:
              </Typography>

              <Button onClick={handleWithdraw} variant="contained">Withdraw</Button> 
              </>
              :<Typography display={"block"} mt={2} mb={1} variant="caption" width={160}  >
                You have withdrawn.
              </Typography>)


            }
            { !isWinner && <><Typography display={"block"} mt={2} variant="caption" width={160}  >
                Winner:</Typography>
                <Typography>

                  <a href={`https://polygonscan.com/address/${auction.highestBidder}`} target="_blank" rel="noopener noreferrer">
                    {`${auction.highestBidder?.slice(0, 6)}...${auction.highestBidder?.slice(-3)}`}
                  </a>
                </Typography>
              </>
             } 
             { (!bidEnded && auctionStarted) && <>
                  <TextField value={bid} onChange={(e) => setBid(e.target.value)} label='Bid Amount' sx={{ mt: 3, mb: 2 }} placeholder="Enter Bid Amount" />
                  <Button onClick={handleBid} variant="contained">Place Bid</Button>
                </>}
            
          </Stack></>}

        </Grid>
      </Stack>
      <Typography width={1} variant="h6" mt={6} mb={2} fontWeight={'bold'} >Bid History</Typography>
      {
      auction.highestBid? 
      events?.bidPlaceds.map(
        (bidEvent, index) => 
        <EventListing key={bidEvent.auctionId} bidEvent={bidEvent} first={index === 0} />
      ): <Typography>No Bids Yet</Typography>
      }

    </Grid>
  );
};

export default AuctionDetails;