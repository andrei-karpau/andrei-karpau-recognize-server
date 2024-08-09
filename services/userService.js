const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userCollection = require('../models/user');
const JWT_KEY = process.env.JWT_SECRET_KEY;


const newUser = async (req, res, next) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return next(console.log('Please make sure to include all inputs.', 422));
    }
  
    let existingUser;
  
    try {
      existingUser = await userCollection.findOne({
        $or: [{ username: username }, { email: email }],
      });
    } catch (err) {
      return next(console.log('Signing up failed, please try again later.', 500));
    }
  
    if (existingUser) {
      if (existingUser.username === username) {
        return next(console.log('Username already taken, please choose a different one.', 422));
      } else if (existingUser.email === email) {
        return next(console.log('Email address already registered, please use a different one or login.', 422));
      }
    }
  
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(console.log('Could not create user, please try again.', 500));
    }
  
    let createdUser;
    try {
      createdUser = new userCollection({
        username,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
    }
  
    try {
      await createdUser.save();
    } catch (err) {
      return next(console.log('Signing up failed, please try again later.', 500));
    }
  
    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        JWT_KEY,
        { expiresIn: '1h' }
      );
    } catch (err) {
      return next(console.log('Signing up failed, please try again later.', 500));
    }
  
    res.status(201).json({
      userName: createdUser.username,
      userId: createdUser.id,
      email: createdUser.email,
      jwtToken: token,
    });
  };

  const logIn = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(console.log('Please make sure to include all inputs.', 422));
    }
  
    let existingUser;
    try {
      existingUser = await userCollection.findOne({ email: email });
    } catch (err) {
      return next(console.log('Logging in failed, please try again later.', 500));
    }
  
    if (!existingUser) {
      return next(console.log('User is not found, please check your email', 422));
    }
  
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      return next(console.log('Could not log you in, please try again.', 500));
    }
  
    if (!isValidPassword) {
      return next(console.log('Please check your password, could not log you in.', 403));
    }
  
    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, username: existingUser.username },
        JWT_KEY,
        { expiresIn: '1h' }
      );
    } catch (err) {
      return next(console.log('Logging in failed, please try again', 500));
    }
    res.status(200).json({
      userName: existingUser.username,
      userId: existingUser.id,
      email: existingUser.email,
      jwtToken: token,
    });
  };

  exports.newUser = newUser;
  exports.logIn = logIn;