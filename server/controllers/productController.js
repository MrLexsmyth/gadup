import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
const { name, description, price, category, brand, stock, isFeatured, imageUrl, imagePublicId } = req.body;


   const product = new Product({
  name,
  description,
  price,
  category,
  brand,
  stock,
  isFeatured,
  image: {
    url: imageUrl,
    public_id: imagePublicId,
  },
});

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(product.image.public_id);

    // Delete product from database
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields from req.body
    const { name, description, price, category, brand, stock, isFeatured } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;
    product.isFeatured = isFeatured ?? product.isFeatured;

    // If a new image is uploaded
    if (req.file) {
      // Delete old image
      await cloudinary.uploader.destroy(product.image.public_id);

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      product.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get all products
// Get all products (with optional category filter)
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category) {
      // Filter by category, case-insensitive
      products = await Product.find({
        category: { $regex: new RegExp(category, "i") },
      }).sort({ createdAt: -1 }); // newest first
    } else {
      products = await Product.find().sort({ createdAt: -1 });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
