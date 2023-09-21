import React, { useRef, useState } from "react";
import { Box, Button, Input, MenuItem, Select, Stack, TextField, TextareaAutosize, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Time from "../../../utils/time";
import EventListing from "../../../components/dauctions/eventListing";

const stablecoins = [
    { name: 'USDC', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
    { name: 'USDT', address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' },
    { name: 'DAI', address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' },
  ];

const auction = {
    dateCreated: Time.formatDate(1634198400),
    name: 'Honda Civic',
    auctioneer: {name: 'Ghana Ports', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'},
    startTime: Time.formatDate(1634298400),
    endTime: Time.formatDate(1634298400),
    highestBid: 5000,
    highestBidBidder: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    externalLink: 'https://www.google.com',
    decription:     "Lorem ipsum bibendum. Sed vel nisl vel velit bibendum bibendum. Sed vel nisl vel velit bibendum bibendum.",
    imageUrl: 'https://th.bing.com/th/id/OIP.b8TMej-xNjY_4Y_Hz-ETJQHaE8?pid=ImgDet&rs=1',
    currency: stablecoins[0],
    };

function AuctionDetails() {
  const [bid, setBid] = useState(auction.highestBid + 1);

  function handleBid() {
    if (bid <= parseInt(auction.highestBid)) {
      throw new Error('Bid must be higher than highest bid');
    }
    console.log(bid);
  }
  function handleWithdraw() {
    console.log('withdraw');
  }
  function handleClaim() {
    console.log('claim');
  }

  const claimable = false;
  const claimed = false
  const withDrawable = false;
  const bidEnded = false;
  return (
    <Grid   mx={'auto'} pt={5} container alignItems="flex-start" maxWidth={'600px'}>
        <Box     sx={{
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
      <Typography variant="caption" color={'text.disabled'} > Created on {auction.startTime}</Typography>
      <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > Created By</Typography>
      <Typography fontWeight={'bold'} >{auction.auctioneer.name || auction.auctioneer.address}</Typography>
      <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > Start Time</Typography>
      <Typography  >{auction.startTime}</Typography>
      <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > End Time</Typography>
      <Typography  >{auction.endTime}</Typography>
      <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > Description</Typography>
      <Typography  >{auction.decription}</Typography>
      <Typography variant="caption" display='block' mt={2} color={'text.disabled'} > External Link</Typography>
      <Typography  >{auction.externalLink}</Typography>
      </Grid>

      <Grid  bgcolor={'#f2f2f2'} ml={2} mt={2} p={3} borderRadius={3}>
        <Typography variant="caption"  >Auction ends in:</Typography>
        <Stack direction = 'row'>
        <Stack whiteSpace="pre">
        <Typography variant="h4" fontWeight={'bold'} >{Time.getTimeDifference(1695893123).days} : </Typography>
        <Typography variant="caption" color={'text.disabled'} >Days</Typography>
        </Stack>
        <Stack whiteSpace="pre">
        <Typography variant="h4" fontWeight={'bold'} >{Time.getTimeDifference(1695893123).hours} : </Typography>
        <Typography variant="caption" color={'text.disabled'} >Hours</Typography>
        </Stack>
        <Stack whiteSpace="pre">
        <Typography variant="h4" fontWeight={'bold'} >{Time.getTimeDifference(1695893123).minutes}</Typography>
        <Typography variant="caption" color={'text.disabled'} >Minutes</Typography>
        </Stack>
        </Stack>

        <Typography mt={2} display={'block'} variant="caption" >Highest Bid</Typography>
        <Typography variant="h5" display={'inline'} fontWeight={'bold'} >{auction.highestBid}</Typography>
        <Typography variant="h5" display={'inline'} color={'text.secondary'} > {auction.currency.name}</Typography>
        <Stack >
        {claimable&&<>
      <Typography sx={{bgcolor: 'black', p: 2, borderRadius: 2, fontWeight:'bold', color:'lightGreen' }} display={"block"} mt={2} mb={1} variant="caption"   width = {160}  >
        Congratulations! You won the Auction! 
      </Typography>
      {!claimed ?<><Typography display={"block"} mt={2} mb={1} variant="caption"  width = {180}  > 
      You can claim your item now:</Typography>

        <Button onClick={handleClaim} sx={{mb:2}} variant="contained">Claim</Button>
        </> : <Typography display={"block"} mt={2} mb={1} variant="caption"  width = {180}  >
        You have claimed this item.
        </Typography>
        
        }</>
      }
        {withDrawable&&<>
      <Typography display={"block"} mt={2} mb={1} variant="caption"  width = {160}  >
        Bidding has ended. You can Withdraw your bid now:
      </Typography>

        <Button onClick = {handleWithdraw} variant="contained">Withdraw</Button> </>
        
        
        }
        {
          bidEnded ? !claimable &&<><Typography display={"block"} mt={2}variant="caption"  width = {160}  >
          Winner:</Typography>
          <Typography>
            
          <a href={`https://polygonscan.com/address/${auction.highestBidBidder}`} target="_blank" rel="noopener noreferrer">
    {`${auction.highestBidBidder.slice(0, 6)}...${auction.highestBidBidder.slice(-3)}`}
  </a>
          </Typography>
          </>
          :<>
          <TextField value={bid} onChange = {(e)=>setBid(e.target.value)} label='Bid Amount' sx={{mt:3, mb:2}}  placeholder="Enter Bid Amount"  />
          <Button onClick = {handleBid} variant="contained">Place Bid</Button>
          </>
        }
        </Stack>

      </Grid>
      </Stack>
      <Typography width={1} variant="h6" mt={6} mb={2} fontWeight={'bold'} >Bid History</Typography>
      <EventListing/>
      
    </Grid>
  );
};

export default AuctionDetails;