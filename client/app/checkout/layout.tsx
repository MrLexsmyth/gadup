// app/checkout/layout.tsx
import Navbar from "../../components/Navbar";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
   <>
  <Navbar />
  <main className=" min-h-screen ">
    {children}
  </main>
</>

  );
}
