const Task = require('../Database/Models/Task')
const User = require('../Database/Models/User');
const jwt = require('jsonwebtoken');
const logger = require('../logger/index')
require('dotenv').config();
const mongoose = require('mongoose');


// Get all task
// const getAllTask = async () => {

//     const task = await Task.taskModel.find();

//     return {
//         code: 200,
//         success: true,
//         message: 'Task fetched successfully',
//         data: {
//             task
//         }
//     }
// }

const getOneTask = async (user) => {
  try {
      const tasks = await Task.taskModel.find({ user: user });
      
      return {
          code: 200,
          success: true,
          message: 'Tasks fetched successfully',
          data: {
              tasks
          }
      };
  } catch (error) {
      return {
          code: 500,
          success: false,
          message: 'Error fetching tasks',
          error: error.message
      };
  }
}





// Get pending tasks
const getAllPendingTasks = async (user) => {
  const pendingTasks = await Task.taskModel.find({ status: 'pending',user: user });

  return {
      code: 200,
      success: true,
      message: 'Pending tasks fetched successfully',
      data: {
          tasks: pendingTasks
      }
  }
}



//Get all Completed task
const getAllCompletedTasks = async (user) => {
  const completedTasks = await Task.taskModel.find({ status: 'completed',user: user});

  return {
      code: 200,
      success: true,
      message: 'Completed tasks fetched successfully',
      data: {
          tasks: completedTasks
      }
  };
};



//Create a todo list
const createTask = async ({ user, description, status }) => {
  const newTask = { user, description, status };
  try {
    const task = await Task.taskModel.create(newTask); 
    return {
      message: 'Task registered successfully',
      code: 201,
      data: { newTask: task }, 
    };
  } catch (error) {
    logger.error('[UserService] => Task Registration process failed', error);
    return {
      message: 'Registration failed',
      code: 500,
    };
  }
}





// Update a task's status to "completed" by ID
const updateTask = async (_id) => {
  const update = {
    status: 'completed',
    updatedDate: new Date(),
  };
  try {
    const updatedTask = await Task.taskModel.findByIdAndUpdate(
      _id,update, 
      { new: true } 
    );

    if (!updatedTask) {
      return {
        code: 404,
        success: false,
        message: 'Task not found',
      };
    }

    return {
      code: 200,
      success: true,
      message: 'Task updated successfully',
      data: {
        task: updatedTask,
      },
    };
  } catch (error) {
    console.error('Error updating task:', error);
    return {
      code: 500,
      success: false,
      message: 'Error updating task',
      error: error.message,
    };
  }
};




// Delete a task by ID
const deleteTask = async (_id) => {
  try {
    const deletedTask = await Task.taskModel.findByIdAndRemove(_id);

    if (!deletedTask) {
      return {
        code: 404,
        success: false,
        message: 'Task not found',
      };
    }

    return {
      code: 200,
      success: true,
      message: 'Task deleted successfully',
      data: {
        task: deletedTask,
      },
    };
  } catch (error) {
    console.error('Error deleting task:', error);
    return {
      code: 500,
      success: false,
      message: 'Error deleting task',
      error: error.message,
    };
  }
};




module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getAllPendingTasks,
    getAllCompletedTasks,
    getOneTask
            }