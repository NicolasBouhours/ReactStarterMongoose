const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models').User
const config = require('../../config/const')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.SECRET
}

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exist in the database
  // If it does, call 'done' with that other
  // otherwise, call done with user object
  console.log('payload new', payload)
  User.findById(payload.data)
    .then((user) => {
      if (!user) {
        return done(null, false)
      }

      return done(null, user)
    })
    .catch((err) => { return done(err, false) })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
