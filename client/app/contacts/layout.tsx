// app/checkout/layout.tsx
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ContactPage({ children }: { children: React.ReactNode }) {
  return (
   <>
  <Navbar />
  <main className="">
    {children}
  </main>
  <Footer />
</>

  );
}
