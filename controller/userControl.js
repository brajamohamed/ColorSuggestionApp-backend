const User = require("../modals/userModel");
const Color = require("../modals/colorModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateToken = require("../jwt");
const validateMongoDBObjectId = require("../utils/validateId");
const sendEmail = require("./emailControl");
const crypto = require("crypto");
// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    if (newUser.wardrobe) {
      updateColorDatabase(newUser.wardrobe);
    }
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.keyPattern.email) {
      return res
        .status(400)
        .json({ error: "User already registered with this Email" });
    }
    if (error.keyPattern.phone) {
      return res
        .status(400)
        .json({ error: "User already registered with this Mobile number" });
    }
    res.status(500).json({ error: "Registration Failed. Please try again" });
  }
});
// GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.json(users);
  } catch (error) {}
});
// GET A USER BY ID
const getAUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    return res.status(400).json({ error: "User id required" });
  }
  try {
    await validateMongoDBObjectId(userId);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    res.json(user);
  } catch (error) {
    console.log(error.stack);
    res.status(400).json({ error: error.message });
  }
});
// USER LOGIN
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const jwtoken = await generateToken(user.id);
      res
        .status(200)
        .json({ message: "User logged in successfully", jwt: jwtoken });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// UPDATE USER DETAILS
const updateUser = asyncHandler(async (req, res) => {
  const {
    userId,
    firstname,
    lastname,
    gender,
    phone,
    email,
    dateOfBirth,
    country,
    city,
    password,
    skinTone,
    hairColor,
    eyeColor,
    preferredStyles,
    wardrobe,
  } = req.body;
  if (email) {
    throw new Error("Email cannot be changed");
  }
  if (password) {
    throw new Error("Use Update Password section for changing password");
  }
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updateFields = {};
    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;
    if (gender) updateFields.gender = gender;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (country) updateFields.country = country;
    if (city) updateFields.city = city;
    if (skinTone) updateFields.skinTone = skinTone;
    if (hairColor) updateFields.hairColor = hairColor;
    if (eyeColor) updateFields.eyeColor = eyeColor;
    if (preferredStyles) {
      const duplicatedRemoved = preferredStyles.filter(
        (style) => !user.preferredStyles.includes(style)
      );
      updateFields.preferredStyles =
        user.preferredStyles.concat(duplicatedRemoved);
    }

    if (wardrobe) {
      const duplicatedRemoved = wardrobe.filter(
        (color) => !user.wardrobe.includes(color)
      );
      if (duplicatedRemoved.length > 0)
        updateFields.wardrobe = user.wardrobe.concat(duplicatedRemoved);
    }
    if (Object.keys(updateFields).length == 0) {
      return res.status(400).json({ message: "No new fields to update" });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    if (updateFields.wardrobe) {
      updateColorDatabase(updatedUser.wardrobe);
    }

    console.log(updateFields);
    res.send(updatedUser);
  } catch (error) {
    throw new Error(error.stack);
  }
});
// UPDATE PASSWORD
const updatePassword = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const resetLink = crypto.randomBytes(32).toString("hex");
    const resetToken = crypto
      .createHash("sha256")
      .update(resetLink)
      .digest("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    user.save();
    const emailLink = `Click the link below to reset your password<a href="http://localhost:5173/resetPassword/${resetToken}">Click Here</a>`;
    const data = { email: email, link: emailLink };
    await sendEmail(data);
    res.status(200).json({ message: "email sent" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
// VERIFY RESET PASSWORD TOKEN
const verifyResetPwdToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  console.log(token);
  // res.status(200).json({ message: "error" });
  try {
    const user = await User.findOne({ passwordResetToken: token });
    if (user) {
      console.log("user found, let me check time");
      console.log(user);
      if (user.passwordResetTokenExpiresAt < Date.now()) {
        return res.status(400).json({ error: "Link Expired" });
      } else {
        return res
          .status(200)
          .json({ message: "link validated", user: user.name });
      }
    } else {
      return res.status(400).json({ error: "Link not valid" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// FORGOT -> RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  console.log("reset password");
  try {
    const user = await User.findOne({ passwordResetToken: resetToken });
    user.password = password;
    user.passwordResetToken = "";
    user.passwordResetTokenExpiresAt = "";
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// CHECK IF THE COLOR DATABASE HAS ALL THE COLORS OF USER ELSE UPDATE COLOR DATABASE
const updateColorDatabase = async (newColors) => {
  try {
    const colorDatabase = await Color.find();
    const colors = colorDatabase.map((color) => color.colorName);
    const colorsToUpdate = newColors.filter((color) => !colors.includes(color));
    console.log(
      `colors in database ${colors} colors to update ${colorsToUpdate}`
    );
    for (let color of colorsToUpdate) {
      console.log("inside for", color);
      await Color.create({ colorValue: color });
    }
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  registerUser,
  getAllUsers,
  getAUser,
  userLogin,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyResetPwdToken,
};
