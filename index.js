const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const dbConnect = require("./dbConnect");
const userRoute = require("./routes/userRoutes");
const contactRoute = require("./routes/contactRoute");
dbConnect();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/user", userRoute);
app.use(contactRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`App started on PORT ${port}`));
