import React, { useRef, useState } from "react";
import { Box, Button, Input, MenuItem, Select, TextField, TextareaAutosize, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const stablecoins = [
    { name: 'USDC', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
    { name: 'USDT', address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' },
    { name: 'DAI', address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' },
  ];

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);


  function handlemint(event) {}

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
        <Box     sx={{
          width: '100%',
          height: '300px',
            borderRadius: '10px',
            border: '1px solid grey',
          backgroundImage: file ? `url(${URL.createObjectURL(file)})` : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick = {() => fileInputRef.current.click()}
      >
               {!file && (
          <InsertPhotoIcon sx={{ fontSize: 30, color: 'grey.500' }} />
        )}
      </Box>
      <input    type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}  
        />
        <TextField label='Name of Asset' sx={{mt:3, mb:2}}  placeholder="Enter Name" fullWidth />
        <TextField label = 'Description' sx={{mb:2, }} placeholder="Provide a detailed description of your item"></TextField>
        <TextField label = 'External Link' sx={{mb:2, }} placeholder="A link to this URL will be included on this item's detail page, for users to learn more about it"></TextField>
        <TextField InputLabelProps={{ shrink: true }}  type="dateTime-local" sx={{mb:2, }} label='Start Time'  placeholder="Select A time" fullWidth />
        <TextField InputLabelProps={{ shrink: true }}  type="dateTime-local" sx={{mb:2, }} label='End Time' placeholder="Select A time" fullWidth />
        <TextField select label="Currency" sx={{mb:2, }} fullWidth>
        {stablecoins.map((coin) => (
          <MenuItem key={coin.address} value={coin.address}>
            {coin.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField label='Starting Price' sx={{mb:2, }}  placeholder="Enter Starting Price" fullWidth />
      <Button variant="contained">Create</Button>
        
    </Grid>
  );
};

export default ImageUploader;