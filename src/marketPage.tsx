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
import { Footer } from "./assets/footer";
import { Header } from "./header";

const marketplaceItems = [
  {
    id: 1,
    src: "/marketplace/wheel1.png",
    category: "Wheels",
    name: "Enkei RPF1",
    price: "$800",
    description: "15x7 lightweight alloy wheels for performance and style.",
  },
  {
    id: 2,
    src: "/marketplace/suspension1.png",
    category: "Suspension",
    name: "Tein Coilovers",
    price: "$1,200",
    description: "Fully adjustable coilover suspension for track use.",
  },
  {
    id: 3,
    src: "/marketplace/accessory1.png",
    category: "Accessories",
    name: "Steering Wheel",
    price: "$300",
    description: "Leather-wrapped steering wheel for improved driving feel.",
  },
  {
    id: 4,
    src: "/marketplace/wheel2.png",
    category: "Wheels",
    name: "Work Meister S1",
    price: "$2,000",
    description: "16x8 aggressive fitment wheels for stance builds.",
  },
  {
    id: 5,
    src: "/marketplace/suspension2.png",
    category: "Suspension",
    name: "Bilstein B14",
    price: "$1,500",
    description: "High-performance suspension for daily driving and track use.",
  },
  {
    id: 6,
    src: "/marketplace/accessory2.png",
    category: "Accessories",
    name: "Shift Knob",
    price: "$50",
    description: "Weighted shift knob for smoother gear shifts.",
  },
];

const MarketplacePage: React.FC = () => {
  const [category, setCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 6;

  const handleCategoryChange = (event: any) => setCategory(event.target.value);
  const handleClearFilters = () => setCategory("All");

  const filteredItems =
    category === "All"
      ? marketplaceItems
      : marketplaceItems.filter((item) => item.category === category);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);

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
      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2 }}>
            Marketplace
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <Select
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              input={<OutlinedInput />}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              <MenuItem value="Wheels">Wheels</MenuItem>
              <MenuItem value="Suspension">Suspension</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
            </Select>

            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>

          <Grid container spacing={3}>
            {paginatedItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{ cursor: "pointer", textAlign: "center" }}
                  onClick={() => handleOpenDialog(item)}
                >
                  <CardMedia
                    component="img"
                    image={item.src}
                    alt={item.name}
                    sx={{ height: 200, borderRadius: "8px 8px 0 0" }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {item.price}
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
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedItem?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={selectedItem?.src}
              alt={selectedItem?.name}
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <Typography variant="body1" gutterBottom>
              {selectedItem?.description}
            </Typography>
            <Typography variant="h6" color="primary">
              {selectedItem?.price}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default MarketplacePage;
