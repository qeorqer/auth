require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/user');
const errorMiddleware = require('./middlewares/errors-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(userRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => console.log(`Server is running on ${PORT} port...`));
  } catch (error) {
    console.log(error);
  }
};

start();
