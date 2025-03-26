const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const applicationSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true    
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    jobId: {
        type: ObjectId,
        ref: "jobId"
    },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Application', applicationSchema);
