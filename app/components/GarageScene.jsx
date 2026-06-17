"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  DeviceOrientationControls,
  Environment,
  Grid,
} from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import CarModel from "./CarModel";

function CameraController({ targetPos, targetLook, mode, setMode }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (mode === "jumping") {
      easing.damp3(camera.position, targetPos, 0.4, delta);
      easing.damp3(currentLookAt.current, targetLook, 0.4, delta);
      camera.lookAt(currentLookAt.current);

      if (camera.position.distanceTo(targetPos) < 0.1) {
        setMode("looking");
      }
    }
  });

  return mode === "looking" ? <DeviceOrientationControls /> : null;
}

export default function GarageScene() {
  const [started, setStarted] = useState(false);
  const [cameraMode, setCameraMode] = useState("idle");
  const [camPos, setCamPos] = useState(new THREE.Vector3(5, 2, 5));
  const [camTarget, setCamTarget] = useState(new THREE.Vector3(0, 0, 0));

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
      setStarted(true);
    }
  };

  const jumpTo = (newPos, newLook) => {
    setCamPos(new THREE.Vector3(...newPos));
    setCamTarget(new THREE.Vector3(...newLook));
    setCameraMode("jumping");
  };

  return (
    <div className="w-full h-full relative font-sans">
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
        {/* REPLACED SOLID COLOR WITH A 3D ENVIRONMENT */}
        {/* 'preset' gives us realistic lighting and reflections, 'background' renders it, 'blur' makes it look like depth-of-field */}
        <Environment preset="city" background blur={0.8} />

        {/* ADDED A FLOOR GRID FOR SPATIAL AWARENESS */}
        <Grid
          position={[0, -0.01, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={1}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#9d4b4b"
          fadeDistance={25}
        />

        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />

        <CarModel />

        {started && (
          <CameraController
            targetPos={camPos}
            targetLook={camTarget}
            mode={cameraMode}
            setMode={setCameraMode}
          />
        )}

        {cameraMode === "idle" && started && <OrbitControls makeDefault />}

        {started && (
          <>
            <Html position={[3, 1, 3]} center>
              <button
                onClick={() => jumpTo([4, 1.5, 4], [0, 0.5, 0])}
                className="w-12 h-12 bg-white/20 text-white rounded-full border-2 border-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all cursor-pointer shadow-lg"
              >
                FL
              </button>
            </Html>

            <Html position={[-3, 1, -3]} center>
              <button
                onClick={() => jumpTo([-4, 1.5, -4], [0, 0.5, 0])}
                className="w-12 h-12 bg-white/20 text-white rounded-full border-2 border-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all cursor-pointer shadow-lg"
              >
                RR
              </button>
            </Html>
          </>
        )}
      </Canvas>

      {started && cameraMode === "looking" && (
        <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none text-white/90 font-bold animate-pulse text-sm tracking-widest uppercase drop-shadow-md">
          Look up and around to find the car
        </div>
      )}
    </div>
  );
}
