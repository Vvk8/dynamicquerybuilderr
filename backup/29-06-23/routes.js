//routes.js
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { connectToMySQL, connectToMongoDB } = require('./connection');
const UserLog = require('./userlog');
const { queries, conditions } = require('./queryParameter');

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
        const { sql } = queries.selectAll('users');

        const mysqlConnection = await connectToMySQL();
        const results = await new Promise((resolve, reject) => {
            mysqlConnection.query(sql, (err, results) => {
                if (err) {
                    console.error('Failed to fetch users from MySQL:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.json(results);
    } catch (error) {
        console.error('Failed to fetch users from MySQL:', error);
        res.status(500).json({ error: 'Failed to fetch users from MySQL' });
    }
});

//Multiplesearch
router.get('/searchbyid', async (req, res) => {
    try {
        const { field, value } = req.query;
        const { sql, params } = queries.multipleSearch('users', field, [value]);

        const mysqlConnection = await connectToMySQL();
        const results = await new Promise((resolve, reject) => {
            mysqlConnection.query(sql, params, (err, results) => {
                if (err) {
                    console.error('Failed to fetch users from MySQL:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (results && Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Failed to fetch users from MySQL: No results');
            res.status(404).json({ error: 'No results found' });
        }
    } catch (error) {
        console.error('Failed to fetch users from MySQL:', error);
        res.status(500).json({ error: 'Failed to fetch users from MySQL' });
    }
});


/*
// Create a user
router.post('/create', async (req, res) => {
    try {
        const { error, value } = dataSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { emp_id, user_name, email, phonenumber, designation, location } = value;

        const { sql, params } = queries.singleInsert('users', { emp_id, user_name, email, phonenumber, designation, location });

        const mysqlConnection = await connectToMySQL();

        mysqlConnection.query(sql, params, (err, result) => {
            if (err) {
                console.error('Failed to insert user in MySQL:', err);
                return res.status(500).json({ error: 'Failed to insert user in MySQL' });
            }

            res.json({ message: 'User created successfully' });
        });
    } catch (error) {
        console.error('Failed to execute database operations:', error);
        res.status(500).json({ error: 'Failed to execute database operations' });
    }
});

// Create multiple users in bulk
router.post('/createbulk', async (req, res) => {
    try {
        const users = req.body;

        if (!Array.isArray(users)) {
            return res.status(400).json({ error: 'Invalid input. An array of users is expected.' });
        }

        const { sql, params } = queries.multipleInsert('users', users);

        const mysqlConnection = await connectToMySQL();

        mysqlConnection.query(sql, params, (err, result) => {
            if (err) {
                console.error('Failed to insert users in MySQL:', err);
                return res.status(500).json({ error: 'Failed to insert users in MySQL' });
            }

            res.json({ message: 'Users created successfully' });
        });
    } catch (error) {
        console.error('Failed to execute database operations:', error);
        res.status(500).json({ error: 'Failed to execute database operations' });
    }
});

// Delete a user
router.delete('/delete/:id', async (req, res) => {
    try {
        const emp_id = req.params.id;

        const { sql, params } = queries.singleDelete('users', 'emp_id', emp_id);

        const mysqlConnection = await connectToMySQL();

        mysqlConnection.query(sql, params, (err, result) => {
            if (err) {
                console.error('Failed to delete user in MySQL:', err);
                return res.status(500).json({ error: 'Failed to delete user in MySQL' });
            }

            res.json({ message: 'User deleted successfully' });
        });
    } catch (error) {
        console.error('Failed to execute database operations:', error);
        res.status(500).json({ error: 'Failed to execute database operations' });
    }
});


// Update a user
router.put('/update/:id', async (req, res) => {
    try {
        const { field, value } = req.query;
        const { sql, params } = queries.multipleSearch('users', field, [value]);

        const mysqlConnection = await connectToMySQL();
        const results = await new Promise((resolve, reject) => {
            mysqlConnection.query(sql, params, (err, rows) => {
                if (err) {
                    console.error('Failed to fetch users from MySQL:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (results && Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Failed to fetch users from MySQL: No results');
            res.status(404).json({ error: 'No results found' });
        }
    } catch (error) {
        console.error('Failed to fetch users from MySQL:', error);
        res.status(500).json({ error: 'Failed to fetch users from MySQL' });
    }
});
router.get('/logs/:emp_id', (req, res) => {
    const { emp_id } = req.params;

    UserLog.find({ emp_id })
        .sort({ created_at: -1 })
        .then(logs => {
            res.json(logs);
        })
        .catch(error => {
            console.error('Failed to fetch user logs from MongoDB:', error);
            res.status(500).json({ error: 'Failed to fetch user logs from MongoDB' });
        });
});

router.post('/logs', (req, res) => {
    const { emp_id, log_timestamp, ipaddress, location, log_files } = req.body;

    const userLog = new UserLog({
        emp_id,
        log_timestamp,
        ipaddress,
        location,
        log_files,
        created_at: new Date()
    });

    userLog
        .save()
        .then(savedLog => {
            res.json({ message: 'User log created successfully' });
        })
        .catch(error => {
            console.error('Failed to create user log in MongoDB:', error);
            res.status(500).json({ error: 'Failed to create user log in MongoDB' });
        });
});
router.get('/data', async (req, res) => {
    try {
        const { sql, params } = queryParameters.selectAll('users');

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

        const { sql, params } = queryParameters.selectById('users', 'emp_id', emp_id);

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
*/
module.exports = router;
