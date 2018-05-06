var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

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
