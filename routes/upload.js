var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  var tiposValid = ['hospitales', 'medicos', 'usuarios'];
  if (tiposValid.indexOf(tipo) < 0) {
    res.status(400).json({
        ok: false,
        message: 'Tipo de coleccion no valida',
        errors: {
          message: 'Tipo de coleccion no valida'
        }
      });
    return;
  }

  if (!req.files) {
    res.status(400).json({
        ok: false,
        message: 'No selecciono ningun archivo para subir',
        errors: {
          message: 'Debe de seleccionar una imagen'
        }
      });
    return;
  }

  // obtener nombre del archivo
  var archivo = req.files.image;
  var fileNameArray = archivo.name.split('.');
  var fileExtension = fileNameArray[fileNameArray.length - 1];

  // solo estas extensiones son permitidas
  var extensionsValid = ['png', 'jpg', 'gif', 'jpg'];
  if (extensionsValid.indexOf(fileExtension) < 0) {
    res.status(400).json({
        ok: false,
        message: 'Extension no valida',
        errors: {
          message: 'El archivo debe ser una imagen con extension: ' + extensionsValid.join(', ')
        }
      });
    return;
  }

  // nombre de archivo personalizado
  var nombreArchivo = `${id}-${new Date().getTime()}.${fileExtension}`;

  // mover el archivo del folder temporal a un path especifico
  var path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, (err) => {
    if (err) {
      res.status(500).json({
          ok: false,
          message: 'Error al mover el archivo',
          errors: err
        });
      return;
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, filename, res) {
  switch(tipo) {
    case 'usuarios':
      Usuario.findById(id, (err, usuario) => {
        if (!usuario) {
          res.status(400).json({
              ok: false,
              message: 'Usuario ID no valido',
              errors: {
                message: 'El Id del usuario debe existir'
              }
            });
          return;
        }

        var pathViejo = './uploads/usuarios/' + usuario.image;

        // si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        usuario.image = filename;
        usuario.save(
          (err, usuarioActualizado) => {
            usuario.password = null;
            res.status(200).json({
              ok: true,
              message: `Imagen de usuario actualizada`,
              'usuario': usuarioActualizado
            });
            return;
          }
        );

      });
      break;
    case 'medicos':
      Medico.findById(id, (err, medico) => {
        if (!medico) {
          res.status(400).json({
              ok: false,
              message: 'Medico Id no valido',
              errors: {
                message: 'El Id del medico debe existir'
              }
            });
          return;
        }

        var pathViejo = './uploads/medicos/' + medico.image;

        // si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        medico.image = filename;
        medico.save(
          (err, medicoActualizado) => {
            res.status(200).json({
              ok: true,
              message: `Imagen de medico actualizada`,
              'medico': medicoActualizado
            });
            return;
          }
        );

      });
      break;
    case 'hospitales':
      Hospital.findById(id, (err, hospital) => {
        if (!hospital) {
          res.status(400).json({
              ok: false,
              message: 'Hospital Id no valido',
              errors: {
                message: 'El Id del hospital debe existir'
              }
            });
          return;
        }

        var pathViejo = './uploads/hospitales/' + hospital.image;

        // si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        hospital.image = filename;
        hospital.save(
          (err, hospitalActualizado) => {
            res.status(200).json({
              ok: true,
              message: `Imagen de hospital actualizada`,
              'hospital': hospitalActualizado
            });
            return;
          }
        );

      });
      break;
  }
}

module.exports = app;
