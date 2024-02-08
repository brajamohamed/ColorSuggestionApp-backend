const express = require("express");
const { registerUser, userLogin } = require("../controller/userControl");
const router = express.Router();

router.post("/register", registerUser);
router.put("/update/:id");
router.put("/login", userLogin);

module.exports = router;
