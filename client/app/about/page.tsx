"use client";

import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


const boxes = [
  {
    title: "10.5k+",
    description: "Happy Customers",
    image: "/categories/ser2.png",
    alt: "Happy Customers",
  },
  {
    title: "33k",
    description: "Products Sold",
     image: "/categories/Services.png",
    alt: "Products Sold",
  },
  {
    title: "44k+",
    description: "Customer Active",
     image: "/categories/ser1.png",
    alt: "Customer Active",
  },
  {
    title: "25k",
    description: "Gadgets Available",
     image: "/categories/ser2.png",
    alt: "Gadgets",
  },
];

const team = [
  {
    title: "Shittu Odunayo",
    description: "Co-Founder & CEO",
    image: "/odunayo.jpg",
    alt: "Happy Customers",
  },
  {
    title: "Olawale Olatunji",
    description: "Co-Founder & COO",
     image: "/coo.jpg",
    alt: "Products Sold",
  },
  {
    title: "Aderoju Olaide ",
    description: "Product Manager/Designer",
    image: "/pmm.jpg",
    alt: "Customer Active",
  },
    {
    title: "Adedoyinsola Olabisi",
    description: "Operations Manager",
    image: "/pm.jpg",
    alt: "Customer Active",
  },
  
];
export default function About() {
  return (
    <div className={playfair.className}>
      <section className="flex flex-col md:flex-row w-full h-auto md:h-[500px]">
      
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 ">
          <div className="max-w-md">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">Our Story</h1>
             <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Launched in 2023, <span className="text-[#008080] italic font-serif">GadUp</span> is your ultimate online destination for
              the latest and greatest in electronics and accessories. We are
              passionate about bringing you cutting-edge technology, from sleek
              smartphones and powerful laptops to innovative gadgets and must-have
              accessories.
              <br />
              <br />
              At <span className="text-[#008080] italic font-serif">GadUp</span>, we believe in quality, affordability, and exceptional
              customer service. Our curated selection of products is designed to
              meet the needs of tech enthusiasts and everyday users alike. Whether
              you&apos;re looking to upgrade your devices or find the perfect gift, we&apos;ve
              got you covered.
            </p>
          </div>
        </div>

        <div className="relative w-full h-[300px] md:h-auto md:flex-1">
          <Image
            src="/shoppings.jpg" 
            alt="About"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>
     
      <div className="w-full py-10 px-6 md:px-16 bg-gray-50 ">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 ">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 text-center hover:bg-[#008080] transition cursor-pointer"
          >
            <div className="w-15 h-15 mx-auto mb-3 relative">
              <Image
                src={box.image}
                alt={box.alt}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{box.title}</h3>
            <p className="text-sm text-gray-600">{box.description}</p>
          </div>
        ))}
      </div>
    </div>
       <div className="w-full px-8 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {team.map((team, index) => (
          <div
            key={index}
            className=" p-4 text-center "
          >
            <div className="w-60 h-80 mx-auto mb-3 relative">
              <Image
                src={team.image}
                alt={team.alt}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{team.title}</h3>
            <p className="text-sm text-gray-600">{team.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

