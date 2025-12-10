import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "./models/Product.js"; 

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const products = await Product.find({ image: { $exists: true } });

    console.log(`Found ${products.length} products with old image field`);

    for (let p of products) {
      // only migrate if data exists
      if (p.image && p.image.url && p.image.public_id) {
        p.images = [
          {
            url: p.image.url,
            public_id: p.image.public_id,
          },
        ];
      }

      // remove old image field
      p.image = undefined;

      await p.save();
    }

    console.log("Migration completed!");
    process.exit();
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

start();
