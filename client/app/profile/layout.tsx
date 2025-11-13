
import Navbar from "../../components/Navbar";

export default function UserProfilePaget({ children }: { children: React.ReactNode }) {
  return (
   <>
  <Navbar />
  <main className="pt-20 min-h-screen bg-gray-50">
    {children}
  </main>
</>

  );
}
