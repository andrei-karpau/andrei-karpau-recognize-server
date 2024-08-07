const express = require('express');

const { newUser, logIn } = require('../services/userService');

const userRouter = express.Router();

userRouter.post('/signup', newUser);
userRouter.post('/login', logIn);

module.exports = userRouter;