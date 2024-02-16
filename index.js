const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const dbConnect = require("./dbConnect");
const userRoute = require("./routes/userRoutes");
dbConnect();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/user", userRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`App started on PORT ${port}`));
