import { AppBar, Button, Divider, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Site header
*/
export const Header = () => {

  return (
    <>
        
      <Stack p={4} mx={'auto'}  maxWidth={'lg'} direction={'row'} justifyContent = "space-between" >
        <Typography variant="h6">Dauctions</Typography>

        <ConnectButton/>
      </Stack>
        <Divider/>
    </>
    
   
  );
};
