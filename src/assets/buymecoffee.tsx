import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CoffeeIcon from "@mui/icons-material/LocalCafe";

interface BuyMeACoffeeProps {
  link: string;
}

const BuyMeACoffee: React.FC<BuyMeACoffeeProps> = ({ link }) => {
  return (
    <Box sx={{ py: 5, backgroundColor: "#FFFFFF", mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Donations!!!
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        If you've found this project helpful and want to see it grow, please
        consider supporting me by buying me a coffee!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<CoffeeIcon />}
        onClick={() => window.open(link, "_blank")}
        sx={{
          width: "200px",
          height: "56px",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          backgroundColor: "#ffdd00",
          color: "#000",
          "&:hover": {
            backgroundColor: "#ffcc00",
          },
        }}
      >
        Buy Me a Coffee
      </Button>
    </Box>
  );
};

export default BuyMeACoffee;
