const express = require('express')

const userController = require('../controllers/user.controller')
const passportService = require('../services/passport')
const passport = require('passport')

const router = express.Router()
const requireAuth = passport.authenticate('jwt', { session: false })

router.get('/profile', requireAuth, userController.getProfile)

router.put('/profile', requireAuth, userController.updateProfile)

module.exports = router
