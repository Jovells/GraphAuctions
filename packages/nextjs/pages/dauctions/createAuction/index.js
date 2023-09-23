import React, { useRef, useState } from "react";
import { Box, Button, Input, MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import storeNFT from "../../../utils/auctions/ipfs";
import { useScaffoldContractWrite } from "../../../hooks/scaffold-eth/useScaffoldContractWrite";
import { useScaffoldContract } from "../../../hooks/scaffold-eth/useScaffoldContract";
import { CONTRACT_ADDRESS, NFT_ADDRESS } from "../../../utils/constants";
import { useRouter } from 'next/router';
import { getTxnEventData, getTxnEventArg, Time  } from "../../../utils/auctions";
import { stablecoins } from "../../../utils/auctions";



const CreateAuction = () => {
  const router = useRouter();
  const [image, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const auctionContract = useScaffoldContract({
    contractName: "Auction",
  });

  const nftContract = useScaffoldContract({
    contractName: "DauctionNft",
  });

  const nft = useScaffoldContractWrite({
    contractName: "DauctionNft",
    functionName: "mint",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
  });

  const auction = useScaffoldContractWrite({
    contractName: "Auction",
    functionName: "createAuction",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
  });




  auction.data = auctionContract?.data;
  nft.data = nftContract?.data;

  // console.log(auction, nft)

  async function handlemint(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    data.startingPrice = parseFloat(data.startingPrice * 10 ** 6);
    data.startTime = Time.getTimestampInSeconds(data.startTime);
    data.endTime = Time.getTimestampInSeconds(data.endTime);
    // const metadata = await storeNFT(image, data);

    await auction.writeAsync({ args: [data.currency, data.startTime, data.endTime, data.startingPrice, "ipfs://bafyreibpisxby6xsthd2grxvhhixheyab4eger2gqx7a6v7asi6mbezn5m/metadata.json"], 
      onBlockConfirmation: (txnReceipt) => {
      const auctionData = getTxnEventData(txnReceipt, 'AuctionCreated', auction.data.abi);
      console.log('a', auctionData);
      auctionData && router.push(`/dauctions/auctionDetails/${auctionData.auctionId}`);
      }
      })
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDeleteImage = () => {
    setFile(null);
  };

  return (
    <Grid direction={'column'} component={'form'} onSubmit={handlemint} ml={5} mt={5} container maxWidth={'772px'}>
      <Typography variant="h2" >Create Auction</Typography>
      <Typography variant='subtitle1' fontWeight={'bold'}>Image</Typography>
      <Box sx={{
        width: '100%',
        height: '300px',
        borderRadius: '10px',
        border: '1px solid grey',
        backgroundImage: image ? `url(${URL.createObjectURL(image)})` : '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
        onClick={() => fileInputRef.current.click()}
      >
        {!image && (
          <InsertPhotoIcon sx={{ fontSize: 30, color: 'grey.500' }} />
        )}
      </Box>
      <input type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <TextField name="name" label='Name of Asset' sx={{ mt: 3, mb: 2 }} placeholder="Enter Name" fullWidth />
      <TextField name="description" label='Description' sx={{ mb: 2, }} placeholder="Provide a detailed description of your item"></TextField>
      <TextField name="externalLink" label='External Link' sx={{ mb: 2, }} placeholder="A link to this URL will be included on this item's detail page, for users to learn more about it"></TextField>
      <TextField name="startTime" InputLabelProps={{ shrink: true }} type="dateTime-local" sx={{ mb: 2, }} label='Start Time' placeholder="Select A time" fullWidth />
      <TextField name="endTime" InputLabelProps={{ shrink: true }} type="dateTime-local" sx={{ mb: 2, }} label='End Time' placeholder="Select A time" fullWidth />
      <TextField name="currency" defaultValue={''} select label="Currency" sx={{ mb: 2, }} fullWidth>
        {stablecoins.map((coin) => (
          <MenuItem key={coin.address} value={coin.address}>
            {coin.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField name="startingPrice" label='Starting Price' sx={{ mb: 2, }} placeholder="Enter Starting Price" fullWidth />
      <Button type="submit" variant="contained">Create</Button>

    </Grid>
  );
};

export default CreateAuction;