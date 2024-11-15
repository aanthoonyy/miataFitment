import ReactDOM from "react-dom";
import MainComponent from "./mainComponent";
import { Route, Router, Routes } from "react-router";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainComponent />} />
    </Routes>
  );
};

export default App;
