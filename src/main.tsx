import ReactDOM from "react-dom";
import MainComponent from "./mainComponent";
import { Route, Router, Routes } from "react-router";
import LandingPage from "./landingPage";
import GalleryPage from "./galleryPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="visualizer-na" element={<MainComponent />} />
      <Route path="gallery" element={<GalleryPage />} />
    </Routes>
  );
};

export default App;
