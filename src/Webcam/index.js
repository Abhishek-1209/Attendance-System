import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Studentlist from "../Studentlist";

const WebcamCapture = () => {
  const webcamRef = useRef(null);

  // Function to capture an image from the webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc); // This is the captured image in Base64 format
  }, [webcamRef]);

  return (
    <div className="flex flex-row justify-between items-center space-y-4">
        <div> 
      <Webcam
        audio={false} 
        ref={webcamRef}
        screenshotFormat="image/jpeg" 
        width={350} 
        className="rounded-xl shadow-md"
        />
        </div>
        <div className="'text-black-500 !important ">
                <Studentlist />
        </div>
      
      {/* <button
        onClick={capture}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Capture Photo
      </button> */}
    </div>
  );
};

export default WebcamCapture;
