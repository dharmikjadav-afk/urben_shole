const Product = require("../models/Product");

// ================= GET ALL PRODUCTS =================
// Supports:
// ?category=men
// ?search=shoe
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // Filter by category
    if (category) {
      filter.category = category.toLowerCase();
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SINGLE PRODUCT =================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CREATE PRODUCT (ADMIN) =================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, image, description, countInStock, brand } =
      req.body;

    // Validation
    if (!name || !price || !category || !image) {
      return res.status(400).json({
        message: "Required fields: name, price, category, image",
      });
    }

    const product = await Product.create({
      name,
      price,
      category: category.toLowerCase(),
      image,
      description: description || "",
      brand: brand || "UrbanSole",
      countInStock: countInStock || 0,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE PRODUCT (ADMIN) =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, category, image, description, countInStock, brand } =
      req.body;

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.category = category ? category.toLowerCase() : product.category;
    product.image = image ?? product.image;
    product.description = description ?? product.description;
    product.brand = brand ?? product.brand;
    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE PRODUCT (ADMIN) =================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
