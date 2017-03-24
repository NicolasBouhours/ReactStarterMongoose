const WEB_PORT = process.env.PORT || 8000
const ENV = process.env.NODE_ENV || 'development'
const SECRET = 'mysupersecret53'
const TOKEN_EXPIRATION = 4320
const SALT_ROUNDS = 10
const MONGOOSE = '127.0.0.1:27017/kat'
const SMTP = 'smtps://nicolas.bouhours5396@gmail.com:nicodu5396@smtp.gmail.com'
const RESET_PASSWORD_VALIDITY = 7200000

module.exports = {
  WEB_PORT,
  ENV,
  SECRET,
  MONGOOSE,
  SALT_ROUNDS,
  SMTP,
  RESET_PASSWORD_VALIDITY
}
