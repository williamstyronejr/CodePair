const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const axios = require('axios');
const User = require('../models/user');

const { JWT_SECRET, GITHUB_ID, GITHUB_SECRET, GITHUB_CALLBACK } = process.env;

const localLogin = new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then((user) => {
      if (!user) return done(null, false);

      user
        .comparePassword(password)
        .then((same) => {
          if (same) return done(null, user);
          done(null, false);
        })
        .catch((passErr) => {
          done(passErr);
        });
    })
    .catch((err) => {
      return done(err);
    });
});

const jwtOptions = {
  jwtFromRequest: (req) => req.cookies.token,
  secretOrKey: JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
    .then((user) => {
      if (user) return done(null, user);
      return done(null, false);
    })
    .catch((err) => {
      return done(err);
    });
});

const gitLogin = new GithubStrategy(
  {
    clientID: GITHUB_ID,
    clientSecret: GITHUB_SECRET,
    callbackURL: GITHUB_CALLBACK,
  },
  async (authToken, refreshToken, profile, done) => {
    const search = {
      githubId: profile.id,
    };

    try {
      // If user already has an account, return user object
      const userExists = await User.findOne(search, { hash: false }).exec();

      if (userExists) return done(null, userExists);

      // If private email, make api request to get email
      let email;
      if (!profile.email) {
        const response = await axios.get('https://api.github.com/user/emails', {
          headers: {
            'user-agent': 'my user-agent',
            authorization: `token ${authToken}`,
          },
        });

        email = response.data.find((e) => e.primary).email;
      } else {
        email = profile.emails.find((e) => e.primary).value;
      }

      // Create user without username
      User({
        email,
        profileImage: profile.photos[0].value,
        githubId: profile.id,
      }).save((saveErr, newUser) => {
        if (saveErr) return done(saveErr);
        return done(null, newUser);
      });
    } catch (err) {
      return done(err);
    }
  }
);

// Set passport to use auth strategies
passport.use(localLogin);
passport.use(jwtLogin);
passport.use(gitLogin);
