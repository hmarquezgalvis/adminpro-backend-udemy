// requires
var express = require('express');
var mongoose = require('mongoose');

// inicializacion de variables
var app = express();

// conexion a la base de datos
mongoose.connection.openUri('mongodb+srv://adminProUser:5ecXLiVUI9YbMf7r@clustergdicto-mqcsb.mongodb.net/hospitalDB',
  (err, res) => {
    if (err) {
      throw err;
    }
    console.log('MongoDB: \x1b[42m\x1b[30m%s\x1b[0m', 'CONECTADO');
  });

// rutas
app.get('/', (req, res, next) => {
  res.status(200).json({
    ok: true,
    message: 'Peticion realizada correctamente'
  });
});

// escuchar peticiones
app.listen(3000, () => {
  console.log('Node Express >> puerto:3000 \x1b[42m\x1b[30m%s\x1b[0m', 'ONLINE');
});
