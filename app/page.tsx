import GarageScene from "./components/GarageScene";

export default function Home() {
  return (
    // Forces the main view to take up the entire screen without scrolling
    <main className="w-screen h-screen overflow-hidden bg-neutral-900">
      <GarageScene />
    </main>
  );
}
