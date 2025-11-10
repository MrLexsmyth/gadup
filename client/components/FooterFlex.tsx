"use client";

import Image from "next/image";

export default function ThreeSectionFlex() {
  const sections = [
    {
      id: 1,
      image: "/categories/ser2.png",
      title: "Quality Products",
      text: "Discover premium items made with care and designed to stand out.",
    },
    {
      id: 2,
      image: "/categories/Services.png",
      title: "Fast Delivery",
      text: "Enjoy quick, fast and reliable delivery right to your doorstep always.",
    },
    {
      id: 3,
      image: "/categories/ser1.png",
      title: " 24/7 Customer Support",
      text: "We’re always here to help with any questions or issues you may have.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-8"
    style={{ fontFamily: "Playfair Display, serif" }}>
      {sections.map((section) => (
        <div
          key={section.id}
          className="flex flex-col items-center text-center max-w-sm hover:scale-105 transition-transform duration-300"
        >
          <div className="w-15 h-15 relative mb-4">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-cover rounded-lg "
            />
          </div>
          <h1 className="text-xl font-semibold mb-2">{section.title}</h1>
          <p className="text-gray-600 text-sm">{section.text}</p>
        </div>
      ))}
    </div>
  );
}
