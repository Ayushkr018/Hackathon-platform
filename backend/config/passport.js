const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 'socialId.google': profile.id });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      // Link Google account
      user.socialId.google = profile.id;
      if (!user.avatar) {
        user.avatar = profile.photos.value;
      }
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      socialId: { google: profile.id },
      avatar: profile.photos.value,
      isVerified: true
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 'socialId.github': profile.id });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    
    if (email) {
      user = await User.findOne({ email });
      
      if (user) {
        // Link GitHub account
        user.socialId.github = profile.id;
        if (!user.avatar) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
        return done(null, user);
      }
    }

    // Create new user
    user = await User.create({
      name: profile.displayName || profile.username,
      email: email,
      socialId: { github: profile.id },
      avatar: profile.photos[0].value,
      isVerified: true
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));
