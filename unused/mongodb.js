const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB server...");
  })
  .catch((error) => {
    console.log("Error while connecting to the database:", error);
  });
