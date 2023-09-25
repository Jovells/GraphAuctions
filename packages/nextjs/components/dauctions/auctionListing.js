import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemButton,
  Stack,
  Box,
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Link from "next/link";
import { Time, convertIpfsUrl, stablecoins } from "../../utils/auctions";
import { useScaffoldContractRead } from "../../hooks/scaffold-eth/useScaffoldContractRead";
import Address from "./address";

function getInitials(str) {
    const nameWords = str.split(' ');
    const nameInitials = nameWords.length === 1 ? nameWords[0].slice(0, 2) 
    : nameWords[0].charAt(0) 
    + nameWords[nameWords.length - 1].charAt(0);
    return nameInitials.toUpperCase();
  }



const AuctionListing = ({ first = true, auction = {name: 'Honda Civic', seller: 'Ghana Ports', timeLeft: '2 days, 5 hours, 52 Seconds', highestBid: '5000 usdt', imageUrl:'' } }) => {
  const [newAuction, setNewAuction] = useState(auction)
  const {data: tokenUriFromContract} = useScaffoldContractRead({
    contractName: "DauctionNft",
    functionName: "tokenURI",
    args: [auction?.tokenId],
  })

  useEffect(()=>{
    //get image and metadata from tokenUri
    async function getMetadata() {
      const res = await fetch(convertIpfsUrl(tokenUriFromContract));
      const data = await res.json();
      const imageUrl = convertIpfsUrl(data.image);
      setNewAuction({...data, ...newAuction, imageUrl});
      console.log(data, newAuction, imageUrl)
      return data
    }

    if (tokenUriFromContract) getMetadata();

  },[auction.auctionid, tokenUriFromContract])

  const timeLeft = Time.getTimeDifferenceString(auction.endTime);
  
  let highestBid = (parseFloat(newAuction.highestBid || newAuction.startPrice) * 10 ** -6).toFixed(2)
  + ' ' 
  + stablecoins.find((coin) => coin.address.toUpperCase() === newAuction.stablecoin.toUpperCase())?.name
  
  console.log('newAuction', newAuction);
  return (
   <>
   {first && <Grid py={2} px={4} bgcolor={'white'} borderRadius={2} border={'1px solid grey'} container alignItems={'center'}   width={1} >

    
    <Typography width={0.3}>Name</Typography>
        
  
    <Typography width={0.25}>Auctioneer</Typography>

    <Typography width={0.25}>Time Left</Typography>
    <Box marginLeft="auto">

    <Typography >Highest Bid</Typography>
    </Box>
    </Grid> }

    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/auctionDetails/${newAuction.auctionId}`}>
    <Grid py={2} px={4} t   borderRadius={2}  component={ListItemButton} container alignItems={'center'}   width={1} >

    <Stack width={0.3}   direction={'row'} alignItems={'center'} >
    <ListItemAvatar>
    <Avatar sx={{ bgcolor: 'black'}}>
        {newAuction.imageUrl 
        ? <img src={newAuction.imageUrl} alt="auction image" /> 
        : getInitials(newAuction.seller)}
    </Avatar></ListItemAvatar>

    <Typography>{newAuction.name}</Typography>
        </Stack>
    <Box width={0.25} >
    <Address address={newAuction.seller}  TypographyProps={{fontWeight: 'bold'}}/>
    </Box>

    <Typography width={0.25}>{timeLeft}</Typography>
    <Box marginLeft="auto">
    <Typography >{highestBid}</Typography>
    </Box>
    </Grid>
    </Link>
   
 
   </>
  );
};

export default AuctionListing;
