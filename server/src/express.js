const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routers = require("../Routers/Post");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();

app.use(bodyParser.json());

mongoose
  .connect(process.env.URL)
  .then((res) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error :", err);
  });

app.use("/", routers);
app.use("/uploads", express.static("uploads"));
app.listen(8080, console.log("server connected"));
