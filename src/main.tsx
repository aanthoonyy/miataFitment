import ReactDOM from "react-dom";
import MainComponent from "./mainComponent";
import { Route, Router, Routes } from "react-router";
import LandingPage from "./landingPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="visualizer-na" element={<MainComponent />} />
    </Routes>
  );
};

export default App;
