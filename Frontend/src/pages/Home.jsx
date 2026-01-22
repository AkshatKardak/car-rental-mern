import Hero from "../components/home/Hero";
import Banner from "../components/home/Banner";
import Inventory from "../components/home/Inventory";
import CarVideo from "../components/home/CarVideo";
import Aboutx from "./Aboutx";

export default function Home() {
  return (
    <>
      <Hero />
      <Aboutx />
      <CarVideo />
      <Inventory />
      <Banner />
    </>
  );
};

