require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl) or any localhost port
      if (!origin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// ============================================================
// POST /api/profile  — Create or update a user_profiles row
// ============================================================
app.post('/api/profile', async (req, res) => {
  try {
    let {
      id,          // neon_auth user UUID
      email,
      firstName,
      lastName,
      phone,
      city,
      country,
      photo,
      additionalInfo,
      travelStyle,
      profileCompleted,
    } = req.body;

    // If no id was provided, look up the neon_auth user by email
    if (!id && email) {
      const neonUser = await prisma.user.findUnique({ where: { email } });
      if (neonUser) {
        id = neonUser.id;
      }
    }

    if (!id) {
      return res.status(400).json({ error: 'User ID or valid email is required' });
    }

    // Verify the neon_auth user actually exists (required by FK constraint)
    const neonUser = await prisma.user.findUnique({ where: { id } });
    if (!neonUser) {
      return res
        .status(404)
        .json({ error: `No Neon Auth user found with id: ${id}` });
    }

    // Upsert into public.user_profiles (the correct table with FK to neon_auth.user)
    const profile = await prisma.user_profiles.upsert({
      where: { user_id: id },
      update: {
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        phone: phone || undefined,
        city: city || undefined,
        country: country || undefined,
        photo: photo || undefined,
        additional_info: additionalInfo || undefined,
        travel_style: travelStyle || undefined,
        profile_completed: profileCompleted !== undefined ? profileCompleted : true,
        updated_at: new Date(),
      },
      create: {
        user_id: id,
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        city: city || null,
        country: country || null,
        photo: photo || null,
        additional_info: additionalInfo || null,
        travel_style: travelStyle || 'Solo Explorer',
        profile_completed: profileCompleted !== undefined ? profileCompleted : true,
      },
    });

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile: ' + error.message });
  }
});

// ============================================================
// GET /api/profile/:id  — Fetch user_profiles row by user_id
// ============================================================
app.get('/api/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let profile = await prisma.user_profiles.findUnique({
      where: { user_id: id },
    });

    if (!profile) {
      // Fallback: maybe the caller passed an email instead of UUID
      const neonUser = await prisma.user.findUnique({ where: { email: id } });
      if (neonUser) {
        profile = await prisma.user_profiles.findUnique({
          where: { user_id: neonUser.id },
        });
      }
    }

    res.json({ profile: profile || null });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ============================================================
// GET /api/profile/:id/saved-destinations  — Fetch saved destinations
// ============================================================
app.get('/api/profile/:id/saved-destinations', async (req, res) => {
  try {
    const { id } = req.params;
    const destinations = await prisma.saved_destinations.findMany({
      where: { user_id: id },
      include: {
        cities: true
      },
      orderBy: { saved_at: 'desc' }
    });
    res.json({ success: true, savedDestinations: destinations });
  } catch (error) {
    console.error('Error fetching saved destinations:', error);
    res.status(500).json({ error: 'Failed to fetch saved destinations' });
  }
});

// ============================================================
// DELETE /api/profile/:id  — Delete user account
// ============================================================
app.delete('/api/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deleting the user from neon_auth.user will cascade and delete
    // their user_profiles, sessions, accounts, and saved_destinations.
    await prisma.user.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Database connection check on startup
prisma
  .$connect()
  .then(() => {
    console.log('✅ Database connected via Prisma');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
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
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
