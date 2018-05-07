
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

/// middleware: verificar token
exports.verificarToken = (req, res, next) => {
  var token = req.query.token;

  jwt.verify( token, SEED, (err, decoded) => {
    if (err) {
      res.status(401).json({
        ok: false,
        message: 'Token no valido',
        errors: err
      });
      return;
    }

    //se coloca el payload en el request global, para que pueda ser usado en cualquier request
    req.usuario = decoded.usuario;

    //continuar con las siguientes operaciones
    next();

    // res.status(200).json({
    //   ok: true,
    //   'decoded': decoded
    // });
  });
};
