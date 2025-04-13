import logo from "./logo.svg";
import "./App.css";
import WebcamCapture from "./Webcam";
import Studentlist from "./Studentlist";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header/>
      <WebcamCapture />
      <Studentlist />
      <Footer/>
    </div>
  );
}

export default App;
