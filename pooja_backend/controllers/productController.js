import pool from "../config/db.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image_URI, stock_quantity } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "Product name and price are required."
      });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_URI, stock_quantity)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description || null, price, image_URI || null, stock_quantity || 0]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_URI, stock_quantity } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image_URI = $4, stock_quantity = $5 
       WHERE id = $6 RETURNING *`,
      [name, description, price, image_URI, stock_quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};