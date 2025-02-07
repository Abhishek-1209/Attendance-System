import logo from "./logo.svg";
import "./App.css";
import WebcamCapture from "./Webcam";
import Studentlist from "./Studentlist";

function App() {
  return (
    <div className="App">
      <WebcamCapture />
      <Studentlist />
    </div>
  );
}

export default App;
