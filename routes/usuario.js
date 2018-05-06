var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/auth');

var app = express();

var Usuario = require('../models/usuario');

/// obteniendo usuarios
app.get('/', (req, res, next) => {

  Usuario.find({}, 'nombre email image role')
    .exec(
      (err, usuarios) => {
        if (err) {
          res.status(500).json({
              ok: false,
              message: 'Error obteniendo los usuarios',
              errors: err
            });
          return;
        }
        res.status(200).json({
          'ok': true,
          'usuarios': usuarios
        });
      }
    );

});

/// crear usuario
app.post('/', mdAuthentication.verificarToken, (req, res, next) => {
  var body = req.body;

  var usuario = new Usuario({
    'nombre': body.nombre,
    'email': body.email,
    'password': bcrypt.hashSync(body.password, 10),
    'image': body.image,
    'role': body.role
  });

  usuario.save(
    (err, usuarioGuardado) => {
      if (err) {
        res.status(400).json({
            ok: false,
            message: 'Error creando el usuario',
            errors: err
          });
        return;
      }

      res.status(201).json({
        'ok': true,
        'usuario': usuarioGuardado,
        'usuarioToken': req.usuario
      });
    }
  );

});

/// actualizar usuario
app.put('/:id', mdAuthentication.verificarToken, (req, res, next) => {
  var body = req.body;
  var id = req.params.id;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error obteniendo el usuario',
          errors: err
        });
      return;
    }

    if (!usuario) {
      res.status(400).json({
          ok: false,
          message: `El usuario con el ID# ${id} no existe`
        });
      return;
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;
    usuario.save(
      (err, usuarioGuardado) => {
        if (err) {
          res.status(400).json({
              ok: false,
              message: 'Error actualizando el usuario',
              errors: err
            });
          return;
        }

        usuarioGuardado.password = null;

        res.status(201).json({
          'ok': true,
          'usuario': usuarioGuardado
        });
      }
    );
  });
});

/// eliminar usuario
app.delete('/:id', mdAuthentication.verificarToken, (req, res, next) => {
  console.log('test');
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error obteniendo el usuario',
          errors: err
        });
      return;
    }

    if (!usuarioBorrado) {
      res.status(400).json({
          ok: false,
          message: `El usuario con el ID# ${id} no existe`
        });
      return;
    }

    res.status(200).json({
      'ok': true,
      'usuario': usuarioBorrado
    });
  });

});

module.exports = app;
