const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')
const crypto = require('crypto')

const config = require('../../config/const')
const handle = require('../utils/handle')
const models   = require('../models')
const authMailService = require('../services/mailer/auth.mail')

// ## Sign in models.User
function signin(req, res, next) {
  const { email, password } = req.body

  // Check if email and password are send
  if (!email || !password) {
    handle.handleError(res, 'Veuillez renseigner un email et un mot de passe', err)
    return false
  }

  // Find user on database
  models.User.findOne({ email: email})
  .then((user) => {

    // Si aucun utilisateur existe
    if (!user) {
      handle.handleError(res, 'Aucun utilisateur n\'existe pour ces identifiants')
      return false
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        // create token
        const token = jwt.sign({ data: user.id }, config.SECRET, {
           expiresIn: '72h'
        })

        res.json({ success: true, message: 'Connexion effectuée avec succès', token })
      } else {
        handle.handleError(res, 'Mauvais mot de passe')
      }
    })
  })
  .catch(err => handle.handleError(res, 'Impossible d\'effectuer la connexion', err))
}

// ## Sign up User
function signup(req, res, next) {
  const { email, password, firstname, lastname } = req.body

  // Check if all field are send
  if (!email || !password || !firstname || !lastname) {
    handle.handleError(res, 'Veuillez renseigner tout les champs requis')
    return false
  }

  // Find user on database
  models.User.findOne({ email: email})
  .then((user) => {

    // Si aucun utilisateur existe
    if (user) {
      handle.handleError(res, 'Un utilisateur existe déja pour cet email')
      return false
    }

    bcrypt.hash(password, config.SALT_ROUNDS, (err, hash) => {

        if (hash) {
          // Save user
          models.User.create({
            email, firstname, lastname, password: hash
          })
          .then(usr => handle.handleSuccess(res, 'Utilisateur crée avec succès'))
          .catch(err => handle.handleError(res, 'Impossible d\'effectuer la création de compte', err))
          return
        }

        handle.handleError(res, 'Impossible d\'effectuer la création de compte', err)
    })
  })
  .catch(err => handle.handleError(res, 'Impossible d\'effectuer la création de compte', err))
}

// ## Update user password
function updatePassword(req, res, next) {
  let user = req.user

  // Compare existing password
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    handle.handleError(res, 'Le mot de passe ne correspond pas a l\'actuel mot de passe')
    return false
  }

  // Check if new passord are equal
  if (req.body.newPassword !== req.body.newConfirmPassword) {
    handle.handleError(res, 'Les deux mots de passe ne sont pas identiques')
    return false
  }

  // Crypt new password
  bcrypt.hash(req.body.newPassword, config.SALT_ROUNDS, (err, hash) => {
      if (!hash) {
        handle.handleError(res, 'Impossible d\'effectuer la création de compte', err)
        return false
      }

      // Update entity on database
      user.update({ password: hash})
        .then((user) => handle.handleSuccess(res, 'Mot de passe modifié avec succès'))
        .catch((err) => handle.handleError(res, 'Les deux mots de passe ne sont pas identiques', err))
  })
}

function forgotPassword(req, res, next) {

  const { email } = req.body

  // Find user
  models.User.findOne({ email: email})
  .then((user) => {
    // If this user not exist
    if (!user) {
      handle.handleError(res, 'Aucun compte avec cet email n\'a été trouvé')
      return false
    }

    // Create a token
    crypto.randomBytes(48, (err, buffer) => {
      if (err) {
        handle.handleError(res, 'Une erreur est survenue')
        return false
      }

      const token = buffer.toString('hex')
      const token_expiration = Date.now() + config.RESET_PASSWORD_VALIDITY

      console.log('token_expiration', token_expiration)

      // Update user with new token informations
      user.update({
        reset_token: token,
        reset_token_expire: token_expiration
      })
      .then((user) => {
        // Send email
        authMailService.sendForgotPasswordEmail(req.headers.host, token, user.email, user.firstname, user.lastname)
          .then((mail) => handle.handleSuccess(res, 'Un email vous à été envoyé vous permettant de réinitialiser votre mot de passe'))
          .catch(err => handle.handleError(res, 'Impossible d\'envoyer l\'email de réinitialisation', err))
      })
      .catch(err => handle.handleError(res, 'Impossible de mettre à jour l\'utilisateur', err))
    })
  })
  .catch(err => handle.handleError(res, 'Impossible de récupèrer les informations de l\'utilisateur', err))
}

function resetPassword(req, res) {

  const { token, password, confirmPassword } = req.body

  // Check if all info required are present
  if (!token || !password || !confirmPassword) {
    handle.handleError(res, 'Veuillez renseigner le nouveau mot de passe')
    return false
  }

  // Check if password and confirm password are okay
  if (password !== confirmPassword) {
    handle.handleError(res, 'Vos deux mot de passe doivent être identique')
    return false
  }

  // Check if token are fine and not expired
  models.User.findOne({
    where : {
      reset_token: token,
      reset_token_expire: { $gte: new Date() }
    }
  })
  .then((user) => {
    // Crypt new password
    bcrypt.hash(password, config.SALT_ROUNDS, (err, hash) => {
        if (!hash) {
          handle.handleError(res, 'Impossible d\'effectuer de réinitialiser le mot de passe', err)
          return false
        }

        // Update entity on database
        user.update({ password: hash})
          .then((user) => handle.handleSuccess(res, 'Mot de passe modifié avec succès'))
          .catch((err) => handle.handleError(res, 'Erreur lors de la modification de mot de passe', err))
    })
  })
  .catch(err => handle.handleError(res, 'Impossible de récupèrer les informations de l\'utilisateur', err))
}

module.exports = { signin, signup, updatePassword, forgotPassword, resetPassword }
