import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Select,
  MenuItem,
  OutlinedInput,
  Pagination,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Footer, Header } from "./landingPage";

// Updated sample data: gallery images with chassis metadata
const sampleImages = [
  {
    id: 1,
    src: "/landingpagegallery/miata1.png",
    diameter: 15,
    width: 7,
    tirewidth: 195,
    tireSidewall: 50,
    offset: "+0",
    style: "track",
    model: "NA Miata",
    chassis: "NA",
    description:
      "A track-prepped NA Miata with lightweight wheels and suspension upgrades.",
  },
  {
    id: 2,
    src: "/landingpagegallery/miata2.png",
    diameter: 17,
    width: 8,
    tirewidth: 205,
    tireSidewall: 45,
    offset: "+10",
    style: "stance",
    model: "NB Miata",
    chassis: "NB",
    description:
      "A stance-style NB Miata with aggressive fitment and lowered suspension.",
  },
  {
    id: 3,
    src: "/landingpagegallery/miata3.png",
    diameter: 16,
    width: 9,
    tirewidth: 215,
    tireSidewall: 40,
    offset: "+5",
    style: "street",
    model: "NC Miata",
    chassis: "NC",
    description:
      "An NC Miata built for street use with performance wheels and tires.",
  },
  {
    id: 4,
    src: "/landingpagegallery/miata4.png",
    diameter: 18,
    width: 10,
    tirewidth: 225,
    tireSidewall: 35,
    offset: "+15",
    style: "track",
    model: "ND Miata",
    chassis: "ND",
    description:
      "A track-focused ND Miata with wide wheels and aerodynamic upgrades.\ntest\ntest\n test",
  },
  {
    id: 5,
    src: "/landingpagegallery/miata1.png",
    diameter: 15,
    width: 7,
    tirewidth: 195,
    tireSidewall: 50,
    offset: "+0",
    style: "track",
    model: "NA Miata",
    chassis: "NA",
    description:
      "A track-prepped NA Miata with lightweight wheels and suspension upgrades.",
  },
  {
    id: 6,
    src: "/landingpagegallery/miata2.png",
    diameter: 17,
    width: 8,
    tirewidth: 205,
    tireSidewall: 45,
    offset: "+10",
    style: "stance",
    model: "NB Miata",
    chassis: "NB",
    description:
      "A stance-style NB Miata with aggressive fitment and lowered suspension.",
  },
  {
    id: 7,
    src: "/landingpagegallery/miata3.png",
    diameter: 16,
    width: 9,
    tirewidth: 215,
    tireSidewall: 40,
    offset: "+5",
    style: "street",
    model: "NC Miata",
    chassis: "NC",
    description:
      "An NC Miata built for street use with performance wheels and tires.",
  },
  {
    id: 8,
    src: "/landingpagegallery/miata4.png",
    diameter: 18,
    width: 10,
    tirewidth: 225,
    tireSidewall: 35,
    offset: "+15",
    style: "track",
    model: "ND Miata",
    chassis: "ND",
    description:
      "A track-focused ND Miata with wide wheels and aerodynamic upgrades.\ntest\ntest\n test",
  },
  {
    id: 9,
    src: "/landingpagegallery/miata1.png",
    diameter: 15,
    width: 7,
    tirewidth: 195,
    tireSidewall: 50,
    offset: "+0",
    style: "track",
    model: "NA Miata",
    chassis: "NA",
    description:
      "A track-prepped NA Miata with lightweight wheels and suspension upgrades.",
  },
  {
    id: 10,
    src: "/landingpagegallery/miata2.png",
    diameter: 17,
    width: 8,
    tirewidth: 205,
    tireSidewall: 45,
    offset: "+10",
    style: "stance",
    model: "NB Miata",
    chassis: "NB",
    description:
      "A stance-style NB Miata with aggressive fitment and lowered suspension.",
  },
  {
    id: 11,
    src: "/landingpagegallery/miata3.png",
    diameter: 16,
    width: 9,
    tirewidth: 215,
    tireSidewall: 40,
    offset: "+5",
    style: "street",
    model: "NC Miata",
    chassis: "NC",
    description:
      "An NC Miata built for street use with performance wheels and tires.",
  },
  {
    id: 12,
    src: "/landingpagegallery/miata4.png",
    diameter: 18,
    width: 10,
    tirewidth: 225,
    tireSidewall: 35,
    offset: "+15",
    style: "track",
    model: "ND Miata",
    chassis: "ND",
    description:
      "A track-focused ND Miata with wide wheels and aerodynamic upgrades.\ntest\ntest\n test",
  },
];

const GalleryPage: React.FC = () => {
  const [wheelDiameter, setWheelDiameter] = useState<number[]>([]);
  const [wheelWidth, setWheelWidth] = useState<number[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [chassis, setChassis] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 9;

  const handleDiameterChange = (event: any) =>
    setWheelDiameter(event.target.value);
  const handleWidthChange = (event: any) => setWheelWidth(event.target.value);
  const handleStyleChange = (event: any) => setStyle(event.target.value);
  const handleChassisChange = (event: any) => setChassis(event.target.value);
  const handleClearFilters = () => {
    setWheelDiameter([]);
    setWheelWidth([]);
    setStyle([]);
    setChassis([]);
    setCurrentPage(1);
  };

  const filteredImages = sampleImages.filter((img) => {
    const diameterMatch =
      wheelDiameter.length === 0 || wheelDiameter.includes(img.diameter);
    const widthMatch =
      wheelWidth.length === 0 || wheelWidth.includes(img.width);
    const styleMatch = style.length === 0 || style.includes(img.style);
    const chassisMatch = chassis.length === 0 || chassis.includes(img.chassis);
    return diameterMatch && widthMatch && styleMatch && chassisMatch;
  });

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (car: any) => {
    setSelectedCar(car);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <Box sx={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2 }}>
          Gallery
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Select
            multiple
            value={wheelDiameter}
            onChange={handleDiameterChange}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0 ? "Wheel Diameter" : selected.join(", ")
            }
            sx={{ minWidth: 200 }}
          >
            {[13, 14, 15, 16, 17, 18].map((diameter) => (
              <MenuItem key={diameter} value={diameter}>
                {diameter}"
              </MenuItem>
            ))}
          </Select>

          <Select
            multiple
            value={wheelWidth}
            onChange={handleWidthChange}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0 ? "Wheel Width" : selected.join(", ")
            }
            sx={{ minWidth: 200 }}
          >
            {[5, 6, 7, 8, 9, 10, 11, 12].map((width) => (
              <MenuItem key={width} value={width}>
                {width}"
              </MenuItem>
            ))}
          </Select>

          <Select
            multiple
            value={style}
            onChange={handleStyleChange}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0 ? "Style" : selected.join(", ")
            }
            sx={{ minWidth: 200 }}
          >
            {["track", "stance", "street"].map((s) => (
              <MenuItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </Select>

          <Select
            multiple
            value={chassis}
            onChange={handleChassisChange}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0 ? "Chassis" : selected.join(", ")
            }
            sx={{ minWidth: 200 }}
          >
            {["NA", "NB", "NC", "ND"].map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>

          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        <Grid container spacing={3}>
          {paginatedImages.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card
                sx={{ position: "relative", cursor: "pointer" }}
                onClick={() => handleOpenDialog(img)}
              >
                <CardMedia
                  component="img"
                  image={img.src}
                  alt={img.model}
                  sx={{ height: 200 }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    textAlign: "center",
                    py: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {`${img.model} | ${img.diameter}x${img.width} ${img.offset} | ${img.tirewidth}/${img.tireSidewall} | ${img.style}`}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
          />
        </Box>
      </Container>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedCar?.model}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <img
                src={selectedCar?.src}
                alt={selectedCar?.model}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography>
                <strong>Wheel Size:</strong> {selectedCar?.diameter}x
                {selectedCar?.width}
              </Typography>
              <Typography>
                <strong>Tire:</strong> {selectedCar?.tirewidth}/
                {selectedCar?.tireSidewall}
              </Typography>
              <Typography>
                <strong>Offset:</strong> {selectedCar?.offset}
              </Typography>
              <Typography>
                <strong>Style:</strong> {selectedCar?.style}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedCar?.description}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Footer />
    </Box>
  );
};

export default GalleryPage;
