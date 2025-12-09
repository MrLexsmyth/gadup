import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number, // actual price used for the order (discountPrice if available)
      quantity: Number,
      image: { url: String },
      discountPrice: { type: Number, default: 0 }, // discount applied
      discountPercentage: { type: Number, default: 0 }, // discount percentage applied
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
  reference: { type: String }, // store payment reference
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
