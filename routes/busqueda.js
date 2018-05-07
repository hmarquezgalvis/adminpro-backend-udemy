var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/// busqueda por coleccion
app.get('/coleccion/:tabla/:termino', (req, res, next) => {
  var tabla = req.params.tabla;
  var termino = req.params.termino;
  var regex = new RegExp(termino, 'i');
  var promesa;

  switch (tabla) {
    case 'hospitales':
      promesa = buscarHospitales(termino, regex);
      break;
    case 'medicos':
      promesa = buscarMedicos(termino, regex);
      break;
    case 'usuarios':
      promesa= buscarUsuarios(termino, regex);
      break;
    default:
      res.status(500).json({
          ok: false,
          message: 'Los tipos de busqueda validos son: usuarios, hospitales y medicos.',
          errors: {
            message: 'tipo de table/coleccion no valida.'
          }
        });
      return;
      break;
  }

  promesa.then(results => {
    res.status(200).json({
      'ok': true,
      [tabla]: results,
    });
  }).catch( err => {
    res.status(500).json({
        ok: false,
        message: 'Error realizando la busqueda',
        errors: err
      });
  });
});

/// busqueda general
app.get('/todo/:termino', (req, res, next) => {

  var termino = req.params.termino;
  var regex = new RegExp(termino, 'i');

  Promise.all([
      buscarHospitales(termino, regex),
      buscarMedicos(termino, regex),
      buscarUsuarios(termino, regex)
    ]).then(
      results => {
        let [ hospitales, medicos, usuarios ] = results;

        res.status(200).json({
          'ok': true,
          'hospitales': hospitales,
          'medicos': medicos,
          'usuarios': usuarios
        });
      }
    ).catch( err => {
      res.status(500).json({
          ok: false,
          message: 'Error realizando la busqueda',
          errors: err
        });
    });

});

/// metodos

function buscarHospitales( termino, regex) {
  return new Promise(
    (resolve, reject) => {
      Hospital.find({ 'nombre': regex })
        .populate('usuario', 'nombre email')
        .exec(
          (err, hospitales) => {
            if (err) {
              reject(err);
            } else {
              resolve(hospitales);
            }
          });
    }
  )
}

function buscarMedicos( termino, regex) {
  return new Promise(
    (resolve, reject) => {
      Medico.find({ 'nombre': regex })
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
          (err, medicos) => {
            if (err) {
              reject(err);
            } else {
              resolve(medicos);
            }
          });
    }
  )
}

function buscarUsuarios( termino, regex) {
  return new Promise(
    (resolve, reject) => {
      Usuario.find({}, 'nombre email role')
        .or([ { 'nombre': regex}, { 'email': regex }])
        .exec(
          (err, usuarios) => {
            if (err) {
              reject(err);
            } else {
              resolve(usuarios);
            }
          });
    }
  )
}

module.exports = app;
