const mysql = require('mysql');
const mongoose = require('mongoose');
require('dotenv').config();

// MySQL Connection
const connectToMySQL = () => {
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        con.connect((err) => {
            if (err) {
                console.error("Error while connecting to MySQL:", err);
                reject(err);
            } else {
                resolve(con);
            }
        });
    });
};

// MongoDB Connection
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
        process.exit(1);
    }
};

module.exports = {
    connectToMySQL,
    connectToMongoDB
};
