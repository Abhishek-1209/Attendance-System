import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { toast } from "react-toastify";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);

  // Load face-api.js models from CDN
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            "https://justadudewhohacks.github.io/face-api.js/models"
          ),
          faceapi.nets.faceLandmark68Net.loadFromUri(
            "https://justadudewhohacks.github.io/face-api.js/models"
          ),
          faceapi.nets.faceRecognitionNet.loadFromUri(
            "https://justadudewhohacks.github.io/face-api.js/models"
          ),
        ]);
        console.log("✅ Models loaded from CDN");
        setModelsLoaded(true);
      } catch (error) {
        console.error("❌ Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  // Load student face data
  useEffect(() => {
    const loadFaceData = async () => {
      const snapshot = await getDocs(collection(db, "Students"));
      const labeledDescriptors = [];

      for (const docSnap of snapshot.docs) {
        const student = docSnap.data();

        // Access Images map correctly
        const imageMap = student.Images;
        if (!imageMap) continue;

        const imageUrls = Object.values(imageMap).filter(
          (url) => url.startsWith("http") && url.match(/\.(jpeg|jpg|png)$/)
        );
        const descriptors = [];
        for (const url of imageUrls) {
          try {
            const img = await faceapi.fetchImage(url);
            const detection = await faceapi
              .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (detection) descriptors.push(detection.descriptor);
          } catch (error) {
            console.error(
              `❌ Failed to load/process image for ${student.Name} from URL: ${url}`,
              error
            );
          }
        }

        if (descriptors.length) {
          labeledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(student.Name, descriptors)
          );
        }
      }

      if (labeledDescriptors.length === 0) {
        console.warn("⚠️ No valid face descriptors found.");
        return;
      }

      const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);
      console.log("✅ Face matcher initialized with known faces");
      setFaceMatcher(matcher);
    };

    if (modelsLoaded) loadFaceData();
  }, [modelsLoaded]);

  // Detect and match face from webcam
  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        modelsLoaded &&
        faceMatcher &&
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;

        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

          if (bestMatch.label !== "unknown") {
            toast.success(`Matched with ${bestMatch.label}`);
            markAttendance(bestMatch.label);
          } else {
            console.log("❌ Face not recognized");
          }
        }
      }
    }, 2000); // scan every 2 seconds

    return () => clearInterval(interval);
  }, [modelsLoaded, faceMatcher]);

  // Mark attendance in Firebase
  const markAttendance = async (name) => {
    const q = query(collection(db, "Students"), where("Name", "==", name));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const studentDoc = snapshot.docs[0];
      const studentRef = doc(db, "Students", studentDoc.id);

      const today = new Date().toISOString().split("T")[0];
      const timeNow = new Date().toLocaleTimeString();

      const studentData = studentDoc.data();
      const attendance = studentData.attendance || [];

      const alreadyMarked = attendance.find((a) => a.date === today);

      if (!alreadyMarked) {
        const newRecord = { date: today, time: timeNow };
        await updateDoc(studentRef, {
          attendance: [...attendance, newRecord],
        });

        console.log(`📅 ${name} marked present at ${timeNow}`);
      } else {
        console.log(`✅ ${name} already marked present today`);
      }
    }
  };

  return (
    <div className="webcam">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        className="rounded-xl shadow-md"
      />
      {!modelsLoaded && <p>Loading face recognition models...</p>}
    </div>
  );
};

export default WebcamCapture;
