import React from 'react'
import Slide from "../components/Hero"
import Navbar from '../components/Navbar'
import DualImageSection from '../components/DualImageSection'
import FeaturedProducts from '../components/FeaturedProducts'
import Category from '../components/Category'
import FooterFlex from '../components/FooterFlex'

const page = () => {
  return (
    <div>
         <Navbar />
       <div className=" flex items-center justify-center">
         <Slide />
       </div>
         <DualImageSection />
         <FeaturedProducts />
         <Category />
         <FooterFlex />   
    </div>
  )
}

export default page