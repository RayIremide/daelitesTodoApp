const express = require('express');
const controller = require('../Controller/usercontroller')
const taskcontroller = require('../Controller/taskcontroller')

const userRouter = express.Router();

// Create New User
userRouter.post('/signup',  controller.signUp)

// Login 
userRouter.post('/login', controller.Login)

// Get todo list 
userRouter.get('/task',taskcontroller.getAllTask)

// Create todo list 
userRouter.post('/task',taskcontroller.createTask)

// Update todo list 
userRouter.put('/update/:id', taskcontroller.renderUpdateTaskView);

// Delete todo list 
userRouter.delete('/task/:id',taskcontroller.DeleteTask)



module.exports = {userRouter}