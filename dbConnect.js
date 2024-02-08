const mongoose = require("mongoose");
const db = process.env.DB;
const dbConnect = () => {
  try {
    const conn = mongoose.connect(db);
    console.log("Database connection successfull");
  } catch (error) {
    console.log("Error connecting DB");
  }
};

module.exports = dbConnect;
