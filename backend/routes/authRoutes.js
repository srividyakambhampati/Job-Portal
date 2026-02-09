const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, role, companyName } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role, companyName });
        if (user) {
            console.log(`✅ User registered: ${user.email} (${user.role})`);

            // Send Welcome Email and Admin Notification in background
            const sendEmail = require('../utils/sendEmail');
            (async () => {
                try {
                    // 1. Welcome Email to User
                    const userEmailSent = await sendEmail({
                        email: user.email,
                        subject: 'Welcome to JobPortal!',
                        message: `Hello ${user.name},\n\nWelcome to JobPortal! Your account has been created successfully as a ${user.role}.\n\nExplore thousands of jobs or post your own listings today.\n\nBest regards,\nJobPortal Team`,
                        html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h2 style="color: #2563eb;">Welcome to JobPortal!</h2>
                                <p>Hello <strong>${user.name}</strong>,</p>
                                <p>Your account has been created successfully as a <strong>${user.role}</strong>.</p>
                                <p>Explore thousands of jobs or post your own listings today.</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                                <p style="font-size: 0.8rem; color: #777;">Thank you for joining JobPortal.</p>
                               </div>`
                    });
                    if (userEmailSent) console.log(`📧 Welcome email sent to ${user.email}`);

                    // 2. Notification Email to Admin
                    if (process.env.EMAIL_USER) {
                        const adminEmailSent = await sendEmail({
                            email: process.env.EMAIL_USER,
                            subject: 'New User Registered on JobPortal',
                            message: `New User: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`,
                            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #eee;">
                                    <h3 style="color: #2563eb;">New Registration Alert</h3>
                                    <p>A new user has registered on the platform:</p>
                                    <ul>
                                        <li><strong>Name:</strong> ${user.name}</li>
                                        <li><strong>Email:</strong> ${user.email}</li>
                                        <li><strong>Role:</strong> ${user.role}</li>
                                    </ul>
                                   </div>`
                        });
                        if (adminEmailSent) console.log(`📧 Admin notified about new user: ${user.email}`);
                    }
                } catch (emailError) {
                    console.error('❌ Background email task failed:', emailError.message);
                }
            })();

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
