const bcrypt = require('bcrypt');
const prisma = require('../config/db');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, travelStyle } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !travelStyle) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const name = `${firstName} ${lastName}`;

    // Insert new user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        travelStyle,
      }
    });

    // Create session
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Session creation failed' });
      }
      return res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture,
          travelStyle: user.travelStyle,
        },
      });
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Please login using your linked social account (Google)' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Session creation failed' });
      }
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture,
          travelStyle: user.travelStyle,
        },
      });
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

exports.me = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        googleId: user.googleId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture,
        travelStyle: user.travelStyle,
      },
    });
  } else {
    return res.status(401).json({
      authenticated: false,
      user: null,
    });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};
