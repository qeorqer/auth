import express, { Application } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();


const userRouter = require('./routes/user');
const errorMiddleware = require('./middlewares/error');

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000!;
const DB_URI:string = process.env.MONGO_URL!

app.use(express.json());

app.use(userRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(DB_URI);

    app.listen(PORT, () => console.log(`Server is running on ${PORT} port...`));
  } catch (error) {
    console.log(error);
  }
};

start();
