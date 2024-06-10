import ReactDOM from "react-dom";
import MainComponent from "./mainComponent";

const App = () => {
  return (
    <div>
      <MainComponent />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
