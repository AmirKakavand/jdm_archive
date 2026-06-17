"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  DeviceOrientationControls,
} from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import CarModel from "./CarModel";

// 1. Custom component to handle the smooth jump and handoff to the gyro
function CameraController({ targetPos, targetLook, mode, setMode }) {
  const { camera } = useThree();
  // A ref to smoothly interpolate where the camera is currently looking
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (mode === "jumping") {
      // Glide the camera to the new position
      easing.damp3(camera.position, targetPos, 0.4, delta);

      // Glide the camera's rotation to look at the car
      easing.damp3(currentLookAt.current, targetLook, 0.4, delta);
      camera.lookAt(currentLookAt.current);

      // Calculate distance to target. If we are basically there, switch to gyroscope!
      if (camera.position.distanceTo(targetPos) < 0.1) {
        setMode("looking");
      }
    }
  });

  // Once the jump is finished, yield control to the device sensors
  return mode === "looking" ? <DeviceOrientationControls /> : null;
}

export default function GarageScene() {
  const [started, setStarted] = useState(false);
  const [cameraMode, setCameraMode] = useState("idle"); // 'idle', 'jumping', or 'looking'
  const [camPos, setCamPos] = useState(new THREE.Vector3(5, 2, 5));
  const [camTarget, setCamTarget] = useState(new THREE.Vector3(0, 0, 0));

  // 2. Handle iOS Gyroscope Permissions
  const requestAccess = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setStarted(true);
        } else {
          alert("Gyroscope access is required to look around.");
        }
      } catch (error) {
        console.error("Error requesting gyro permission:", error);
      }
    } else {
      // Android and non-iOS devices usually grant access automatically
      setStarted(true);
    }
  };

  // 3. Trigger the camera jump
  const jumpTo = (newPos, newLook) => {
    setCamPos(new THREE.Vector3(...newPos));
    setCamTarget(new THREE.Vector3(...newLook));
    setCameraMode("jumping");
  };

  return (
    <div className="w-full h-full relative font-sans">
      {/* The Permission Overlay */}
      {!started && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <button
            onClick={requestAccess}
            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            Enter 3D Garage
          </button>
        </div>
      )}

      <Canvas camera={{ position: [5, 2, 5], fov: 50 }}>
        {/* Existing Background and Lighting */}
        <color attach="background" args={["#242424"]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />

        <CarModel />

        {/* Mount our custom camera engine once started */}
        {started && (
          <CameraController
            targetPos={camPos}
            targetLook={camTarget}
            mode={cameraMode}
            setMode={setCameraMode}
          />
        )}

        {/* Let the user manually drag the camera before they click a hotspot */}
        {cameraMode === "idle" && started && <OrbitControls makeDefault />}

        {/* The Interactive Hotspots */}
        {started && (
          <>
            {/* Front Left Hotspot */}
            <Html position={[3, 1, 3]} center>
              <button
                // args: [jump to position], [look at position]
                onClick={() => jumpTo([4, 1.5, 4], [0, 0.5, 0])}
                className="w-12 h-12 bg-white/20 text-white rounded-full border-2 border-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all cursor-pointer"
              >
                FL
              </button>
            </Html>

            {/* Rear Right Hotspot */}
            <Html position={[-3, 1, -3]} center>
              <button
                onClick={() => jumpTo([-4, 1.5, -4], [0, 0.5, 0])}
                className="w-12 h-12 bg-white/20 text-white rounded-full border-2 border-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all cursor-pointer"
              >
                RR
              </button>
            </Html>
          </>
        )}
      </Canvas>

      {/* Helpful UI hint when in Gyro mode */}
      {started && cameraMode === "looking" && (
        <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none text-white/70 animate-pulse text-sm tracking-widest uppercase">
          Move your phone to look
        </div>
      )}
    </div>
  );
}
