require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Database Test
prisma.$connect()
  .then(() => {
    console.log('Database connected via Prisma');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// Express static serving with HTTP caching for public media assets
app.use(
  express.static('public', {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.mp4') || path.endsWith('.webp') || path.endsWith('.jpg') || path.endsWith('.png')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Accept-Ranges', 'bytes');
      }
    },
  })
);

// Start Server
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
