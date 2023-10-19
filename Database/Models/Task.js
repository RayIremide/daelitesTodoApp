const mongoose = require('mongoose');
const shortid =require("shortid")

const taskSchema = new mongoose.Schema({
    task_id: {type: String,default:shortid.generate,required: true,},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String,required:true } ,
    status: { type: String, enum: ['pending', 'completed', 'deleted'],default:'pending'},
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
  
});

const taskModel = mongoose.model('Task', taskSchema);

module.exports = {taskModel};
