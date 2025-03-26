const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: { 
        type: String, 
        required: true 
    },
    salary: { 
        type: Number, 
        required: true 
    }, 
    category: { 
        type: String, 
        required: true
    },
    image:{
        type: String,
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    applications: [{
        type: ObjectId,
        ref: "Application"
    }],
    applicants: [{
        type: ObjectId,
        ref: "User"
    }],
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Job', jobSchema);
