const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { connectToMySQL, connectToMongoDB } = require('./connection');
const UserLog = require('./userlog');
const { queries, conditionField } = require('./queryParameter');
router.use(express.json());
const dataSchema = Joi.object({
    emp_id: Joi.string(),
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phonenumber: Joi.string().pattern(/^\d{10}$/).required(),
    designation: Joi.string().required(),
    location: Joi.string().required(),
    // Add more fields and their validation rules as needed
});

const updatedataSchema = Joi.object({
    emp_id: Joi.string(),
    user_name: Joi.string(),
    email: Joi.string().email(),
    phonenumber: Joi.string().pattern(/^\d{10}$/),
    designation: Joi.string(),
    location: Joi.string(),
    // Add more fields and their validation rules as needed
});


//searchbycondition
const searchbycondition = async (req, res) => {
    let mongoConnection; // Declare the variable to store the MongoDB connection

    try {
        const tableName = req.query.tablename || 'users';
        const conditionFieldName = req.query.conditionField;
        const conditionType = req.query.conditions;
        const conditionValue = req.query.conditionValue; // Convert conditionValue to a string

        if (!conditionFieldName || !conditionType || !conditionValue) {
            res.status(400).json({ error: 'Condition field, type, and value are required' });
            return;
        }

        const conditionFields = await conditionField.fieldValues(tableName);

        if (!conditionFields.includes(conditionFieldName)) {
            res.status(400).json({ error: 'Invalid condition field' });
            return;
        }

        const { sql, params } = queries.selectByCondition(tableName, conditionFieldName, conditionType, conditionValue);

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

        mongoConnection = await connectToMongoDB(); // Establish MongoDB connection

        console.log('conditionValue:', conditionValue); // Add this line to check the value of conditionValue
        console.log('conditionFieldName:', conditionFieldName); // Add this line to check the value of conditionFieldName
        const mongoQuery = {};
        mongoQuery[conditionFieldName] = conditionValue;

        const mongoResults = await UserLog.find(mongoQuery).sort({ created_at: -1 });

        //const mongoResults = await UserLog.find({ emp_id: 3333 });
        //const mongoResults = await UserLog.find({ [conditionFieldName]: { $eq: conditionValue } }).sort({ created_at: -1 });


        console.log('mongoResults:', mongoResults); // Add this line to log the retrieved data from MongoDB

        res.json({ sqlData: sqlResults, mongoData: mongoResults });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};


// Search users
const search = async (req, res) => {
    try {
        const tableName = req.query.tablename || 'users';

        const { sql, params } = queries.selectAll(tableName);

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
};


// Create user
const create = async (req, res) => {
    try {
        const { error } = dataSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        // Generate the next emp_id
        const mysqlConnection = await connectToMySQL();
        const nextEmpIdResult = await new Promise((resolve, reject) => {
            mysqlConnection.query('SELECT MAX(emp_id) AS max_emp_id FROM users', (err, result) => {
                if (err) {
                    console.error('Failed to fetch max emp_id:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        const maxEmpId = nextEmpIdResult[0].max_emp_id;
        const nextEmpId = maxEmpId ? maxEmpId + 1 : 1;

        const userData = {
            ...req.body,
            emp_id: nextEmpId,
        };

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
            emp_id: nextEmpId,
            ipaddress: req.ip, // Assuming you want to store the IP address of the client making the request
            log_timestamp: new Date().toISOString(),
            location: userData.location,
        };

        const userLog = new UserLog(userLogData);
        await userLog.save(); // Assuming UserLog is a Mongoose model

        res.status(201).json({ message: 'User created successfully', emp_id: nextEmpId });
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Update user by ID
const updatebyid = async (req, res) => {
    try {
        const emp_id = req.params.emp_id;
        const { error } = updatedataSchema.validate(req.body);
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
        await UserLog.updateOne({ emp_id }, userData);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Failed to update user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete user by ID
const deletebyid = async (req, res) => {
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

        await UserLog.deleteOne({ emp_id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

router.get('/search', search);
router.get('/searchbycondition', searchbycondition);
router.post('/create', create);
router.put('/update/:emp_id', updatebyid);
router.delete('/delete/:emp_id', deletebyid);

module.exports = router;
