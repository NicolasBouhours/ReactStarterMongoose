const nodemailer = require('nodemailer')
const SMTP_INFO = require('../../../config/const').SMTP

function sendForgotPasswordEmail(host, token, email, firstname, lastname) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport(SMTP_INFO);

    let mailOptions = {
        from: '"Kat" <nicolas.bouhours5396@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Kat : Réintialisation de mot de passe', // Subject line
        /*text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'*/
        html: '<html><head><link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"><style>html{text-align: center} .btn{color:#00d1b2;text-decoration:none}</style></head>' +
        '<h3> Bonjour ' + firstname + ' ' + lastname + '</h3>' +
        '<p>Vous avez récemment fait une demande de réinitialisation de mot de passe.</p><p>Merci de cliquer sur le lien ci-dessous pour choisir votre nouveau mot de passe</p>' +
        '<a class="btn" href="http://'+ host +'/api/auth/reset/' + token +'">Réinitiliser mon mot de passe</a></html>'
    }

    transporter.sendMail(mailOptions, (err, mail) => {
        if(err){
            reject(err)
        }
        console.log(mail)
        resolve(mail)
    })
  })
}

module.exports = { sendForgotPasswordEmail }
