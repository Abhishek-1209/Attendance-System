import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import css from "./webcam.css";

const WebcamCapture = () => {
  const webcamRef = useRef(null);

  return (
    <div className="webcam">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        className="rounded-xl shadow-md"
      />
    </div>
  );
};

export default WebcamCapture;
