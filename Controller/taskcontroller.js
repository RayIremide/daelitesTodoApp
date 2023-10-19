const express = require('express');
const jwt = require('jsonwebtoken');
const Task= require('../Database/Models/Task')
const logger = require('../logger')
const userService = require('../Services/user.services')
require('dotenv').config();


// Get list of all todo task
const getAllTask= async (req, res) => {
    try {
      const todoTask = await Task.taskModel.find();
      res.status(200).json({ todoTask });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
    }
  };

  //Create a todo list
  const createTask = async(req,res)=>{
    try {
      const newTask = req.body;
      Task.taskModel.create(newTask)
      res.status(201).json({
        message:"Task created successfully",
        newTask})
    }catch(error){
      res.status(500).json({ message: 'Error creating task', error });
    }
  }
  

//Update a todo list
const UpdateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    task.updatedDate = new Date();

    const updatedTask = await Task.taskModel.findByIdAndUpdate(id, task, { new: true });

    if (!updatedTask) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask, // Return the updated task
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Your controller code
const renderUpdateTaskView = async (req, res) => {
  const taskId = req.params.id;

  // Fetch the task data based on the taskId from your database or data source
  const task = await Task.taskModel.getTaskById(taskId);

  if (!task) {
      return res.status(404).json({ message: 'Task not found' });
  }

  res.render('update', { task }); // Pass the task object to the view
};




  //Delete a todo list
  const DeleteTask = async(req,res)=>{
    try{
      const id = req.params.id
      Task.taskModel.findByIdAndRemove(id)
      res.status(200).json({
        message:"Task deleted successfully"
      })
    }catch(error){
      res.status(500).json({message: 'Error deleting task',error})
    }
  }

  



  module.exports = {    getAllTask,
                        createTask,
                        DeleteTask,
                        UpdateTask ,
                      renderUpdateTaskView  } 