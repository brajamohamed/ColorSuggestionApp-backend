const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const validateMongoDBObjectId = require("../utils/validateId");
const isAuth = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const verified = await jwt.verify(token, process.env.JWT);
      if (!verified) {
        throw new Error("JWT verification failed");
      }
      const userId = verified.id;
      await validateMongoDBObjectId(userId);
      req.body.userId = userId;
      next();
    } catch (error) {
      throw new Error(error.stack);
    }
  } else {
    throw new Error("Token not present");
  }
});

module.exports = isAuth;
