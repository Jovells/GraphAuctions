import React from "react";
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

function getInitials(str) {
    const nameWords = str.split(' ');
    const nameInitials = nameWords.length === 1 ? nameWords[0].slice(0, 2) 
    : nameWords[0].charAt(0) 
    + nameWords[nameWords.length - 1].charAt(0);
    return nameInitials.toUpperCase();
  }



const AuctionListing = ({ first = true, auction = {name: 'Honda Civic', auctioneer: 'Ghana Ports', timeLeft: '2 days, 5 hours, 52 Seconds', highestBid: '5000 usdt', imageUrl:'' } }) => {
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

    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/dauctions/auctionDetails/${auction.id}`}>
    <Grid py={2} px={4} t   borderRadius={2}  component={ListItemButton} container alignItems={'center'}   width={1} >

    <Stack width={0.3}   direction={'row'} alignItems={'center'} >
    <ListItemAvatar>
    <Avatar sx={{ bgcolor: 'black'}}>
        {auction.imageUrl 
        ? <img src={auction.imageUrl} alt="auction image" /> 
        : getInitials(auction.auctioneer)}
    </Avatar></ListItemAvatar>

    <Typography>{auction.name}</Typography>
        </Stack>
  
    <Typography width={0.25}>{auction.auctioneer}</Typography>

    <Typography width={0.25}>{auction.timeLeft}</Typography>
    <Box marginLeft="auto">
    <Typography >{auction.highestBid}</Typography>
    </Box>
    </Grid>
    </Link>
   
 
   </>
  );
};

export default AuctionListing;
