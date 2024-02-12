"use strict";
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const sendEmail = asyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  console.log(data.link);
  const info = await transporter.sendMail({
    from: "Raja", // sender address
    to: data.email, // list of receivers
    subject: "Password Reset Link", // Subject line
    text: "This is your password reset link", // plain text body
    html: data.link, // html body
  });

  console.log("Message sent: %s", info.messageId);
});
module.exports = sendEmail;
