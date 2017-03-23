const models   = require('../models')
const handle = require('../utils/handle')

function getProfile(req, res, next) {
  const user = req.user
  return res.json(user.toJSON())
}

function updateProfile(req, res, next) {
  let user = req.user
  let { firstname, lastname } = req.body

  if(!firstname || !lastname) {
    handle.handleError(res, 'Veuillez renseigner tout les champs requis')
    return false
  }

  user.update({ firstname, lastname })
    .then((user) => handle.handleSuccess(res, 'Utilisateur mis a jour avec succès', user.toJSON()))
    .catch((err) => handle.handleError(res, 'Impossible de mettre à jour l\'utilisateur', err))
}

module.exports = { getProfile, updateProfile }
