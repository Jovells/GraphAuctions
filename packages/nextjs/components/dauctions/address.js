import { Tooltip, Button, Box, Typography, Chip } from "@mui/material";

export default function Address({address, otherProps, TypographyProps}) {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
      <Tooltip sx={otherProps} title={address}>
    <Chip label={        <Typography
          {...TypographyProps}
          component="a"
          href={`https://mumbai.polygonscan.com/search?f=0&q=${address}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          {`${address.slice(0, 6)}...${address.slice(-3)}`}
        </Typography>} >

      <Button onClick={() => copyToClipboard(address)} >Copy</Button>
    </Chip>
      </Tooltip>
  );
}