const express = require('express')

const authController = require('../controllers/auth.controller')
const passportService = require('../services/passport')
const passport = require('passport')

const router = express.Router()
const requireAuth = passport.authenticate('jwt', { session: false })

// Get API routes
router.post('/signin', authController.signin)

router.post('/signup', authController.signup)

router.put('/password', requireAuth, authController.updatePassword)

router.post('/forgot', authController.forgotPassword)

router.post('/reset', authController.resetPassword)

router.post('/test', requireAuth, (req, res, next) => {
  console.log(req.user)
  return res.json('hola')
})

module.exports = router
