const mongoose = require('mongoose');

const userCollection = require('../models/user');
const recognize = require('../models/recognize');

const getListByOwner = async uid => {
    let recognizeList;
    try {
        recognizeList = await recognize.find({ owner: uid });
    } catch (err) {
      const error = console.log('Request failed, please try again later.', 500);
      throw error;
    }
    return recognizeList;
  };

  const checkOwnerExist = async uid => {
    let owner;
    try {
      owner = await recognize.findById(uid);
    } catch (err) {
      const error = console.log('Request failed, please try again later.', 500);
      throw error;
    }
  
    if (!owner) {
      const error = console.log('Could not find the owner.', 404);
      throw error;
    }
  
    return user;
  };

  const getQuriesList = async (req, res, next) => {

    const userId = req.params.uid;
  
    let owner;
  
    try {
      owner = await checkOwnerExist(userId);
    } catch (err) {
      return next(console.log('Could not find user specified id.', 404));
    }
  
    let quriesByUser;
  
    try {
        quriesByUser = await getListByOwner(user.id);
    } catch (err) {
      return next(console.log('Fetching tasks failed, please try again later.', 500));
    }
  
    if (quriesByUser.length === 0) {
      return next(console.log('Your list of tasks is empty.', 404));
    } else {
      res.status(200).json({
        tasks: userWithTasks.map(task => task.toObject({ getters: true })),
      });
    }
  };
  
