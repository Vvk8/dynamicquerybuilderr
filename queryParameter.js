//queryParameter.js

require('dotenv').config();

const databases = {
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'backendtask1',
    },
    mongodb: {
        connectionUrl:
            process.env.MONGODB_CONNECTION_URL ||
            'mongodb+srv://admin:admin@database.c6jvwfo.mongodb.net/backendtask1?retryWrites=true&w=majority',
        dbName: process.env.MONGODB_DB_NAME || 'backendtask1',
    },
};

const tables = {
    users: 'users',
};

const collections = {
    userlogs: 'userlogs',
};

const conditions = {
    equal: '=',
    notEqual: '<>',
    greaterThan: '>',
    lessThan: '<',
    greaterThanOrEqual: '>=',
    lessThanOrEqual: '<=',
    like: 'LIKE',
    in: 'IN',
};

const queries = {
    // Select All
    selectAll: (tableName) => {
        const sql = `SELECT * FROM ${tableName}`;
        return { sql, params: [] };
    },

    // Select by ID
    selectById: (tableName, conditionField, conditionValue) => {
        const sql = `SELECT * FROM ${tableName} WHERE ${conditionField} = ?`;
        const params = [conditionValue];
        return { sql, params };
    },

    // Insert data
    insertData: (tableName, data) => {
        const sql = `INSERT INTO ${tableName} SET ?`;
        return { sql, params: [data] };
    },

    // Update by ID
    updateById: (tableName, conditionField, conditionValue, data) => {
        const sql = `UPDATE ${tableName} SET ? WHERE ${conditionField} = ?`;
        const params = [data, conditionValue];
        return { sql, params };
    },

    // Delete by ID
    deleteById: (tableName, conditionField, conditionValue) => {
        const sql = `DELETE FROM ${tableName} WHERE ${conditionField} = ?`;
        const params = [conditionValue];
        return { sql, params };
    },
};

module.exports = { queries, databases, conditions, collections, tables };




/*
,
    // Multiple Search
    multipleSearch: (tableName, conditionField, conditionValues) => {
        const placeholders = conditionValues.map(() => '?').join(',');
        const sql = `SELECT * FROM ${tableName} WHERE ${conditionField} IN (${placeholders})`;
        return { sql, params: conditionValues };
    },

    // Single Insert
    singleInsert: (tableName, data) => {
        const sql = `INSERT INTO ${tableName} SET ?`;
        return { sql, params: data };
    },

    // Multiple Insert
    multipleInsert: (tableName, data) => {
        const sql = `INSERT INTO ${tableName} (emp_id, user_name, email) VALUES ?`;
        return { sql, params: [data] };
    },

    // Single Update
    singleUpdate: (tableName, data, conditionField, conditionValue) => {
        const sql = `UPDATE ${tableName} SET ? WHERE ${conditionField} = ?`;
        return { sql, params: [data, conditionValue] };
    },

    // Multiple Update
    multipleUpdate: (tableName, data, conditionField) => {
        const updateValues = data.map((item) => `(${item.emp_id}, '${item.user_name}', '${item.email}')`).join(',');
        const sql = `INSERT INTO ${tableName} (emp_id, user_name, email) VALUES ${updateValues} ON DUPLICATE KEY UPDATE user_name = VALUES(user_name), email = VALUES(email)`;
        return { sql, params: [] };
    },

    // Single Delete
    singleDelete: (tableName, conditionField, conditionValue) => {
        const sql = `DELETE FROM ${tableName} WHERE ${conditionField} = ?`;
        return { sql, params: [conditionValue] };
    },
    // Multiple Delete
    multipleDelete: (tableName, conditionField, conditionValues) => {
        const placeholders = conditionValues.map(() => '?').join(',');
        const sql = `DELETE FROM ${tableName} WHERE ${conditionField} IN (${placeholders})`;
        return { sql, params: conditionValues };
    },
    // Single Search
    singleSearch: (tableName, conditionField, conditionValue) => {
        const sql = `SELECT * FROM ${tableName} WHERE ${conditionField} = ?`;
        return { sql, params: [conditionValue] };
    }



*/