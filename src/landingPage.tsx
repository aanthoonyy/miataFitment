import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [generation, setGeneration] = useState<string>("na");

  const handleGenerationChange = (event: SelectChangeEvent) => {
    setGeneration(event.target.value as string);
  };

  const handleGo = () => {
    if (generation === "na") {
      navigate("/visualizer-na");
    }
  };

  const handleSeeMoreGallery = () => {
    navigate("/gallery");
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  const galleryItems = isMobile ? [1] : [1, 2, 3, 4, 5, 6];

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Header />

      <MainImage />

      <FitmentSimulator
        isMobile={isMobile}
        generation={generation}
        handleGenerationChange={handleGenerationChange}
        handleGo={handleGo}
      />

      <GallerySection
        galleryItems={galleryItems}
        handleSeeMoreGallery={handleSeeMoreGallery}
      />

      <Footer />
    </Box>
  );
};

export default LandingPage;

// Header Component
export const Header: React.FC = () => (
  <Box
    sx={{
      py: 2,
      backgroundColor: "#1976D2",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    }}
  >
    <Box>
      <img
        src="/faviconNoBG.png"
        alt="Miata Fitment Logo"
        style={{
          height: "70px",
          width: "auto",
        }}
      />
    </Box>
    <Typography variant="h3" component="h1" sx={{ margin: 0 }}>
      MIATA FITMENT
    </Typography>
  </Box>
);

// Main Image Component
const MainImage: React.FC = () => (
  <Box
    sx={{
      backgroundColor: "#D3D3D3",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: 4,
      mx: "calc(-50vw + 50%)",
    }}
  >
    <img
      src="/websiteExample1.png"
      alt="MIATA FITMENT"
      style={{
        maxWidth: "100%",
        height: "auto",
        borderRadius: "0px",
      }}
    />
  </Box>
);

// Fitment Simulator Component
interface FitmentSimulatorProps {
  isMobile: boolean;
  generation: string;
  handleGenerationChange: (event: SelectChangeEvent) => void;
  handleGo: () => void;
}

const FitmentSimulator: React.FC<FitmentSimulatorProps> = ({
  isMobile,
  generation,
  handleGenerationChange,
  handleGo,
}) => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Box>
      <Typography variant="h3" gutterBottom>
        Fitment Simulator
      </Typography>
      <Typography variant="h6" gutterBottom>
        Dial in your Miata's fitment with our simulator. Select your Miata's
        generation and start customizing wheels, suspension, and more.
      </Typography>
      {isMobile && (
        <Typography variant="h6" gutterBottom sx={{ color: "red", mt: 2 }}>
          Mobile use is not recommended at the moment. Use a desktop or laptop.
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          alignItems: "center",
          mt: 2,
        }}
      >
        <Select
          value={generation}
          onChange={handleGenerationChange}
          variant="outlined"
          sx={{
            width: "150px",
            height: "56px",
          }}
        >
          <MenuItem value="na">NA</MenuItem>
          <MenuItem value="nb" disabled>
            NB
          </MenuItem>
          <MenuItem value="nc" disabled>
            NC
          </MenuItem>
          <MenuItem value="nd" disabled>
            ND
          </MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGo}
          sx={{
            width: "150px",
            height: "56px",
          }}
        >
          Go
        </Button>
      </Box>
    </Box>
  </Container>
);

// Gallery Section Component
interface GallerySectionProps {
  galleryItems: number[];
  handleSeeMoreGallery: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  handleSeeMoreGallery,
}) => (
  <Box sx={{ py: 5, backgroundColor: "#FFFFFF", mt: 4 }}>
    <Typography variant="h3" gutterBottom>
      Gallery
    </Typography>
    <Typography variant="h6" gutterBottom>
      Gather inspiration from our curated gallery of Miata builds. From track
      monsters to show cars, we've got it all.
    </Typography>
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={3}>
        {galleryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <img
              src={`/landingpagegallery/miata${item}.png`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
    <Typography variant="h6" gutterBottom sx={{ color: "black", mt: 2 }}>
      Coming soon! Check out my current progress
    </Typography>
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleSeeMoreGallery}
      sx={{
        width: "150px",
        height: "56px",
      }}
    >
      See More
    </Button>
  </Box>
);

// Footer Component
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
