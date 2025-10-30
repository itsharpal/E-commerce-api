import express from 'express';
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({});


const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
    connectDB();
})