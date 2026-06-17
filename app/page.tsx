"use client";
import { useState } from "react";
import CarSelection from "./components/CarSelection";
import GarageScene from "./components/GarageScene";

export default function Home() {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    // We enforce dark mode and hide scrollbars globally here
    <main className="w-screen h-screen overflow-hidden bg-black text-white select-none">
      {!selectedCar ? (
        <CarSelection onSelectCar={setSelectedCar} />
      ) : (
        <GarageScene car={selectedCar} onBack={() => setSelectedCar(null)} />
      )}
    </main>
  );
}
