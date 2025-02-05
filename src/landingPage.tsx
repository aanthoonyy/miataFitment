import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Footer } from "./assets/footer";
import { Header } from "./header";
import BuyMeACoffee from "./assets/buymecoffee";

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

  const handleGoMarketplace = () => {
    navigate("/marketplace");
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

      <MainImageAndSimulator
        isMobile={isMobile}
        generation={generation}
        handleGenerationChange={handleGenerationChange}
        handleGo={handleGo}
      />

      <GallerySection
        galleryItems={galleryItems}
        handleSeeMoreGallery={handleSeeMoreGallery}
      />

      <Marketplace handleGoMarketplace={handleGoMarketplace} />
      <BuyMeACoffee link="https://www.buymeacoffee.com/miatafitment" />
      <Footer />
    </Box>
  );
};

export default LandingPage;

// Main Image Component
const MainImage: React.FC = () => (
  <img
    src="/websiteExample1.png"
    alt="MIATA FITMENT"
    style={{
      maxWidth: "100%",
      height: "auto",
      borderRadius: "8px",
    }}
  />
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
);

// Combined Main Image and Fitment Simulator Component
interface MainImageAndSimulatorProps {
  isMobile: boolean;
  generation: string;
  handleGenerationChange: (event: SelectChangeEvent) => void;
  handleGo: () => void;
}

const MainImageAndSimulator: React.FC<MainImageAndSimulatorProps> = ({
  isMobile,
  generation,
  handleGenerationChange,
  handleGo,
}) => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <FitmentSimulator
          isMobile={isMobile}
          generation={generation}
          handleGenerationChange={handleGenerationChange}
          handleGo={handleGo}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MainImage />
      </Grid>
    </Grid>
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
      See more cars in our gallery!
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
      Gallery
    </Button>
  </Box>
);

// Marketplace Component
interface MarketplaceSectionProps {
  handleGoMarketplace: () => void;
}

const Marketplace: React.FC<MarketplaceSectionProps> = ({
  handleGoMarketplace,
}) => (
  <Container maxWidth="lg" sx={{ mt: 8 }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ textAlign: "center" }}>
          <img
            src="/Wheels.png"
            alt="Marketplace"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Marketplace
          </Typography>
          <Typography variant="h6" gutterBottom>
            Discover the best deals on Miata parts and accessories. Browse
            through a variety of wheels, suspension components, and more to
            perfect your build. Coming soon!
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled
              onClick={handleGoMarketplace}
              sx={{
                width: "200px",
                height: "56px",
              }}
            >
              Marketplace
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Container>
);
