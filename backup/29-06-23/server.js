
//server.js
const express = require('express');
const app = express();
const { connectToMongoDB, connectToMySQL } = require('./connection');
const router = require('./routes');

// Middleware
app.use(express.json());

// Use the users router
app.use('/api/users', router);

// Start the Express server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// Connect to MongoDB and MySQL
Promise.all([connectToMongoDB(), connectToMySQL()])
    .then(() => {
        console.log("Connected to MongoDB and MySQL");
    })
    .catch(error => {
        console.log("Error while connecting to the database:", error);
        process.exit(1);
    });

// Handle server close event
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
