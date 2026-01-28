import Hero from "../components/home/Hero";
import Banner from "../components/home/Banner";
import Inventory from "../components/home/Inventory";
import CarVideo from "../components/home/CarVideo";
import Aboutx from "./Aboutx";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen">
        <Hero />
      </section>
      
      {/* Video/Experience Section */}
      <section id="video" className="min-h-screen">
        <CarVideo />
      </section>
      
      {/* Cars/Inventory Section */}
      <section id="inventory" className="min-h-screen">
        <Inventory />
      </section>
      
      {/* About Us Section */}
      <section id="about" className="min-h-screen">
        <Aboutx />
      </section>
      
      {/* Contact/Banner Section */}
      <section id="contact" className="min-h-screen">
        <Banner />
      </section>
    </div>
  );
}
