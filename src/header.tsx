import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export const Header: React.FC = () => (
  <Box
    sx={{
      py: 0,
      backgroundColor: "#1976D2",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box>
      <Link to="/" style={{ textDecoration: "none" }}>
        <img
          src="/faviconNoBG.png"
          alt="Miata Fitment Logo"
          style={{
            height: "100px",
            width: "auto",
            cursor: "pointer",
          }}
        />
      </Link>
    </Box>
  </Box>
);
