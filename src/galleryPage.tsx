import React, { useEffect, useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Footer } from "./assets/footer";
import { Header } from "./header";

const client = generateClient<Schema>();

const GalleryPage: React.FC = () => {
  const [carData, setCarData] = useState<Schema["CarData"]["type"][]>([]);
  // const sampleImages = [
  //   {
  //     content:
  //       "A track-prepped NA Miata with lightweight wheels and suspension upgrades.",
  //     idnumber: "1",
  //     src: [
  //       "/landingpagegallery/miata1.png",
  //       "/landingpagegallery/miata2.png",
  //       "/landingpagegallery/miata3.png",
  //     ],
  //     diameter: "15",
  //     diameter2: "15",
  //     width: "7",
  //     width2: "7",
  //     tirewidth: "195",
  //     tirewidth2: "195",
  //     tireSidewall: "50",
  //     tireSidewall2: "50",
  //     offset: "+0",
  //     offset2: "+0",
  //     style: "track",
  //     model: "NA Miata",
  //     chassis: "NA",
  //     description:
  //       "A track-prepped NA Miata with lightweight wheels and suspension upgrades.",
  //   },
  // ];

  const fetchCarData = async () => {
    const { data: items } = await client.models.CarData.list();
    console.log("carData", items);
    setCarData(items);
  };

  useEffect(() => {
    fetchCarData();
  }, []);

  const [wheelDiameter, setWheelDiameter] = useState<number[]>([]);
  const [wheelWidth, setWheelWidth] = useState<number[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [chassis, setChassis] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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

  const filteredImages = carData.filter((img: any) => {
    const diameterMatch =
      wheelDiameter.length === 0 ||
      wheelDiameter.includes(Number(img.diameter));
    const widthMatch =
      wheelWidth.length === 0 || wheelWidth.includes(Number(img.width));
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
    setCurrentImageIndex(0);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleImageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setCurrentImageIndex(value - 1);
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F9F9F9",
      }}
    >
      <Header />

      <Container maxWidth="lg">
        <Typography paddingTop="3" variant="h3" align="center" gutterBottom>
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
            {["Track", "Stance", "Street"].map((s) => (
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
          {paginatedImages.map((img: any) => (
            <Grid item xs={12} sm={6} md={4} key={img.numberid}>
              <Card
                sx={{ position: "relative", cursor: "pointer" }}
                onClick={() => handleOpenDialog(img)}
              >
                <CardMedia
                  component="img"
                  image={img.src[0]}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={selectedCar?.src?.[currentImageIndex] || ""}
                alt={selectedCar?.model}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <Pagination
                count={selectedCar?.src?.length || 0}
                page={currentImageIndex + 1}
                onChange={handleImageChange}
                siblingCount={0}
                size="small"
                sx={{ mt: 2 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography>
                <strong>Wheel Size:</strong> {selectedCar?.diameter}x
                {selectedCar?.width}
                {selectedCar?.width2 &&
                  ` | ${selectedCar?.diameter2}x${selectedCar?.width2}`}
              </Typography>
              <Typography>
                <strong>Tire:</strong> {selectedCar?.tirewidth}/
                {selectedCar?.tireSidewall}
                {selectedCar?.tireSidewall2 &&
                  ` | ${selectedCar?.tirewidth2}/${selectedCar?.tireSidewall2}`}
              </Typography>
              <Typography>
                <strong>Offset:</strong> {selectedCar?.offset}
                {selectedCar?.offset2 && ` | ${selectedCar?.offset2}`}
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
