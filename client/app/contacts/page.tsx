"use client";
import { Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-16 mt-18"
    style={{ fontFamily: "Playfair Display, serif" }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-md rounded-lg p-8">
        {/* Left Side */}
        <div className="space-y-8">
          {/* Call to us */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="text-[#0e8e8e]" />
              <h3 className="text-lg font-semibold">Call to Us</h3>
            </div>
            <p className="text-gray-600">We are available 24/7 a week</p>
            <p className="text-gray-800 mt-2 font-medium">
              Phone: <span className="text-[#0e8e8e]">+234 816 927 3808</span>
            </p>
          </div>

          {/* Write to us */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-[#0e8e8e]" />
              <h3 className="text-lg font-semibold">Write to Us</h3>
            </div>
            <p className="text-gray-600">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-gray-800 mt-2 font-medium">
              Email:{" "}
              <span className="text-[#0e8e8e]">support@yourstore.com</span>
            </p>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <form className="space-y-5 text-[#0e8e8e]">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
           
              <input
                type="text"
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="">
             
              <input
                type="email"
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
           
            <input
              type="tel"
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
          
            <textarea
              rows={5}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0e8e8e] cursor-pointer text-white font-medium py-2 rounded-md hover:bg-gray-600 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
