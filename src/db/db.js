const mongoose = require("mongoose");
console.log("Current Directory:", process.cwd());
console.log("Env URI:", process.env.MONGODB_URI);
function connectDb() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log("error connecting db", err);
    });
}
module.exports = connectDb;
