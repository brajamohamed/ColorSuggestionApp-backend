const express = require("express");
const {
  registerUser,
  userLogin,
  updateUser,
  getAllUsers,
  getAUser,
  updatePassword,
  resetPassword,
  forgotPassword,
} = require("../controller/userControl");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();

router.post("/register", registerUser);
router.get("/users", getAllUsers);
router.get("/:userId", getAUser);
router.put("/login", userLogin);
router.put("/update", isAuth, updateUser);
router.put("/updatePassword", isAuth, updatePassword);
router.put("/forgotPassword", isAuth, forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
