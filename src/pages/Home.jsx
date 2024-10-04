import Footer from "../components/footer";
import Header from "../components/header";
import Services from "../components/services";
import Hero from "../components/hero";
import Pricing from "../components/pricing";
import Testimonials from "../components/testimonial";
import AboutUs from "../components/about";

const Home = () => {
  return (
    <div>
      <Header />
      <section id="home">
        <Hero />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="about">
        <AboutUs />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <Footer />
    </div>
  );
};

export default Home;
