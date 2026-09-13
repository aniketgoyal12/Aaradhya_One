import pool from "../config/db.js";

// Get all packages
export const getAllPackages = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM packages ORDER BY id ASC");
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

// Get package by ID with included products (Masked pricing display available)
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const pkgResult = await pool.query("SELECT * FROM packages WHERE id = $1", [id]);
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Package not found"
      });
    }

    const packageData = pkgResult.rows[0];

    // Fetch included items joining products table
    const itemsResult = await pool.query(
      `SELECT pi.id AS package_item_id, pi.quantity, p.id AS product_id, p.name AS product_name, 
              p.description AS product_description, p.image_URI AS product_image, p.price AS item_price
       FROM package_items pi
       JOIN products p ON pi.product_id = p.id
       WHERE pi.package_id = $1`,
      [id]
    );

    return res.json({
      success: true,
      data: {
        ...packageData,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Create a package with items (Admin only)
export const createPackage = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, description, image_URI, items } = req.body;
    // items should be array of { product_id, quantity }

    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Package name and at least one included item are required."
      });
    }

    await client.query("BEGIN");

    // Calculate base price from product prices sum
    let calculatedBasePrice = 0;
    for (const item of items) {
      const prodRes = await client.query("SELECT price FROM products WHERE id = $1", [item.product_id]);
      if (prodRes.rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      calculatedBasePrice += Number(prodRes.rows[0].price) * (item.quantity || 1);
    }

    // Insert Package
    const pkgRes = await client.query(
      `INSERT INTO packages (name, description, base_price, image_URI)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description || null, calculatedBasePrice, image_URI || null]
    );
    const createdPackage = pkgRes.rows[0];

    // Insert Package Items
    for (const item of items) {
      await client.query(
        `INSERT INTO package_items (package_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [createdPackage.id, item.product_id, item.quantity || 1]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: createdPackage
    });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    client.release();
  }
};