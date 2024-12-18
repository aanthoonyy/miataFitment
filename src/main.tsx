import MainComponent from "./mainComponent";
import { Route, Routes } from "react-router";
import LandingPage from "./landingPage";
import GalleryPage from "./galleryPage";
import MarketplacePage from "./marketPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="visualizer-na" element={<MainComponent />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="marketplace" element={<MarketplacePage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
