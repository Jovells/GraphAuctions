import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";








/**
 * Site header
*/
export const Header = () => {

  return (
    <>
        <AppBar position="static" sx={{color: "black", backgroundColor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Dauctions</Typography>

        <Button variant="contained" color="primary" sx={{ borderRadius: 50 }}>
          Connect Metamask
        </Button>
        <ConnectButton/>
      </Toolbar>
    </AppBar>
    
    
    </>
  );
};
