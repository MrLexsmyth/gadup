// app/checkout/layout.tsx
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function CategoryPage({ children }: { children: React.ReactNode }) {
  return (
   <>
  <Navbar />
  <main className="pt-20 min-h-screen bg-gray-50">
    {children}
  </main>
  <Footer />
</>

  );
}
