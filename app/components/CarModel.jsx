"use client";

import { useGLTF } from "@react-three/drei";

export default function CarModel() {
  // useGLTF automatically fetches from the public folder.
  const { scene } = useGLTF("/car.glb");

  return (
    // 'primitive' is a special R3F component that renders raw Three.js objects
    <primitive object={scene} />
  );
}

// Preloading ensures the model starts downloading immediately, preventing pop-in
useGLTF.preload("/car.glb");
