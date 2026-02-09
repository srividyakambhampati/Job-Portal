const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const bcrypt = require('bcryptjs');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-portal';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch((err) => {
        console.error('❌ Connection Error:', err.message);
        process.exit(1);
    });

const seedData = async () => {
    try {
        await User.deleteMany();
        await Job.deleteMany();

        const hashedPassword = await bcrypt.hash('123456', 10);

        const users = await User.create([
            { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
            { name: 'Employer One', email: 'employer@example.com', password: hashedPassword, role: 'employer', companyName: 'Tech Corp' },
            { name: 'Candidate John', email: 'john@example.com', password: hashedPassword, role: 'candidate' }
        ]);

        const employer = users[1];

        await Job.create([
            {
                title: 'Software Engineer',
                description: 'We are looking for a MERN stack developer with 3+ years of experience.',
                company: 'Tech Corp',
                location: 'Remote',
                salary: '$80k - $100k',
                jobType: 'Full-time',
                postedBy: employer._id
            },
            {
                title: 'Frontend Developer',
                description: 'React expert needed for a high-traffic e-commerce site.',
                company: 'Web Design Studio',
                location: 'New York',
                salary: '$70k - $90k',
                jobType: 'Contract',
                postedBy: employer._id
            },
            {
                title: 'Backend Developer',
                description: 'Node.js and MongoDB expert for API development.',
                company: 'Data Solutions Inc',
                location: 'San Francisco',
                salary: '$90k - $120k',
                jobType: 'Full-time',
                postedBy: employer._id
            },
            {
                title: 'Full Stack Developer',
                description: 'Join our dynamic team building the next generation of fintech apps.',
                company: 'Fintech Hub',
                location: 'London',
                salary: '£60k - £80k',
                jobType: 'Full-time',
                postedBy: employer._id
            },
            {
                title: 'Junior Web Developer',
                description: 'Great opportunity for fresh graduates to learn and grow.',
                company: 'Startup Lab',
                location: 'Austin',
                salary: '$50k - $65k',
                jobType: 'Internship',
                postedBy: employer._id
            },
            {
                title: 'DevOps Engineer',
                description: 'Manage our AWS infrastructure and CI/CD pipelines.',
                company: 'Cloud Scale',
                location: 'Remote',
                salary: '$110k - $140k',
                jobType: 'Full-time',
                postedBy: employer._id
            },
            {
                title: 'User Interface Designer',
                description: 'Figma and Adobe XD pro needed for revamping our mobile app.',
                company: 'Creative Studio',
                location: 'Los Angeles',
                salary: '$75k - $90k',
                jobType: 'Part-time',
                postedBy: employer._id
            },
            {
                title: 'Data Scientist',
                description: 'Python and Machine Learning enthusiast for interesting data projects.',
                company: 'AI Research Group',
                location: 'Boston',
                salary: '$100k - $130k',
                jobType: 'Full-time',
                postedBy: employer._id
            }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
