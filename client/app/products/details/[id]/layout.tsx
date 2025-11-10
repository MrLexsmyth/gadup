// app/checkout/layout.tsx
import Navbar from "../../../../components/Navbar";

export default function ProductPage({ children }: { children: React.ReactNode }) {
  return (
   <>
  <Navbar />
  <main className="pt-20 min-h-screen bg-gray-50">
    {children}
  </main>
</>

  );
}
