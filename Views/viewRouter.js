const express = require('express');
const userService = require('../Services/user.services');
const taskService = require('../Services/task.services')
// const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const logger = require('../logger/index')
require('dotenv').config();



const viewRouter = express.Router();
// viewRouter.use(cookieParser())

viewRouter.get('/index', (req, res) => {
    res.render('index', { user: res.locals.user });
})


// Define a route for rendering the signup page
viewRouter.get('/signup', (req, res) => {
    res.render('signup');
});


//Define a route to handle the signup form submission
viewRouter.post('/signup',  async (req, res) => {
    
    const response = await userService.Signup({
        email: req.body.email,
        password: req.body.password,
        username:req.body.username,
        first_name:req.body.firstname,
        last_name:req.body.lastname 
    });

    if(response.code === 201){
        res.cookie('jwt', response.data.token)
        res.redirect("login")
    } else{
        res.render('signup',{error:response.message})
    }
});



// Define a route for rendering the login page
viewRouter.get('/login', (req, res) => {
    res.render('login');
});

viewRouter.post('/login', async (req, res) => {
    const response = await userService.Login({ email: req.body.email, password: req.body.password })


    if (response.code === 200) {
        // set cookie
        res.cookie('jwt', response.data.token)
        res.redirect("welcome")
    } else {
        res.render('login', { error: response.message })
    }
});


viewRouter.use(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken._id;
            // Now, `userId` contains the user's _id.
            // You can use this in your routes or pass it to the service functions.
            req.userId = userId; // Add it to the request object for later use
            next();
        } catch (error) {
            // Handle token verification error, e.g., invalid or expired token
            res.redirect('index'); // Redirect to login page or handle it as needed
        }
    } else {
        // If there's no token, you can handle it as needed
        res.redirect('index'); // Redirect to login page or handle it as needed
    }
});



// // View to render the welcome page
// viewRouter.get('/welcome', async (req, res) => {
//     const response = await taskService.getAllTask();
//     res.render('welcome', {    user: res.locals.user,
//         tasks: response.data.task}
      
//     );
//   });

// View to render the welcome page
viewRouter.get('/welcome', async (req, res) => {
    const user_id = req.userId;
    const response = await taskService.getOneTask(user_id);
    res.render('welcome', { user_id: res.locals.user, tasks: Array.isArray(response.data.tasks) ? response.data.tasks : [] });
      
  });

 
  
  // View to render the welcome page with pending tasks
viewRouter.get('/pending', async (req, res) => {
    const user_id = req.userId;
    const response = await taskService.getAllPendingTasks(user_id);
    res.render('pending', { user_id: res.locals.user, tasks: Array.isArray(response.data.tasks) ? response.data.tasks : [] });
      
});


// Define a route for rendering the completed page
viewRouter.get('/completed', async(req, res) => {
    const user_id = req.userId;
    const response = await taskService.getAllCompletedTasks(user_id)
    res.render('completed', { user_id: res.locals.user, tasks: Array.isArray(response.data.tasks) ? response.data.tasks : [] });
});
  
// Define a route for rendering the create Task page
viewRouter.get('/task', (req, res) => {
    const user_id = req.userId;
    res.render('task',{ user_id });
});

// Define a route to handle the create task form submission
// viewRouter.post('/task', async (req, res) => {
//     const user_id = req.cookies.user_id; 
//     const taskData = {
//         description: req.body.description,
//         user:user_id
//     };
//     console.log(taskData)

//     const response = await taskService.createTask(taskData);

//     if (response.code === 201) {
//         res.redirect("welcome"); 
//     } else {
//         res.render('task', { error: response.message ,description: req.body.description,user:req.body.user});
//     }
// });


// Define a route to handle the create task form submission
viewRouter.post('/task', async (req, res) => {
    const user_id = req.userId; 
    const taskData = {
        description: req.body.description,
        user: user_id, // Use user_id obtained from the cookie
    };
    console.log(taskData);

    const response = await taskService.createTask(taskData);

    if (response.code === 201) {
        res.redirect("welcome"); 
    } else {
        res.render('task', { error: response.message, description: req.body.description });
    }
});











// Define a route for rendering the update Task page
viewRouter.get('/update', (req, res) => {
    res.render('update');
});


// Route to mark a task as completed
viewRouter.post('/update/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
  
    try {
      const updatedTaskResponse = await taskService.updateTask(taskId);
  
      if (updatedTaskResponse.success) {
        res.redirect('/todo/welcome');
      } else {
        res.status(updatedTaskResponse.code).send('Failed to update task: ' + updatedTaskResponse.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send('Failed to update task: ' + error.message);
    }
  });
  



// Route to delete a task
viewRouter.post('/delete/:taskId', async (req, res) => {
    const taskId = req.params.taskId; 

    try {
        const deletedTaskResponse = await taskService.deleteTask(taskId); // Use taskId here

        if (deletedTaskResponse.success) {
            res.redirect("/todo/welcome");
        } else {
            res.status(deletedTaskResponse.code).send('Failed to delete task: ' + deletedTaskResponse.message);
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Failed to delete task: ' + error.message);
    }
});




// /views/logout
viewRouter.get('/logout', (req, res) => {    
    res.clearCookie('jwt')
    res.redirect('index')
});

module.exports = viewRouter;