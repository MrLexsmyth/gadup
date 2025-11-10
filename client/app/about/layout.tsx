
import Navbar from "../../components/Navbar";
import FooterFlex from "../../components/FooterFlex";

export default function About({ children }: { children: React.ReactNode }) {
  return (
   <>
  <Navbar />
  <main className="pt-16 min-h-screen bg-gray-50">
    {children}
  </main>
  <FooterFlex />
</>
    
  );
}
