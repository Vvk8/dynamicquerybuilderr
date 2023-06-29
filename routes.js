// routes.js
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { connectToMySQL, connectToMongoDB } = require('./connection');
const UserLog = require('./userlog');
const { queries } = require('./queryParameter');

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
router.get('/search', async (req, res) => {
    try {
        const { sql, params } = queries.selectAll('users');

        const mysqlConnection = await connectToMySQL();
        const sqlResults = await new Promise((resolve, reject) => {
            mysqlConnection.query(sql, params, async (err, results) => {
                if (err) {
                    console.error('Failed to fetch users from MySQL:', err);
                    reject(err);
                } else {
                    const empIds = results.map((user) => user.emp_id);
                    const mongoResults = await UserLog.find({ emp_id: { $in: empIds } }).sort({ created_at: -1 });
                    res.json({ sqlData: results, mongoData: mongoResults });
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// API to fetch data from both SQL and MongoDB based on emp_id
router.get('/search/:emp_id', async (req, res) => {
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

// Create user
// Create new user
router.post('/create', async (req, res) => {
    try {
        const { error } = dataSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const userData = req.body;
        const mysqlConnection = await connectToMySQL();
        const mysqlResult = await new Promise((resolve, reject) => {
            mysqlConnection.query('INSERT INTO users SET ?', userData, (err, result) => {
                if (err) {
                    console.error('Failed to create user in MySQL:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const userLogData = {
            emp_id: userData.emp_id,
            ipaddress: req.ip, // Assuming you want to store the IP address of the client making the request
            log_timestamp: new Date().toISOString(),
        };

        const userLog = new UserLog(userLogData);
        await userLog.save(); // Assuming UserLog is a Mongoose model

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


// Update user by ID
router.put('/update/:emp_id', async (req, res) => {
    try {
        const emp_id = req.params.emp_id;
        const { error } = dataSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const userData = req.body;
        const mysqlConnection = await connectToMySQL();
        await new Promise((resolve, reject) => {
            mysqlConnection.query('UPDATE users SET ? WHERE emp_id = ?', [userData, emp_id], (err, result) => {
                if (err) {
                    console.error('Failed to update user in MySQL:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await UserLog.updateOne({ emp_id }, userData); // Assuming UserLog is a Mongoose model
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Failed to update user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user by ID
router.delete('/delete/:emp_id', async (req, res) => {
    try {
        const emp_id = req.params.emp_id;

        const mysqlConnection = await connectToMySQL();
        await new Promise((resolve, reject) => {
            mysqlConnection.query('DELETE FROM users WHERE emp_id = ?', [emp_id], (err, result) => {
                if (err) {
                    console.error('Failed to delete user from MySQL:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await UserLog.deleteOne({ emp_id }); // Assuming UserLog is a Mongoose model
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
