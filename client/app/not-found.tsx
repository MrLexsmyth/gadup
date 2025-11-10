"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <Image
        src="/404.jpg"
        alt="Page Not Found"
        width={300}
        height={300}
        className="mb-6"
      />
      {/* <h1 className="text-6xl md:text-8xl font-extrabold text-red-600 mb-4">
        404
      </h1> */}
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Sorry, the page you are looking for does not exist. It might have been
        removed or the URL is incorrect.
      </p>
      <Link href="/">
        <button className=" cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition">
          Go Home
        </button>
      </Link>
    </div>
  );
}
