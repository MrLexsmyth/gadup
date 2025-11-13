"use client";
import { toast } from "react-hot-toast";
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

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/user/profile", {
          withCredentials: true, 
        });
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.label || !form.line1 || !form.city || !form.state || !form.postalCode || !form.country) {
      toast.success("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const action = editingId ? "edit" : "add";
      const payload = editingId ? { ...form, _id: editingId } : form;

      const { data } = await axios.put(
        "http://localhost:5000/api/user/address",
        { action, address: payload },
        { withCredentials: true } // ✅ important for auth
      );

      setAddresses(data.addresses);
      setForm({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save address:", err);
      toast.success("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setForm(address);
    setEditingId(address._id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setLoading(true);

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/user/address",
        { action: "delete", address: { _id: id } },
        { withCredentials: true }
      );
      setAddresses(data.addresses);
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.success("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="p-6">Loading addresses...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6"
    style={{ fontFamily: "Playfair Display, serif" }}>
      <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>

      {/* Address Form */}
      <div className="border p-4 rounded-lg mb-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="label"
            placeholder="Telephone Num (Home/Work)"
            value={form.label}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="line1"
            placeholder="Address Line 1"
            value={form.line1}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="line2"
            placeholder="Address Line 2"
            value={form.line2}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-3 bg-[#008080] text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {editingId ? "Update Address" : "Add Address"}
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="border p-3 rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{addr.label}</p>
                <p>{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                <p>
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p>{addr.country}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id!)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
