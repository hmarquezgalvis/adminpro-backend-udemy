var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// google
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


// autenticacion con google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  // return payload;
  return {
    nombre: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res, next) => {
  var token = req.body.token;

  var google_user = await verify(token)
    .catch( err => {
      res.status(500).json({
          ok: false,
          message: 'Error al buscar el usuario'
        });
      return;
    });

  Usuario.findOne({ email: google_user.email}, (err, usuario) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error al buscar el usuario',
          errors: err
        });
      return;
    }

    if (usuario) {
      if (usuario.google === false) {
        res.status(400).json({
            ok: false,
            message: 'Debe de usar su autenticacion normal'
          });
        return;
      } else {
        var token = jwt.sign({
            'usuario': usuario,
          }, SEED, {
            expiresIn: 14400
          });

        res.status(200).json({
          'ok': true,
          'mensaje': 'Login post correcto',
          'usuario': usuario,
          'token': token
        });
      }
    } else {
      var usuarioNuevo = new Usuario();
      usuarioNuevo.nombre = google_user.nombre;
      usuarioNuevo.email = google_user.email;
      usuarioNuevo.image = google_user.image;
      usuarioNuevo.google = true;
      usuarioNuevo.password = ':O';
      usuarioNuevo.save(
        (err, usuario) => {
          if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error al crear el usuario',
                errors: err
              });
            return;
          }

          var token = jwt.sign({
              'usuario': usuario,
            }, SEED, {
              expiresIn: 14400
            });

          res.status(200).json({
            'ok': true,
            'mensaje': 'Login post correcto',
            'usuario': usuario,
            'token': token
          });
        }
      );
    }
  });
});

// autenticacion normal
app.post('/', (req, res, next) => {

  let body = req.body;

  Usuario.findOne({
    email: body.email
  }, (err, usuario) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error al buscar el usuario'
        });
      return;
    }

    if (!usuario) {
      res.status(400).json({
          ok: false,
          message: `El usuario con el correo /${body.email}/ no existe`
        });
      return;
    }

    // compara la contraseña encriptada en la BD
    if (!bcrypt.compareSync( body.password, usuario.password)) {
      res.status(400).json({
          ok: false,
          message: 'La credenciales no son las correctas'
        });
      return;
    }

    // crear token de autenticacion { payload } . SEED . Expire
    usuario.password = null;
    var token = jwt.sign({
      'usuario': usuario,
    }, SEED, {
      expiresIn: 14400
    });

    res.status(200).json({
      'ok': true,
      'mensaje': 'Login post correcto',
      'usuario': usuario,
      'token': token
    });
  });

});

module.exports = app;
