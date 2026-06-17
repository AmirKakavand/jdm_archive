"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  DeviceOrientationControls,
  Environment,
  Grid,
  useProgress,
  ContactShadows,
} from "@react-three/drei";
import { useState, useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { easing } from "maath";
import CarModel from "./CarModel";

function CanvasLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center font-mono text-red-500 bg-black/80 p-6 rounded border-2 border-red-900 backdrop-blur-md">
        <div className="text-xl md:text-2xl mb-4 font-bold italic animate-pulse">
          /// LOADING_ASSETS
        </div>
        <div className="w-48 md:w-64 h-4 border-2 border-red-900 p-0.5">
          {/* REMOVED 'transition-all duration-300' so the bar perfectly matches the text value */}
          <div
            className="h-full bg-red-600"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

function CameraController({ targetPos, targetLook, mode, setMode, isMobile }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (mode === "jumping") {
      easing.damp3(camera.position, targetPos, 0.4, delta);
      easing.damp3(currentLookAt.current, targetLook, 0.4, delta);
      camera.lookAt(currentLookAt.current);

      if (camera.position.distanceTo(targetPos) < 0.1) {
        setMode(isMobile ? "looking" : "idle");
      }
    }
  });

  return mode === "looking" ? <DeviceOrientationControls /> : null;
}

export default function GarageScene({ car, onBack }) {
  const [started, setStarted] = useState(false);
  const [cameraMode, setCameraMode] = useState("idle");
  const [camPos, setCamPos] = useState(new THREE.Vector3(6, 2.5, 6));
  const [camTarget, setCamTarget] = useState(new THREE.Vector3(0, 0.5, 0));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const requestAccess = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        setStarted(permission === "granted" || permission === "denied");
      } catch (error) {
        setStarted(true);
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

  const Hotspot = ({ pos, target, label }) => (
    <Html position={pos} center>
      <button
        onClick={() => jumpTo(target, [0, 0.5, 0])}
        className="w-10 h-10 md:w-12 md:h-12 bg-red-600/80 text-white rounded-none border-2 border-red-400 flex items-center justify-center hover:bg-white hover:text-red-600 hover:scale-110 transition-all font-mono font-bold text-xs shadow-[0_0_15px_rgba(255,0,0,0.5)]"
      >
        {label}
      </button>
    </Html>
  );

  return (
    <div className="w-full h-full relative font-mono bg-[#242424]">
      {/* Top Bar UI */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto bg-black text-white border-2 border-neutral-700 px-4 py-2 text-sm hover:bg-white hover:text-black transition-colors"
        >
          &lt; BACK TO MENU
        </button>
        <div className="text-red-500 font-bold tracking-widest bg-black/50 px-4 py-1 backdrop-blur-sm border border-red-900/50">
          {car.name}
        </div>
      </div>

      {!started && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <button
            onClick={requestAccess}
            className="px-8 py-4 bg-transparent border-4 border-red-600 text-red-500 font-bold text-xl hover:bg-red-600 hover:text-white transition-all uppercase italic tracking-wider"
          >
            INITIALIZE SCENE
          </button>
        </div>
      )}

      <Canvas camera={{ position: [6, 2.5, 6], fov: 45 }}>
        {/* Restored to the lighter, blurred city background */}
        <Environment preset="city" background blur={0.8} />

        {/* Restored the cleaner, lighter grid */}
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

        {/* Clean studio lighting setup */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />

        {/* Keeping the high-quality drop shadow so the car feels heavy */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.75}
          scale={10}
          blur={2}
          far={4}
          color="#000000"
        />

        <Suspense fallback={<CanvasLoader />}>
          <CarModel filename={car.model} />
        </Suspense>

        {started && (
          <CameraController
            targetPos={camPos}
            targetLook={camTarget}
            mode={cameraMode}
            setMode={setCameraMode}
            isMobile={isMobile}
          />
        )}

        {cameraMode === "idle" && started && (
          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={3}
            maxDistance={12}
          />
        )}

        {started && (
          <>
            <Hotspot pos={[3.5, 1, 3.5]} target={[4.5, 1.5, 4.5]} label="F-L" />
            <Hotspot
              pos={[3.5, 1, -3.5]}
              target={[4.5, 1.5, -4.5]}
              label="F-R"
            />
            <Hotspot
              pos={[-3.5, 1, -3.5]}
              target={[-4.5, 1.5, -4.5]}
              label="R-R"
            />
            <Hotspot
              pos={[-3.5, 1, 3.5]}
              target={[-4.5, 1.5, 4.5]}
              label="R-L"
            />
          </>
        )}
      </Canvas>

      {started && cameraMode === "looking" && isMobile && (
        <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none text-white/90 font-bold animate-pulse text-sm tracking-widest uppercase drop-shadow-md">
          Look up and around to find the car
        </div>
      )}
    </div>
  );
}
