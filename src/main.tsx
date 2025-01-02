import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import MainComponent from "./mainComponent";
import { Route, Routes } from "react-router";
import LandingPage from "./landingPage";
import GalleryPage from "./galleryPage";
import MarketplacePage from "./marketPage";

import TodoList from "./todo";

Amplify.configure(outputs);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="visualizer-na" element={<MainComponent />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="marketplace" element={<MarketplacePage />} />
      <Route path="todo" element={<TodoList />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
