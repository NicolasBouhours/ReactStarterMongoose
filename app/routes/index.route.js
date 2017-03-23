const express = require('express')

const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')

const router = express.Router()

// Get API routes
router.use('/auth', authRoutes)
router.use('/user', userRoutes)

router.get('/', (req, res, next) => {
  res.send('Index route')
})

module.exports = router
