"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CarModel from "./CarModel";

export default function GarageScene() {
  return (
    // The container must have a defined width and height for the Canvas to show up
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [5, 2, 5], fov: 50 }}>
        {/* Sets the solid background color of the 3D scene (Dark Gray) */}
        <color attach="background" args={["#242424"]} />

        {/* Basic lighting setup */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />

        {/* Render the car */}
        <CarModel />

        {/* Temporary controls to let you drag and look around the model */}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
