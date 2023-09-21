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
import Time from "../../utils/time";

const EventListing = ({ first = true, bidEvent = {tx: '0x678c1866b15bbb9066bacef86f26d4baee66ff830114089fff894309c48cd600', bidder: 'Ghana Ports', time: Time.formatDate(1695893123), amount: '5000 usdt'} }) => {
  return (
   <>
   {first && <Grid py={2} px={4} bgcolor={'white'} borderRadius={2} border={'1px solid grey'} container alignItems={'center'}   width={1} >

    
    <Typography width={0.3}>Transaction Id</Typography>
        
  
    <Typography width={0.25}>Bidder</Typography>

    <Typography width={0.25}>Time of Bid</Typography>
    <Box marginLeft="auto">

    <Typography >Amount</Typography>
    </Box>
    </Grid> }

   
    <Grid py={2} px={4}   borderRadius={2}  component={ListItemButton} container alignItems={'center'}   width={1} >

    <Stack width={0.3}    >
    <Typography>  <a href={`https://polygonscan.com/tx/${bidEvent.tx}`} target="_blank" rel="noopener noreferrer">
    {`${bidEvent.tx.slice(0, 6)}...${bidEvent.tx.slice(-3)}`}
  </a></Typography>
        </Stack>
  
    <Typography width={0.25}> <a href={`https://polygonscan.com/tx/${bidEvent.bidder}`} target="_blank" rel="noopener noreferrer">
    {`${bidEvent.tx.slice(0, 6)}...${bidEvent.tx.slice(-3)}`}</a></Typography>

    <Typography width={0.25}>{bidEvent.time}</Typography>
    <Box marginLeft="auto">
    <Typography >{bidEvent.amount}</Typography>
    </Box>
    </Grid>
   
 
   </>
  );
};

export default EventListing;
