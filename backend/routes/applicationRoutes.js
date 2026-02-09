const express = require('express');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const sendEmail = require('../utils/sendEmail');
const Job = require('../models/Job');
const router = express.Router();

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Candidate
router.post('/:jobId', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
    console.log(`📩 New application request for jobId: ${req.params.jobId} from user: ${req.user._id}`);
    try {
        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        if (!req.file) {
            console.warn('⚠️ Application failed: No resume file uploaded');
            return res.status(400).json({ message: 'Please upload a resume' });
        }
        console.log(`📄 Resume uploaded: ${req.file.filename} (${req.file.size} bytes)`);

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user._id,
            resume: req.file.filename,
        });

        console.log(`✅ Application created for job: ${req.params.jobId} by user: ${req.user._id}`);

        // Send Email Notification in background
        (async () => {
            try {
                const job = await Job.findById(req.params.jobId);
                if (!job) {
                    console.warn(`⚠️ Could not find job ${req.params.jobId} for email notification`);
                    return;
                }

                const message = `Hello ${req.user.name},\n\nYour application for the position of "${job.title}" at "${job.company}" has been submitted successfully.\n\nWe will review your profile and get back to you soon.\n\nBest regards,\nJobPortal Team`;

                const sent = await sendEmail({
                    email: req.user.email,
                    subject: 'Application Submitted Successfully',
                    message,
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #2563eb;">Application Confirmed!</h2>
                            <p>Hello <strong>${req.user.name}</strong>,</p>
                            <p>Your application for the position of <strong>${job.title}</strong> at <strong>${job.company}</strong> has been submitted successfully.</p>
                            <p>We will review your profile and get back to you soon.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 0.8rem; color: #777;">Thank you for using JobPortal.</p>
                           </div>`
                });
                if (sent) console.log(`📧 Email sent to ${req.user.email}`);
            } catch (emailError) {
                console.error('❌ Background Email failed:', emailError.message);
            }
        })();

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get applications for a job (Employer only)
// @route   GET /api/applications/job/:jobId
router.get('/job/:jobId', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email')
            .populate('job', 'title');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get my applications (Candidate only)
// @route   GET /api/applications/my
router.get('/my', protect, authorize('candidate'), async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company location status');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
