const express = require("express");
const {
  newMessage,
  getAllContactRequests,
} = require("../controller/contactControl");
const router = express.Router();

router.post("/newContactRequest", newMessage);
router.get("/getAllContactRequest", getAllContactRequests);

module.exports = router;
