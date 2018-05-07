var express = require('express');

var mdAuthentication = require('../middlewares/auth');

var app = express();

var Hospital = require('../models/hospital');

/// obteniendo hospitales
app.get('/', (req, res, next) => {

  var offset = req.query.offset || 0;

  Hospital.find({})
    .skip(offset)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(
      (err, hospitales) => {
        if (err) {
          res.status(500).json({
              ok: false,
              message: 'Error obteniendo los hospitales',
              errors: err
            });
          return;
        }

        Hospital.count({}, (err, count) => {
          if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error obteniendo los hospitales',
                errors: err
              });
            return;
          }

          res.status(200).json({
            'ok': true,
            'hospitales': hospitales,
            'total': count
          });
        });
      }
    );

});

/// crear hospital
app.post('/', mdAuthentication.verificarToken, (req, res, next) => {
  var body = req.body;
  var currentUser = req.usuario;

  var hospital = new Hospital({
    'nombre': body.nombre,
    'image': body.image,
    'usuario': currentUser._id
  });

  hospital.save(
    (err, hospitalGuardado) => {
      if (err) {
        res.status(400).json({
            ok: false,
            message: 'Error creando el hospital',
            errors: err
          });
        return;
      }

      res.status(201).json({
        'ok': true,
        'hospital': hospitalGuardado,
        'payload': currentUser
      });
    }
  );

});

/// actualizar hospital
app.put('/:id', mdAuthentication.verificarToken, (req, res, next) => {
  var body = req.body;
  var id = req.params.id;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error obteniendo el hospital',
          errors: err
        });
      return;
    }

    if (!hospital) {
      res.status(400).json({
          ok: false,
          message: `El hospital con el ID# ${id} no existe`,
          errors: {
            message: 'no existe un hospital con ese ID'
          }
        });
      return;
    }

    hospital.nombre = body.nombre;
    hospital.image = body.image;
    hospital.usuario = req.usuario._id;

    hospital.save(
      (err, hospitalGuardado) => {
        if (err) {
          res.status(400).json({
              ok: false,
              message: 'Error actualizando el hospital',
              errors: err
            });
          return;
        }

        hospitalGuardado.password = null;

        res.status(201).json({
          'ok': true,
          'hospital': hospitalGuardado
        });
      }
    );
  });
});

/// eliminar usuario
app.delete('/:id', mdAuthentication.verificarToken, (req, res, next) => {
  console.log('test');
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error obteniendo el hospital',
          errors: err
        });
      return;
    }

    if (!hospitalBorrado) {
      res.status(400).json({
          ok: false,
          message: `El hospital con el ID# ${id} no existe`
        });
      return;
    }

    res.status(200).json({
      'ok': true,
      'hospital': hospitalBorrado
    });
  });

});

module.exports = app;
