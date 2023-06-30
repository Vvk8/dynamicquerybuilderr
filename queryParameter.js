require('dotenv').config();
const { connectToMySQL } = require('./connection');
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

const database = {
    querybuilder: 'backendtask1',
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

const conditionField = {
    fieldValues: async (tableName) => {
        try {
            const { databases } = require('./queryParameter');
            const mysqlConnection = await connectToMySQL();
            const sql = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${databases.mysql.database}' AND TABLE_NAME = '${tableName}'`;

            const columnNames = await new Promise((resolve, reject) => {
                mysqlConnection.query(sql, (err, results) => {
                    if (err) {
                        console.error('Failed to fetch column names:', err);
                        reject(err);
                    } else {
                        const columns = results.map((result) => result.COLUMN_NAME);
                        resolve(columns);
                    }
                });
            });

            return columnNames;
        } catch (error) {
            console.error('Failed to fetch column names:', error);
            throw error;
        }
    },
};

const queries = {
    // Select All
    selectAll: (tableName) => {
        const sql = `SELECT * FROM ${tableName}`;
        return { sql, params: [] };
    },

    // Select by ID
    // Select by condition
    selectByCondition: (tableName, conditionField, conditionType, conditionValue) => {
        let sql = `SELECT * FROM ${tableName} WHERE `;
        let params = [];

        // Adjust the SQL query based on the condition type
        switch (conditionType) {
            case 'equals':
                sql += `${conditionField} = ?`;
                params = [conditionValue];
                break;
            case 'notEqual':
                sql += `${conditionField} <> ?`;
                params = [conditionValue];
                break;
            case 'greaterThan':
                sql += `${conditionField} > ?`;
                params = [conditionValue];
                break;
            case 'lessThan':
                sql += `${conditionField} < ?`;
                params = [conditionValue];
                break;
            case 'greaterThanOrEqual':
                sql += `${conditionField} >= ?`;
                params = [conditionValue];
                break;
            case 'lessThanOrEqual':
                sql += `${conditionField} <= ?`;
                params = [conditionValue];
                break;
            case 'like':
                sql += `${conditionField} LIKE ?`;
                params = [`%${conditionValue}%`];
                break;
            case 'in':
                const values = conditionValue.split(',');
                const placeholders = values.map(() => '?').join(',');
                sql += `${conditionField} IN (${placeholders})`;
                params = values;
                break;
            default:
                throw new Error('Invalid condition type');
        }

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

module.exports = { queries, conditionField, databases, conditions, collections, tables };
