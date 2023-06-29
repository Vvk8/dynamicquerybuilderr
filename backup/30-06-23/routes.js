//routes.js
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { connectToMySQL, connectToMongoDB } = require('./connection');
const UserLog = require('./userlog');
const { queries } = require('./queryParameter'); // Make sure the correct object is imported

router.use(express.json());

const dataSchema = Joi.object({
    emp_id: Joi.string().required(),
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phonenumber: Joi.string().pattern(/^\d{10}$/).required(),
    designation: Joi.string().required(),
    location: Joi.string().required(),
    // Add more fields and their validation rules as needed
});

// Search users
router.get('/data', async (req, res) => {
    try {
        const { sql, params } = queries.selectAll('users');

        const mysqlConnection = await connectToMySQL();
        const sqlResults = await new Promise((resolve, reject) => {
            mysqlConnection.query(sql, params, (err, results) => {
                if (err) {
                    console.error('Failed to fetch users from MySQL:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const empIds = sqlResults.map((user) => user.emp_id);
        const mongoResults = await UserLog.find({ emp_id: { $in: empIds } }).sort({ created_at: -1 });
        res.json({ sqlData: sqlResults, mongoData: mongoResults });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// API to fetch data from both SQL and MongoDB based on emp_id
router.get('/data/:emp_id', async (req, res) => {
    try {
        const emp_id = req.params.emp_id;

        const { sql, params } = queries.selectById('users', 'emp_id', emp_id);

        const mysqlConnection = await connectToMySQL();
        const sqlResults = await new Promise((resolve, reject) => {
            mysqlConnection.query(sql, params, (err, results) => {
                if (err) {
                    console.error('Failed to fetch user from MySQL:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const mongoResults = await UserLog.find({ emp_id }).sort({ created_at: -1 });
        res.json({ sqlData: sqlResults, mongoData: mongoResults });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
