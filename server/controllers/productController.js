import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { 
      name,
      description,
      price,
      category,
      brand,
      stock,
      isFeatured,
      discountPrice,
      imageUrl,
      imagePublicId
    } = req.body;

    // Calculate discountPercentage automatically
    const discountPercentage = discountPrice
      ? ((discountPrice / price) * 100).toFixed(0)
      : 0;

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      stock,
      isFeatured,
      discountPrice,
      discountPercentage,
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

// DELETE PRODUCT
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


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { 
      name, description, price, category, brand, stock, isFeatured, discountPrice 
    } = req.body;

    // Update basic fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;

    // FIXED STOCK LOGIC
    if (stock !== undefined) {
      product.stock = Number(stock);   // this allows stock = 0
    }

    // Boolean fields
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    // Discount logic
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice;
      product.discountPercentage = discountPrice
        ? ((discountPrice / product.price) * 100).toFixed(0)
        : 0;
    }

    // Handle image update
    if (req.file) {
      await cloudinary.uploader.destroy(product.image.public_id);

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

// GET ALL PRODUCTS (with optional category filter)
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category) {
      products = await Product.find({
        category: { $regex: new RegExp(category, "i") },
      }).sort({ createdAt: -1 });
    } else {
      products = await Product.find().sort({ createdAt: -1 });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT BY ID
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
