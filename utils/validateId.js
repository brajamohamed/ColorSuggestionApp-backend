const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const validateMongoDBObjectId = asyncHandler(async (id) => {
  const isValid = await mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("Invalid MongoDB Object Id");
  }
});

module.exports = validateMongoDBObjectId;
