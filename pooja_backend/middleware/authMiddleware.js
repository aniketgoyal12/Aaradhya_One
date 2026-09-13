import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "pooja_jwt_secret_key_2026_super_secure";
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token."
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access forbidden. Insufficient permissions."
      });
    }
    next();
  };
};
