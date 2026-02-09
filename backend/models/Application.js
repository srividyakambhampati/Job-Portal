const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, required: true }, // Path to file
    status: {
        type: String,
        enum: ['applied', 'reviewed', 'shortlisted', 'rejected'],
        default: 'applied'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
