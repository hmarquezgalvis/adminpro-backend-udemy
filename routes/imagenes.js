var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:imageName', (req, res, next) => {
  var tipo = req.params.tipo;
  var imageName = req.params.imageName;

  var pathImage = path.resolve( __dirname, `../uploads/${tipo}/${imageName}`);

  if (fs.existsSync(pathImage)) {
    res.sendFile( pathImage );
  } else {
    var pathNoImage = path.resolve( __dirname, `../assets/no-img.jpg`);
    res.sendFile( pathNoImage );
  }
});

module.exports = app;
