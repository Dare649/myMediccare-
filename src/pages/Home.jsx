import { Link } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/header"
import Services from "../components/services"
import Hero from "../components/hero"
import Pricing from "../components/pricing"
import Testimonials from "../components/testimonial"
import AboutUs from "../components/about"
const Home = () => {
  return (
    <div>
      <Header />
      <Hero/>
      <Services />
      <AboutUs/>
      <Pricing/>
      <Testimonials/> 
  </div>
  )
}

export default Home
