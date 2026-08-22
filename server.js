require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./config/db');

const authRoutes = require('./routes/authRoutes');

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

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:5000/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists based on googleId
          const existingUser = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          if (existingUser) {
            return done(null, existingUser);
          } else {
            // New user via Google
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null;
            
            // Check if user exists with this email but without googleId
            if (email) {
                const userWithEmail = await prisma.user.findUnique({ where: { email } });
                if (userWithEmail) {
                    // Link google account to existing email
                    const updatedUser = await prisma.user.update({
                        where: { email },
                        data: {
                            googleId: profile.id,
                            emailVerified: true,
                        }
                    });
                    return done(null, updatedUser);
                }
            }

            const firstName = profile.name ? profile.name.givenName : '';
            const lastName = profile.name ? profile.name.familyName : '';
            const profilePicture =
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null;
            const emailVerified = true;

            const newUser = await prisma.user.create({
              data: {
                googleId: profile.id,
                firstName,
                lastName,
                name: profile.displayName,
                email,
                emailVerified,
                profilePicture,
              }
            });
            return done(null, newUser);
          }
        } catch (error) {
          console.error('Google OAuth Error:', error);
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth credentials not provided. Google login will fail.');
}

// Routes
app.use('/', authRoutes);

// Database Test
prisma.$connect()
  .then(() => {
    console.log('Database connected via Prisma');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:5000`);
});
