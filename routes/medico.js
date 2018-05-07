var express = require('express');

var mdAuthentication = require('../middlewares/auth');

var app = express();

var Medico = require('../models/medico');

/// obteniendo medicos
app.get('/', (req, res, next) => {

  var offset = req.query.offset || 0;

  Medico.find({})
    .skip(offset)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(
      (err, medicos) => {
        if (err) {
          res.status(500).json({
              ok: false,
              message: 'Error obteniendo los medicos',
              errors: err
            });
          return;
        }

        Medico.count({}, (err, count) => {
          if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error obteniendo los medicos',
                errors: err
              });
            return;
          }

          res.status(200).json({
            'ok': true,
            'medicos': medicos,
            'total': count
          });
        });
      }
    );

});

/// crear medico
app.post('/', mdAuthentication.verificarToken, (req, res, next) => {
  var body = req.body;
  var currentUser = req.usuario;

  var medico = new Medico({
    'nombre': body.nombre,
    'image': body.image,
    'usuario': currentUser._id,
    'hospital': body.hospital
  });

  medico.save(
    (err, medicoGuardado) => {
      if (err) {
        res.status(400).json({
            ok: false,
            message: 'Error creando el medico',
            errors: err
          });
        return;
      }

      res.status(201).json({
        'ok': true,
        'medico': medicoGuardado,
        'payload': currentUser
      });
    }
  );

});

/// actualizar medico
app.put('/:id', mdAuthentication.verificarToken, (req, res, next) => {
  var body = req.body;
  var id = req.params.id;
  var currentUser = req.usuario;

  Medico.findById(id, (err, medico) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error obteniendo el medico',
          errors: err
        });
      return;
    }

    if (!medico) {
      res.status(400).json({
          ok: false,
          message: `El medico con el ID# ${id} no existe`
        });
      return;
    }

    medico.nombre = body.nombre;
    medico.image = body.image;
    medico.hospital = body.hospital;
    medico.usuario = currentUser._id;
    medico.save(
      (err, medicoGuardado) => {
        if (err) {
          res.status(400).json({
              ok: false,
              message: 'Error actualizando el medico',
              errors: err
            });
          return;
        }

        res.status(201).json({
          'ok': true,
          'medico': medicoGuardado
        });
      }
    );
  });
});

/// eliminar usuario
app.delete('/:id', mdAuthentication.verificarToken, (req, res, next) => {
  console.log('test');
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error obteniendo el medico',
          errors: err
        });
      return;
    }

    if (!medicoBorrado) {
      res.status(400).json({
          ok: false,
          message: `El medico con el ID# ${id} no existe`
        });
      return;
    }

    res.status(200).json({
      'ok': true,
      'medico': medicoBorrado
    });
  });

});

module.exports = app;
