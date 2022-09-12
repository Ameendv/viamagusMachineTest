const mongoose = require("mongoose");

const tasks = new mongoose.Schema(
  {
    description: { type: String,required:true },
    due_date: { type: Date ,required:true },
    
    status: { type: String,required:true  },
    assignee: { type: String,required:true },
    assignedTo:{type:String}
   
    },
  { collection: "tasks" , timestamps: true }
);

const model = mongoose.model("Tasks", tasks);

module.exports = model;