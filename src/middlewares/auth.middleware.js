const foodPartnerModel = require("../models/foodPartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// 🔐 Food Partner Middleware (unchanged, correct)
async function authFoodPartnerMiddleware(req, res, next) {
  console.log("Food Partner Middleware - Cookies:", req.cookies);
  console.log("Food Partner Middleware - Headers:", req.headers);
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({
      message: "please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const foodPartner = await foodPartnerModel.findById(decoded.id);
    console.log("Found food partner:", foodPartner);

    if (!foodPartner) {
      console.log("Food Partner not found for ID:", decoded.id);
      return res.status(401).json({
        message: "Food Partner not found",
      });
    }

    req.foodPartner = foodPartner;

    next();
  } catch (err) {
    console.log("Token verification error:", err);
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

// 🔥 FIXED User Middleware (IMPORTANT)
async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ONLY userModel (NO foodPartner here)
    const userData = await userModel.findById(decoded.id);

    if (!userData) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 🔥 MOST IMPORTANT
    req.user = userData;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
};