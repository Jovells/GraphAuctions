
import React from "react";
import { Box, Container, Typography, Button, InputBase } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import AuctionListing from "../../components/dauctions/auctionListing";
import SearchIcon from '@mui/icons-material/Search';


const Home = () => {
  return (
    <Box sx={{ backgroundColor: "#f2f2f2" }}>
      {/* <BackgroundImage
        src="https://i.vecteezy.com/vectors/abstract-backdrop-with-monochrome-wave-gradient-lines-on-white-background-modern-technology-background-wave-design-vector-illustration-23426480.jpg"
        alt="Abstract background image"
      /> */}
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid xs={12} sm={6}>
            <Typography variant="h1" sx={{ fontSize: 50, fontWeight: 700 }}>
              Transparent Auctions Powered by Blockchain Technology
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20, fontWeight: 400 }}>
              At Dauctions, we have harnessed the power of cutting-edge blockchain technology to revolutionize the way auctions are conducted.
            </Typography>
            <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 50 }}>
              Learn More
            </Button>
          </Grid>
        </Grid>
        <Grid>
          <Typography variant="h2" sx={{ fontSize: 40, fontWeight: 700 }}>
            Featured Auctions
          </Typography>
          <InputBase
      sx={{
        bgcolor: 'lightgrey',
        borderRadius: 2,
        p: 1,
        width: '100%',
      }}
      placeholder="Search Assets, Auctioneers, Auctions, etc"
      startAdornment={<SearchIcon sx={{mx:1}} color="disabled" />}
    />

          <AuctionListing />
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

