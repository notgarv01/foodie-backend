const mongoose = require("mongoose");

function connectDb() {
  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ DB Connected");
    })
    .catch((err) => {
      console.error("❌ DB Connection Error:", err);
      throw err; // important
    });
}

module.exports = connectDb;