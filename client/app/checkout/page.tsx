"use client";

import API from "../../lib/api";

import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

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

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart, cartCount, updateQuantity } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Fetch user profile and addresses
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get("/user/profile");
        if (data) {
          setName(data.name || "");
          setEmail(data.email || "");
          if (data.addresses?.length > 0) {
            setAddresses(data.addresses);
            setSelectedAddressId(data.addresses[0]._id || null);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserData();
  }, []);

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const deliveryFee = 3000;
const grandTotal = totalPrice + deliveryFee;

  // ✅ Add new address
  const handleSaveNewAddress = async () => {
    if (!newAddress.label || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.country) {
      alert("Please fill all required fields for new address");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.put("/user/address", {
        action: "add",
        address: newAddress,
      });
      setAddresses(data.addresses);
      setSelectedAddressId(data.addresses[data.addresses.length - 1]._id || null);
      setShowNewAddressForm(false);
      setNewAddress({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Place order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId && !showNewAddressForm) {
      alert("Please select or add an address before checkout");
      return;
    }

    let addressToUse: Address | undefined;
    if (showNewAddressForm) {
      addressToUse = newAddress;
    } else {
      addressToUse = addresses.find((addr) => addr._id === selectedAddressId);
    }

    if (!addressToUse) {
      alert("Address not found");
      return;
    }

    try {
      setLoading(true);
      await API.post("/order", {
        items: cart,
        total: totalPrice,
        address: addressToUse,
        userName: name,
        userEmail: email,
      });

      alert("Order placed successfully!");
      clearCart();
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const addressFields: (keyof Address)[] = ["label", "line1", "line2", "city", "state", "postalCode", "country"];

  return ( 
  <div className={playfair.className}>
      {/* Hero Image: full width, responsive height */}
      <div className="relative w-full h-18 sm:h-34 md:h-50 lg:h-64">
        <Image
          src="/addhero.jpg"
          alt="Hero"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6 mt-6">
        {/* LEFT: Billing & Shipping */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Billing Details</h2>
          <form className="space-y-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </form>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Shipping Address Info</h2>

          {/* Existing Addresses */}
          {addresses.length > 0 && !showNewAddressForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddressId(addr._id || null)}
                  className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 
                    ${selectedAddressId === addr._id ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{addr.label}</span>
                    {selectedAddressId === addr._id && (
                      <span className="text-sm text-blue-600 font-medium">Selected</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 leading-snug">
                    <p>{addr.line1}</p>
                    <p>{addr.line2 && <> {addr.line2}</>}</p>
                    <p>{addr.city}, {addr.state}</p>
                    <p>{addr.postalCode}, {addr.country}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowNewAddressForm(true)}
                className="p-4 border-2 border-dashed rounded-lg text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-400 transition-all"
              >
                + Add New Address
              </button>
            </div>
          )}

          {/* New Address Form */}
          {(showNewAddressForm || addresses.length === 0) && (
            <div className="border p-4 rounded mb-4 shadow-sm flex flex-col gap-3">
              {addressFields.map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field === "label" ? "Telephone (Home/Work)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newAddress[field] || ""}
                  onChange={handleNewAddressChange}
                  className="border p-2 rounded"
                />
              ))}
              <button
                onClick={handleSaveNewAddress}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="w-full md:w-150 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Order Summary ({cartCount} items)</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4 border-b-[0.5px] border-gray-300 pb-2">
                  <div className="flex items-center gap-2">
                    {item.image?.url && <Image src={item.image.url} alt={item.name} width={90} height={80} className="rounded object-cover" />}
                    <div className="">
                      <p className="font-medium ">{item.name}</p>
                      <p className="text-sm text-gray-800 font-semibold">₦{item.price.toLocaleString()}</p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 mt-1 ">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="cursor-pointer px-2 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold mt-1">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-800 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between text-lg mt-4 border-b-[0.5px] border-gray-300 pb-2">
                <span>Subtotal:</span>
                <span className="float-right font-semibold">₦{totalPrice.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-lg mb-2 border-b-[0.5px] border-gray-300 pb-2">
                <span>Delivery Fee:</span>
                <span className="float-right font-semibold">₦3,000.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800">
  <span>Total:</span>
  <span className="float-right">₦{grandTotal.toLocaleString()}.00</span>
</div>



              <button
                onClick={handlePlaceOrder}
                className="mt-6 w-full bg-red-600 cursor-pointer text-white py-3 rounded hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Making payment..." : "Payment with Paystack"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
