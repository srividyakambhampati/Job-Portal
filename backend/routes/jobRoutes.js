const express = require('express');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get all jobs with search and filter
// @route   GET /api/jobs
router.get('/', async (req, res) => {
    try {
        const { keyword, location, jobType } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (jobType && jobType !== 'All') {
            query.jobType = jobType;
        }

        const jobs = await Job.find(query).populate('postedBy', 'name companyName').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single job
// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name companyName');
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new job
// @route   POST /api/jobs
router.post('/', protect, authorize('employer', 'admin'), async (req, res) => {
    const { title, description, company, location, salary, jobType } = req.body;
    try {
        const job = new Job({
            title,
            description,
            company,
            location,
            salary,
            jobType,
            postedBy: req.user._id,
        });
        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if user is owner or admin
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get jobs posted by logged in employer
// @route   GET /api/jobs/myjobs
router.get('/myjobs', protect, authorize('employer'), async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
