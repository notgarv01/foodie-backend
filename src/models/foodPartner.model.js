const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
    trim: true
  },
  cuisineType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "partner"
  }
}, { timestamps: true }); // Isse registration date track hogi

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema);

module.exports = foodPartnerModel;