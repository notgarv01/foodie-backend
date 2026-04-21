require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/db/db");

const PORT = process.env.PORT || 3000;

// ✅ DB connect + Server start
connectDb()
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });