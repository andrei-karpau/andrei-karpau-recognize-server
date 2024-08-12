const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');

const userRouter = require('./middleware/userRouter');
const ocrRouter = require('./middleware/ocrRouter');

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: 'GET, PUT, POST, PATCH, DELETE',
        credentials: true,
    })
);

app.use(express.json());

app.use('/user', userRouter);
app.use('/queries', ocrRouter);

mongoose
    .connect(
        `${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}/${process.env.MONGODB_PARAMS}`
    )
    .then(() => {
        app.listen(`${process.env.PORT || 5050}`, () => {
            console.log(`server listening on ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`mongoose connection error: ${err}`);
    });

