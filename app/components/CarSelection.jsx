"use client";
import { useState } from "react";

// You will replace the empty strings with the paths to your actual images later
const JDM_CARS = [
  {
    id: "supra",
    name: "TOYOTA SUPRA MK4",
    model: "supra.glb",
    bgImg: "/images/supra_bg.png",
    thumbImg: "/images/supra_thumb.jpg",
  },
  {
    id: "r34",
    name: "NISSAN SKYLINE R34",
    model: "r34.glb",
    bgImg: "/images/r34_bg.png",
    thumbImg: "/images/r34_thumb.jpg",
  },
  {
    id: "nsx",
    name: "HONDA NSX TYPE-R",
    model: "nsx.glb",
    bgImg: "/images/nsx_bg.png",
    thumbImg: "/images/nsx_thumb.jpg",
  },
  {
    id: "rx7",
    name: "MAZDA RX-7 FD",
    model: "rx7.glb",
    bgImg: "/images/rx7_bg.png",
    thumbImg: "/images/rx7_thumb.jpg",
  },
];

export default function CarSelection({ onSelectCar }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCar = JDM_CARS[activeIndex];

  return (
    <div className="relative w-full h-full bg-black text-white font-mono overflow-hidden">
      {/* Background Image Layer (Active Car) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700"
        style={{
          backgroundImage: `url(${activeCar.bgImg})`,
          backgroundColor: "#111",
        }}
      >
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        {/* Header */}
        <div className="text-4xl md:text-6xl font-black italic tracking-tighter text-red-600 drop-shadow-[2px_2px_0px_#fff]">
          SELECT
          <br />
          YOUR RIDE
        </div>

        {/* Car Details */}
        <div className="flex-grow flex items-center">
          <div className="bg-black/60 border-l-4 border-red-600 p-6 backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              {activeCar.name}
            </h2>
            <div className="text-red-500 tracking-widest text-sm mb-6 animate-pulse">
              /// STATUS: READY FOR GARAGE
            </div>
            <button
              onClick={() => onSelectCar(activeCar)}
              className="bg-white text-black px-8 py-3 font-bold italic text-xl hover:bg-red-600 hover:text-white transition-colors uppercase border-b-4 border-black hover:border-red-800"
            >
              Enter Garage &gt;&gt;
            </button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 w-max">
            {JDM_CARS.map((car, index) => (
              <div
                key={car.id}
                onClick={() => setActiveIndex(index)}
                className={`w-48 h-32 cursor-pointer border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-end p-2
                  ${index === activeIndex ? "border-red-600 scale-105" : "border-neutral-800 opacity-50 hover:opacity-100"}`}
                style={{
                  backgroundImage: `url(${car.thumbImg})`,
                  backgroundColor: "#222",
                  backgroundSize: "cover",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <span className="relative z-10 text-xs font-bold truncate">
                  {car.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
