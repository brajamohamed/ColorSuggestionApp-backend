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
  verifyResetPwdToken,
  addToWardrobe,
  deleteFromWardrobe,
} = require("../controller/userControl");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();

router.post("/register", registerUser);
router.get("/users", getAllUsers);
router.get("/user", isAuth, getAUser);
router.put("/login", userLogin);
router.put("/update", isAuth, updateUser);
router.put("/addNewItem", isAuth, addToWardrobe);
router.put("/deleteItem", isAuth, deleteFromWardrobe);
router.put("/updatePassword", isAuth, updatePassword);
router.put("/forgotPassword", forgotPassword);
router.put("/verifyResetPwdToken", verifyResetPwdToken);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
