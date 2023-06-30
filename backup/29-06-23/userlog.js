//userlog.js
const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
    emp_id: {
        type: Number,
        required: false
    },
    log_timestamp: {
        type: Date,
        required: true
    },
    ipaddress: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    log_files: {
        type: [String],
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const UserLog = mongoose.model('UserLog', userLogSchema);

module.exports = UserLog;
