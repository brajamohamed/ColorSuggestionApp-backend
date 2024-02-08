const User = require("../modals/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateToken = require("../jwt");
// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  let password = req.body?.password;
  if (password) {
    const salt = await bcrypt.genSaltSync(10);
    req.body.password = await bcrypt.hashSync(password, salt);
  }
  try {
    await User.create(req.body);
    res.status(200).json({ message: "User registed successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
// USER LOGIN
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const jwtoken = await generateToken(user.id);
    res
      .status(500)
      .json({ message: "User logged in successfully", jwt: jwtoken });
  } else {
    res.status(400).json({ error: "Invalid Credentials" });
  }
  console.log(dec);
});
// UPDATE USER DETAILS
const updateUser = asyncHandler(async (req, res) => {});

module.exports = { registerUser, updateUser, userLogin };
