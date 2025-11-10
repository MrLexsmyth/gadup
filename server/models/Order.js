import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: { url: String },
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  address: {
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  userName: String,
  userEmail: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
