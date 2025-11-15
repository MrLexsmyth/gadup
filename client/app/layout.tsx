import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Script from 'next/script';


import "./globals.css";


export const metadata: Metadata = {
  title: "GadUp",
  description: "Your Gadgets store.",
   icons: {
    icon: "/gadup2.png", 
    shortcut: "/gadup2.png",   
    apple: "/gadup2.png", 
  },
  // openGraph: {
  //   title: "GadUp",
  //   description: "Your Gadgets store.",
  //   url: "https://yourdomain.com",
  //   siteName: "GadUp",
  //   images: [
  //     {
  //       url: "/down.png", 
  //       width: 1200,
  //       height: 630,
  //       alt: "GadUp Preview Image",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
    
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "GadUp",
  //   description: "Your Gadgets store.",
  //   images: ["/down.png"], 
  // },
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
          <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <Toaster position="bottom-right" />
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
