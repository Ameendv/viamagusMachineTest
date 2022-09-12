const mongoose = require("mongoose");

const admin = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    
   
    },
  { collection: "admin" }
);

const model = mongoose.model("Admin", admin);

module.exports = model;