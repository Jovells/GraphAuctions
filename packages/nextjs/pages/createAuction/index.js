import React, { useRef, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Input, MenuItem, Select, TextField, TextareaAutosize, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useScaffoldContractWrite } from "../../hooks/scaffold-eth/useScaffoldContractWrite";
import { useScaffoldContract } from "../../hooks/scaffold-eth/useScaffoldContract";
import { useRouter } from 'next/router';
import { getTxnEventData, Time  } from "../../utils/auctions";
import storeNFT from "../../utils/auctions/ipfs"
import { stablecoins } from "../../utils/auctions";
import toast from "react-hot-toast";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";



const CreateAuction = () => {
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const account = useAccount();
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
    if (!account.isConnected) {
      openConnectModal();
      return;
    }
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    data.startingPrice = parseFloat(data.startingPrice * 10 ** 6);
    data.startTime = Time.getTimestampInSeconds(data.startTime);
    data.endTime = Time.getTimestampInSeconds(data.endTime);
    data.preventSniping = data.preventSniping === 'on' ? true : false;
    let tokenURI = "ipfs://bafyreiecwvlht6ibr75mwymyeqr6rdpssielikblwi46tb4nhkjdbpedha/metadata.json";
    if (process.env.NODE_ENV === "production"){
    // if (true){
      toast.promise(
        storeNFT(image, data),
        {
          loading: 'Uploading Auction Data to IPFS',
          success: (d) => {tokenURI = d.url; return `Successfully Uploaded to ${d.url}`},
          error: (err) => `This just happened: ${err.toString()}`,
        },
        {
          style: {
            minWidth: '250px',
          },
          success: {
            duration: 5000,
            icon: '🔥',
          },
        }
      );

    }

    const mintAndStore =     auction.writeAsync({ args: [data.currency, data.startTime, data.endTime, data.startingPrice, tokenURI, data.preventSniping], 
      onBlockConfirmation: (txnReceipt) => {
      const auctionData = getTxnEventData(txnReceipt, 'AuctionCreated', auction.data.abi);
      console.log('a', auctionData);
      auctionData && router.push(`/auctionDetails/${auctionData.auctionId}`);
      }
      }) 

    toast.promise(
      mintAndStore,
      {
        loading: 'Minting Nft and Creating Transaction',
        success: () => { return `Transaction Successful. Waiting for Block confirmation`},
        error: (err) => `This just happened: ${err.toString()}`,
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 5000,
          icon: '🔥',
        },
      }
    );


  }

  const handleFileChange = (event) => {
    event.target.files[0]&& setFile(event.target.files[0]);
  };

  const handleDeleteImage = () => {
    setFile(null);
  };

  return (
    <Grid direction={'column'} component={'form'} onSubmit={handlemint}  mt={5} container maxWidth={'772px'}>
      <Typography variant="h3" mb={3} >Create Auction</Typography>
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
        {!image && (<>
          <InsertPhotoIcon sx={{ fontSize: 30, color: 'grey.500' }} />
          <Typography variant="h6" sx={{ color: 'grey.500' }}>Select Image</Typography>
        </>
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
      <TextField name="startTime" defaultValue={Date.now} InputLabelProps={{ shrink: true }} type="dateTime-local" sx={{ mb: 2, }} label='Start Time' placeholder="Select A time" fullWidth />
      <TextField name="endTime" InputLabelProps={{ shrink: true }} type="dateTime-local" sx={{ mb: 2, }} label='End Time' placeholder="Select A time" fullWidth />
      <TextField name="currency" defaultValue={''} select label="Currency" sx={{ mb: 2, }} fullWidth>
        {stablecoins.map((coin) => (
          <MenuItem key={coin.address} value={coin.address}>
            {coin.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField name="startingPrice" label='Starting Price' sx={{ mb: 2, }} placeholder="Enter Starting Price" fullWidth />
      <Tooltip placement="top-start" title="Enable the option to increase auction end time by 10 minutes if a bid is placed within last 10 minutes to prevent last-minute bidding to overtake the last bidder">

      <FormControlLabel name="preventSniping" control={<Checkbox defaultChecked />} label="Prevent Snipping" />
      </Tooltip>
      <Button sx={{mt:1}} type="submit" variant="contained">{account?.isConnected? 'Create': 'Connect wallet'}</Button>

    </Grid>
  );
};

export default CreateAuction;