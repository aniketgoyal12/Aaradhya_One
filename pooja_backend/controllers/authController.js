import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const VALID_ROLES = ["customer", "pujari", "support", "admin"];

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, zone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, password, and role."
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles are: ${VALID_ROLES.join(", ")}`
      });
    }

    if (role === "pujari" && (!zone || zone.trim() === "")) {
      return res.status(400).json({
        success: false,
        error: "Geographic zone is required for Pujari registration."
      });
    }

    // Check existing email
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists."
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, zone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, role, zone, created_at`,
      [name, email.toLowerCase(), phone || null, passwordHash, role, role === "pujari" ? zone.trim() : null]
    );

    const newUser = result.rows[0];

    // Generate token
    const secret = process.env.JWT_SECRET || "pooja_jwt_secret_key_2026_super_secure";
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, zone: newUser.zone },
      secret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: newUser
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password."
      });
    }

    // Fetch user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password."
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password."
      });
    }

    // Generate token
    const secret = process.env.JWT_SECRET || "pooja_jwt_secret_key_2026_super_secure";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, zone: user.zone },
      secret,
      { expiresIn: "7d" }
    );

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      zone: user.zone,
      created_at: user.created_at
    };

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: userProfile
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get Current Logged-in User Profile
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, name, email, phone, role, zone, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User profile not found."
      });
    }

    return res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
