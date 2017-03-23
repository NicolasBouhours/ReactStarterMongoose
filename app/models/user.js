module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {type: DataTypes.STRING(80), unique: true},
    firstname: {type: DataTypes.STRING(50), allowNull: false},
    lastname: {type: DataTypes.STRING(50), allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    reset_token: {type: DataTypes.STRING},
    reset_token_expire: {type: DataTypes.DATE}
  }, {
      freezeTableName: true,
      instanceMethods: {
        toJSON: function() {
          let user = this.dataValues
          delete user.password
          delete reset_token
          delete reset_token_expire
          return user
        }
      }
  })

  return User
}
