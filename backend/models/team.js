const mongoose = require("mongoose");

const team = new mongoose.Schema(
  {
    teamName: { type: String,required:true },
    teamMembers: { type: Array },
    
    
   
    },
  { collection: "team" , timestamps: true }
);

const model = mongoose.model("TEam", team);

module.exports = model;