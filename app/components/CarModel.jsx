"use client";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function CarModel({ filename }) {
  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/jdm_archive" : "";
  const fullPath = `${basePath}/${filename}`;

  const { scene } = useGLTF(fullPath);

  useEffect(() => {
    if (!scene) return;

    // --- 1. RESET TRANSFORMATIONS ---
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    // --- 2. CLEANUP & MATERIAL FIXES ---
    const meshesToRemove = [];

    scene.traverse((child) => {
      if (child.isMesh) {
        const meshName = child.name.toLowerCase();

        // Target 1: Delete unwanted geometry
        if (
          meshName.includes("plane") ||
          meshName.includes("ground") ||
          meshName.includes("shadow") ||
          meshName.includes("grid") ||
          meshName.includes("base") ||
          meshName.includes("underlighting")
        ) {
          meshesToRemove.push(child);
        }

        // Target 2: Fix Glossy Interiors
        if (child.material) {
          const matName = child.material.name
            ? child.material.name.toLowerCase()
            : "";

          // If the mesh or material sounds like a cabin part, make it matte
          if (
            meshName.includes("interior") ||
            meshName.includes("dash") ||
            meshName.includes("plastic") ||
            meshName.includes("steering") ||
            matName.includes("interior") ||
            matName.includes("dash") ||
            matName.includes("plastic") ||
            matName.includes("leather") ||
            matName.includes("fabric") ||
            matName.includes("rubber")
          ) {
            // We clone the material first so we don't accidentally affect shared materials on the exterior
            child.material = child.material.clone();

            // Crank up the roughness (matte finish) and kill the metalness/reflections
            child.material.roughness = 0.9;
            child.material.metalness = 0.0;
            child.material.envMapIntensity = 0.1; // Drastically reduces environment reflections
          }
        }
      }
    });

    // Remove the bad geometry
    meshesToRemove.forEach((mesh) => mesh.parent.remove(mesh));

    // --- 3. NORMALIZE SIZE ---
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const targetSize = 4.5;
    const scale = targetSize / maxDim;
    scene.scale.set(scale, scale, scale);

    // --- 4. FIX PIVOT POINTS ---
    const scaledBox = new THREE.Box3().setFromObject(scene);
    const center = scaledBox.getCenter(new THREE.Vector3());

    scene.position.x = -center.x;
    scene.position.z = -center.z;
    scene.position.y = -scaledBox.min.y;
  }, [scene, filename]);

  return <primitive object={scene} />;
}
