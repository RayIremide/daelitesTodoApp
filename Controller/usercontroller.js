const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User= require('../Database/Models/User')
const logger = require('../logger')
const userService = require('../Services/user.services')
require('dotenv').config();


// New User registration
const signUp = async (req, res) => {
  try {
    const newUser = req.body;

    const existingUser = await User.userModel.findOne({
        email: newUser.email
    });

    if (existingUser) {
        return res.status(409).json({
            message: 'User already exists',
        });
    }



    // Create a new user only if no existing user is found
    const user = await User.userModel.create({
        username:newUser.username,
        email: newUser.email,
        password: newUser.password,
        first_name:newUser.first_name,
        last_name:newUser.last_name
    });
    const token = await jwt.sign({ email: user.email, user_id: user.user_id}, process.env.JWT_SECRET)

    return res.status(201).json({
        message: 'User Registered Successfully',
        user,
        token
    });


  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
    console.log(error);
  }
};



// User login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User not found! Please sign up' });
    }

    const passwordMatch = await user.isValidPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email or Password incorrect' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
        message: "Login Successful",
        token });
        
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    console.log(error)
  }
};

module.exports = { signUp,Login } 
