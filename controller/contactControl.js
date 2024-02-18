const Contact = require("../modals/contactModel");
const asyncHandler = require("express-async-handler");

const newMessage = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    await Contact.create(req.body.values);
    res.status(200).json({ message: "form saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getAllContactRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await User.find();
    res.status(200).json({ message: "successfully retrived", requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { newMessage, getAllContactRequests };
