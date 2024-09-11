import { Link } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/header"
import Services from "../components/services"
import Hero from "../components/hero"
import Pricing from "../components/pricing"
import Testimonials from "../components/testimonial"
const Home = () => {
  return (
    <div>
      <Header />
      <Hero/>
      <Services />
      <Pricing/>
      <Testimonials/> 
      <Footer />
    </div>
  )
}

export default Home
