const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const sequelize = require('sequelize')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const join = require('join')
const bluebird = require('bluebird')
const User = require('./app/models/user')

const { WEB_PORT, ENV } = require('./config/const')
const routes = require('./app/routes/index.route')

const app = express()

app.use(compression())

// Static file middleware
app.use('/static', express.static(__dirname + '/public'))

// Desactivate log if test environment
if (ENV !== 'test') app.use(morgan('tiny'))

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/api', routes)

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${ENV}.`)
})
