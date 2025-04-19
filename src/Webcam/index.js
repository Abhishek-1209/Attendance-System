import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { getCurrentTimeSlot } from "../utils/attendanceSlot";
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
  const [toastShown, setToastShown] = useState(new Set());

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
        console.log("✅ Models loaded");
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models", err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const loadLabeledDescriptors = async () => {
      const snapshot = await getDocs(collection(db, "Students"));
      const labeledDescriptors = [];

      for (const docSnap of snapshot.docs) {
        const student = docSnap.data();
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
          } catch (err) {
            console.error(`Error processing image ${url}`, err);
          }
        }

        if (descriptors.length) {
          labeledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(student.Name, descriptors)
          );
        }
      }

      if (labeledDescriptors.length) {
        setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.5));
        console.log("✅ Face matcher initialized");
      }
    };

    if (modelsLoaded) loadLabeledDescriptors();
  }, [modelsLoaded]);

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
            console.log("✅ Match:", bestMatch.label);
            markAttendance(bestMatch.label);
          } else {
            console.log("❌ Face not recognized");
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [modelsLoaded, faceMatcher]);

  const markAttendance = async (name) => {
    const q = query(collection(db, "Students"), where("Name", "==", name));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const studentDoc = snapshot.docs[0];
      const studentRef = doc(db, "Students", studentDoc.id);

      const today = new Date().toISOString().split("T")[0];
      const timeNow = new Date().toLocaleTimeString();
      const slot = getCurrentTimeSlot();
      const toastKey = `${name}-${today}-${slot}`;

      if (!slot) {
        console.warn("⏳ Not in any valid slot.");
        return;
      }

      const studentData = studentDoc.data();
      const attendance = studentData.attendance || [];

      const alreadyMarked = attendance.some(
        (entry) => entry.date === today && entry.slot === slot
      );

      if (!alreadyMarked) {
        const newEntry = { date: today, time: timeNow, slot };
        await updateDoc(studentRef, {
          attendance: [...attendance, newEntry],
        });
        console.log(`✅ ${name} marked present for ${slot}`);

        if (!toastShown.has(toastKey)) {
          toast.success(`${name} marked present for ${slot}`);
          setToastShown((prev) => new Set(prev).add(toastKey));
        }
      } else {
        console.log(`🟡 ${name} already marked for ${slot}`);
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
