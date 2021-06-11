'use strict';

const express = require('express');
const morgan = require('morgan');
const session = require('express-session'); // session middleware

const passport = require('passport');
const passportLocal = require('passport-local');
const userDao = require('./user-dao');

const { check, validationResult } = require('express-validator');

const port = 3001;

passport.use(new passportLocal.Strategy((username, password, done) => {
  userDao.getUser(username, password).then(user => {
      if (user) {
          done(null, user);
      }
      else {
          done(null, false, { message: 'Username or password wrong' });
      }
  }).catch(err => {
      done(err);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
      .then(user => {
          done(null, user);
      }).catch(err => {
          done(err, null);
      });
});

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
      return next();

  return res.status(401).json({ error: 'Not authenticated.' });
};

app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

/*** Admins APIs ***/

// POST /sessions 
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.status(401).json(info);
      }
      req.login(user, (err) => {
          if (err) {
              return next(err);
          }
          return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
  }
  else
      res.status(401).json({ error: 'Unauthenticated user!' });;
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});