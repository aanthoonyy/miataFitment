import { Box, Typography } from "@mui/material";

export const Footer: React.FC = () => (
  <Box
    sx={{
      backgroundColor: "#1976D2",
      color: "white",
      py: 3,
      mt: 4,
      textAlign: "center",
    }}
  >
    <Typography variant="h6" gutterBottom>
      Miata Fitment
    </Typography>
    <Typography variant="body2">
      &copy; {new Date().getFullYear()} Miata Fitment. All Rights Reserved.
    </Typography>
    <Typography variant="body2">
      Designed with 💙 for Miata enthusiasts.
    </Typography>
  </Box>
);
