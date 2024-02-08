const jwt = require("jsonwebtoken");
const secret = process.env.JWT;
const asyncHandler = require("express-async-handler");
const generateToken = asyncHandler(async (id) => {
  if (!secret) {
    throw new Error("JWT Secret key required");
  }
  return await jwt.sign({ id }, secret, { expiresIn: "1d" });
});

module.exports = generateToken;
