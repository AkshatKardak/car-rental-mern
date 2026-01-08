import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Banner from "../components/home/Banner";
import Inventory from "../components/home/Inventory";
import Footer from "../components/layout/Footer";
import CarVideo from "../components/home/CarVideo";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <CarVideo />
      <Inventory />
      <Banner />
      <Footer />
    </>
  );
};

export default Home;
