"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Skeletons
const HeroSkeleton = () => (
  <div className="w-full h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
    <span className="text-gray-400">Loading hero...</span>
  </div>
);

const DualImageSkeleton = () => (
  <div className="w-full h-[300px] flex gap-4">
    <div className="flex-1 bg-gray-200 animate-pulse" />
    <div className="flex-1 bg-gray-200 animate-pulse" />
  </div>
);

const FeaturedProductsSkeleton = () => (
  <div className="w-full h-[400px] grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-gray-200 animate-pulse h-48 w-full rounded" />
    ))}
  </div>
);

const CategorySkeleton = () => (
  <div className="w-full h-[300px] grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-gray-200 animate-pulse h-32 w-full rounded" />
    ))}
  </div>
);

const FooterSkeleton = () => (
  <div className="w-full h-[200px] bg-gray-200 animate-pulse flex items-center justify-center">
    <span className="text-gray-400">Loading footer...</span>
  </div>
);

// Dynamic imports with skeletons
const Slide = dynamic(() => import("../components/Hero"), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

const DualImageSection = dynamic(() => import("../components/DualImageSection"), {
  ssr: false,
  loading: () => <DualImageSkeleton />,
});

const FeaturedProducts = dynamic(() => import("../components/FeaturedProducts"), {
  ssr: false,
  loading: () => <FeaturedProductsSkeleton />,
});

const Category = dynamic(() => import("../components/Category"), {
  ssr: false,
  loading: () => <CategorySkeleton />,
});

const FooterFlex = dynamic(() => import("../components/FooterFlex"), {
  ssr: false,
  loading: () => <FooterSkeleton />,
});

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center">
        <Slide />
      </div>
      <DualImageSection />
      <FeaturedProducts />
      <Category />
      <FooterFlex />
       <Footer />
     
    </div>
  );
};

export default Page;
