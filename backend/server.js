const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

/* ======================
   Middleware
====================== */
app.use(express.json());
app.use(cors());

/* ======================
   Static files
====================== */
// Resume uploads
const uploadDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
   console.log('📁 Created uploads directory');
}
app.use('/uploads', express.static(uploadDir));

// Frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

/* ======================
   API Routes
====================== */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

const multer = require('multer');

/* ======================
   Error Handling Middleware
   ====================== */
app.use((err, req, res, next) => {
   // console.error('❌ Server Error:', err);

   // Check for Multer errors
   if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
   }

   // Handle error message strings (from our manual checks)
   if (typeof err === 'string') {
      return res.status(400).json({ message: err });
   }

   const statusCode = err.status || 500;
   res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err : {}
   });
});

/* ======================
   Frontend Route
====================== */
// Serve frontend for root
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* ======================
   MongoDB Connection
 ====================== */
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';

console.log('Attempting to connect to MongoDB...');
if (!mongoURI || mongoURI === 'undefined') {
   console.error('❌ Error: Mongo URI is undefined. Please check your .env file.');
}

mongoose.connect(mongoURI)
   .then(() => console.log('✅ MongoDB Connected Successfully'))
   .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('URI attempted:', mongoURI === process.env.MONGO_URI ? 'FROM_ENV' : 'LOCAL_FALLBACK');
   });

/* ======================
   Start Server
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`🚀 Server running on http://localhost:${PORT}`);
});
