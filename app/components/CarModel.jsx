"use client";

import { useGLTF } from "@react-three/drei";
const modelPath = "/jdm_archive/car.glb";

export default function CarModel() {
  const { scene } = useGLTF(modelPath);

  return (
    // 'primitive' is a special R3F component that renders raw Three.js objects
    <primitive object={scene} />
  );
}

// Preloading ensures the model starts downloading immediately, preventing pop-in
useGLTF.preload(modelPath);
