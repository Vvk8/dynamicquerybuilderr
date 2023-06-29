//crudoperations.js
// Example SQL CRUD operations

// Create a new record
mysqlConnection.query('INSERT INTO users (emp_id, user_name,email, phonenumber, designation, location) VALUES (?, ?,?,?,?,?)', [value1, value2, value3, value4, value5, value6], (err, result) => {
    if (err) {
        console.error('Failed to insert record:', err);
        return;
    }
    console.log('Record inserted successfully:', result);
});

// Find records
mysqlConnection.query('SELECT * FROM users', (err, results) => {
    if (err) {
        console.error('Failed to fetch records:', err);
        return;
    }
    console.log('Fetched records:', results);
});

// Update a record
mysqlConnection.query('UPDATE users SET column1 = ? WHERE id = ?', [newValue, id], (err, result) => {
    if (err) {
        console.error('Failed to update record:', err);
        return;
    }
    console.log('Record updated successfully:', result);
});

// Delete a record
mysqlConnection.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
        console.error('Failed to delete record:', err);
        return;
    }
    console.log('Record deleted successfully:', result);
});


// Example MongoDB CRUD operations

// Create a new document
const collection = mongoClient.db('database').collection('collectionname');
collection.insertOne({ field1: value1, field2: value2 }, (err, result) => {
    if (err) {
        console.error('Failed to insert document:', err);
        return;
    }
    console.log('Document inserted successfully:', result);
});

// Find documents
collection.find({}).toArray((err, documents) => {
    if (err) {
        console.error('Failed to fetch documents:', err);
        return;
    }
    console.log('Fetched documents:', documents);
});

// Update a document
collection.updateOne({ _id: documentId }, { $set: { field1: newValue } }, (err, result) => {
    if (err) {
        console.error('Failed to update document:', err);
        return;
    }
    console.log('Document updated successfully:', result);
});

// Delete a document
collection.deleteOne({ _id: documentId }, (err, result) => {
    if (err) {
        console.error('Failed to delete document:', err);
        return;
    }
    console.log('Document deleted successfully:', result);
});
