import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

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
      images // array of { url, public_id } from frontend
    } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    const numericPrice = Number(price);
    const numericDiscount = Number(discountPrice);
    const numericStock = Number(stock);

    const discountPercentage = discountPrice
      ? Math.round(((numericPrice - numericDiscount) / numericPrice) * 100)
      : 0;

    const product = new Product({
      name,
      description,
      price: numericPrice,
      category,
      brand,
      stock: numericStock,
      isFeatured: isFeatured === "true",
      discountPrice: numericDiscount || 0,
      discountPercentage,
      images,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// ---------------------------
// DELETE PRODUCT
// ---------------------------
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all images from Cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // Delete product from DB
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// UPDATE PRODUCT (MULTIPLE IMAGES)
// ---------------------------
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { 
      name,
      description,
      price,
      category,
      brand,
      stock,
      isFeatured,
      discountPrice,
      removeImageIds, // array of public_ids to remove
    } = req.body;

    // Update basic fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    // Update discount
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice;
      product.discountPercentage = discountPrice
        ? Math.round(((product.price - discountPrice) / product.price) * 100)
        : 0;
    }

    // ---------------------------
    // REMOVE SPECIFIC IMAGES
    // ---------------------------
    if (removeImageIds && Array.isArray(removeImageIds)) {
      for (const public_id of removeImageIds) {
        await cloudinary.uploader.destroy(public_id);
        product.images = product.images.filter(img => img.public_id !== public_id);
      }
    }

    // ---------------------------
    // ADD NEW IMAGES
    // ---------------------------
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        product.images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET ALL PRODUCTS (optional category filter)
// ---------------------------
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET SINGLE PRODUCT BY ID
// ---------------------------
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
