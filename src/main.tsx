import ReactDOM from "react-dom";
import MainComponent from "./mainComponent";
// import NavBar from "./navBar";

const App = () => {
  return (
    <div>
      {/* <NavBar /> */}
      <MainComponent />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
