import { AppBar, Button, Divider, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Site header
*/
export const Header = () => {

  return (
    <>
        
      <Stack py={2} mx={'auto'}  maxWidth={'lg'} direction={'row'} justifyContent = "space-between" >
        <Typography variant="h6">Dauctions</Typography>
        <ConnectButton/>
      </Stack>
        <Divider/>
    </>
    
   
  );
};
