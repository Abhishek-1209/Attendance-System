import logo from "./logo.svg";
import "./App.css";
import WebcamCapture from "./Webcam";
import Studentlist from "./Studentlist";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App">
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          theme="light"
          pauseOnHover={false}
          draggable={false}
        />
      <Header/>
      <WebcamCapture />
      <Studentlist />
    </div>
  );
}

export default App;
