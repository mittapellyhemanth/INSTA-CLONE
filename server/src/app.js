require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const routers = require("../routers/PostRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/", routers);

mongoose.connect(process.env.DB_URL+process.env.DB_NAME)
.then(()=>{
    console.log("Connected to DB");
})
.catch(()=>{
    console.log("Cannot be connected to DB");
});

app.listen(process.env.PORT, ()=>{
    console.log("Server connected and running on the port ", process.env.PORT);
});

module.exports = app;