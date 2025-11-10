"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Address {
  _id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  addresses: Address[];
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/user/profile", {
          withCredentials: true,
        });
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!user) return <p className="p-6 text-red-500">Failed to load profile.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="border p-4 rounded shadow-sm mb-6">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>
      {user.addresses.length === 0 ? (
        <p>No addresses saved.</p>
      ) : (
        <div className="space-y-3">
          {user.addresses.map((addr) => (
            <div
  key={addr._id}
  className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
>
  <div className="flex flex-col gap-1">
    <strong className="text-gray-800 text-lg">{addr.label}</strong>
    <p className="text-gray-600 text-sm">{addr.line1}</p>
    {addr.line2 && <p className="text-gray-600 text-sm">{addr.line2}</p>}
    <p className="text-gray-600 text-sm">{addr.city}, {addr.state}</p>
    <p className="text-gray-600 text-sm">{addr.postalCode}, {addr.country}</p>
  </div>
</div>

          ))}
        </div>
      )}
    </div>
  );
}
