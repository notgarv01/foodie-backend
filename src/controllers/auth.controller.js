const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;
  const isUserAlreadyExist = await userModel.findOne({
    email,
  });
  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "user already exist",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Set to true for production HTTPS
    sameSite: 'none', // Required for cross-origin cookies
    domain: '.onrender.com', // Set domain for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.status(201).json({
    message: "user registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

async function loginUser(req, res) {
  const { email, fullName, password } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
    });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Set to true for production HTTPS
    sameSite: 'none', // Required for cross-origin cookies
    domain: '.onrender.com', // Set domain for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      fullName: user.fullName,
      email: user.email,
      _id: user._id,
    },
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    meaasage: "user logged out successfully",
  });
}

async function registerFoodPartner(req, res) {
  const { name, email, password, phone, address, restaurantName, cuisineType } =
    req.body;

  const isAccountAlreadyExists = await foodPartnerModel.findOne({
    email,
  });

  if (isAccountAlreadyExists) {
    return res.status(400).json({
      message: "Food partner account already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    restaurantName,
    cuisineType,
  });

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Set to true for production HTTPS
    sameSite: 'none', // Required for cross-origin cookies
    domain: '.onrender.com', // Set domain for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  res.status(201).json({
    message: "Food partner registered successfully",
    foodPartner: {
      name: foodPartner.name,
      _id: foodPartner._id,
      email: foodPartner.email,
      phone:foodPartner.phone,
    address:foodPartner.address,
    restaurantName:foodPartner.restaurantName,
    cuisineType:foodPartner.cuisineType,

    },
  });
}

async function loginFoodPartner(req, res) {
  console.log("LOGIN API HIT");
  const { name, email, password } = req.body;

  const foodPartner = await foodPartnerModel.findOne({ email });

  if (!foodPartner) {
    return res.status(400).json({
      message: "Account not registered",
    });
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    foodPartner.password,
  );

  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Set to true for production HTTPS
    sameSite: 'none', // Required for cross-origin cookies
    domain: '.onrender.com', // Set domain for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.status(200).json({
    message: "partner logged in successfully",
    user: {
      name: foodPartner.name,
      email: foodPartner.email,
      _id: foodPartner._id,
    },
  });
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Food Partner logged out succesfully",
  });
}

async function getFoodPartnerById(req,res){}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
