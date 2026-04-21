const foodPartnerModel = require("../models/foodPartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// 🔐 Food Partner Middleware (unchanged, correct)
async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    if (!foodPartner) {
      return res.status(401).json({
        message: "Food Partner not found",
      });
    }

    req.foodPartner = foodPartner;

    next();
  } catch (err) {
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