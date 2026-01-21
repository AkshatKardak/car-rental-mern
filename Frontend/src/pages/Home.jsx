import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Banner from "../components/home/Banner";
import Inventory from "../components/home/Inventory";
import Footer from "../components/layout/Footer";
import CarVideo from "../components/home/CarVideo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
      <Navbar />
      <Hero />
      <CarVideo />
      <Inventory />
      <Banner />
      <Footer />
    </div>
  );
};

