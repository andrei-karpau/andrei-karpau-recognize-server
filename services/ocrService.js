const mongoose = require('mongoose');

const Owner = require('../models/user');
const Recognize = require('../models/recognize');

const queriesByOwnerId = async uid => {
  let queriesList;
  try {
    queriesList = await Recognize.find({ owner: uid });
  } catch (err) {
    const error = console.log('Get queries list failed, please try again later.', 500);
    throw error;
  }
  return queriesList;
};

const ownerExist = async uid => {
  let owner;
  try {
    owner = await Owner.findById(uid);
  } catch (err) {
    const error = console.log('Get queries list failed, please try again later.', 500);
    throw error;
  }

  if (!owner) {
    const error = console.log('Cannot find owner specified id.', 404);
    throw error;
  }

  return owner;
};

const getQueriesList = async (req, res, next) => {
  const ownerId = req.params.uid;

  let owner;

  try {
    owner = await ownerExist(userId);
  } catch (err) {
    return next(console.log('Cannot find owner specified id.', 404));
  }

  let ownerQueries;

  try {
    ownerQueries = await queriesByOwnerId(user.id);
  } catch (err) {
    return next(console.log('Get queries list failed, please try again later.', 500));
  }

  if (ownerQueries.length === 0) {
    return next(console.log('List of queries is empty.', 404));
  } else {
    res.status(200).json({
      queries: ownerQueries.map(querie => querie.toObject({ getters: true })),
    });
  }
};

const newQuerie = async (req, res, next) => {
  const { title, userId, error, public_id, status, fileName } = req.body;

  if (!title) {
    return next(console.log('Please make sure to include querie.', 422));
  }

  let owner;

  try {
    owner = await ownerExist(userId);
  } catch (err) {
    return next(console.log('Cannot find owner specified id.', 404));
  }

  let createdNewQuerie;

  try {
    createdNewQuerie = new Recognize({
      title,
      completed: false,
      owner: owner.id,
      error,
      public_id,
      status,
      fileName
    });
  } catch (err) {
    console.log(err);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(createdNewQuerie);
    await createdNewQuerie.save();
    await session.commitTransaction();
  } catch (err) {
    return next(console.log('Adding querie failed, please try again.', 500));
  }

  let ownerQueries;

  try {
    ownerQueries = await queriesByOwnerId(user.id);
  } catch (err) {
    return next(console.log('Get queries list failed, please try again later.', 500)
    );
  }

  res.status(201).json({
    message: 'Run new querie',
    querie: createdNewQuerie,
    queries: ownerQueries.map(querie => querie.toObject({ getters: true })),
  });
};

const updateQuerieStatus = async (req, res, next) => {
  const { completed, userId } = req.body;
  const querieId = req.params.tid;

  let owner;

  try {
    owner = await ownerExist(userId);
  } catch (err) {
    return next(console.log('Cannot find user specified id.', 404));
  }

  let querie;

  try {
    querie = await Recognize.findByIdAndUpdate(
      { _id: querieId },
      { completed: completed },
      { new: true }
    );
  } catch (err) {
    return next(console.log('Cannot update status of the specified querie.', 500));
  }
  if (!querie) {
    return next(console.log('Cannot find querie by id.', 404));
  }

  res.status(200).json({
    message: 'Querie updated successefully',
    querie: querie,
  });
};

const deleteQuerieById = async (req, res, next) => {
  const { userId } = req.body;
  const querieId = req.params.tid;

  let owner;

  try {
    owner = await ownerExist(userId);
  } catch (err) {
    return next(console.log('Cannot find owner specified id.', 404));
  }

  let querie;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      querie = await Recognize.findByIdAndDelete({ _id: querie, owner: querie.id });
    } catch (err) {
      return next(
        console.log('Cannot delete querie by id.', 500));
    }

    if (!querie) {
      return next(console.log('Cannot find querie by id.', 404));
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    console.log(err);
    return next(
      console.log('Cannot delete querie.', 500)
    );
  }

  res.status(200).json({
    message: 'Querie deleted successfully',
    querie: querie,
  });
};

const deleteAllCompleted = async (req, res, next) => {
  const { userId } = req.body;

  let owner;

  try {
    owner = await ownerExist(userId);
  } catch (err) {
    return next(console.log('Cannot find owner specified id.', 404));
  }

  let queries;
  try {
    queries = await Recognize.find({ completed: true });
  } catch (err) {
    return next(console.log('Cannot completed queries.',500));
  }
  if (!queries || queries.length === 0) {
    return next(console.log('Cannot not find any completed queries', 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const idsToDelete = queries.map(querie => querie._id);
    await Recognize.deleteMany({ _id: { $in: [...idsToDelete] } }).session(session);
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    return next(console.log('Cannot not delete queries.', 500));
  }

  let ownerQueries;

  try {
    ownerQueries = await queriesByOwnerId(user.id);
  } catch (err) {
    return next(console.log('Get queries list, please try again later.', 500));
  }

  res.status(200).json({
    message: 'Deleted queries.',
    queries: ownerQueries.map(querie => querie.toObject({ getters: true })),
  });
};

exports.getQueriesList = getQueriesList;
exports.newQuerie = newQuerie;
exports.updateQuerieStatus = updateQuerieStatus;
exports.deleteQuerieById = deleteQuerieById;
exports.deleteAllCompleted = deleteAllCompleted;
