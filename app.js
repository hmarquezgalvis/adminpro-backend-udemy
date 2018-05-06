// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// inicializacion de variables
var app = express();

// configuracion de body-parser para crear el JSON basado en los datos del x-www-form-unlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// conexion a la base de datos
mongoose.connection.openUri('mongodb://adminProUser:5ecXLiVUI9YbMf7r@127.0.0.1:27017/hospitalDB',
  (err, res) => {
    if (err) {
      throw err;
    }
    console.log('MongoDB: \x1b[42m\x1b[30m%s\x1b[0m', 'CONECTADO');
  });

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3000, () => {
  console.log('Node Express >> puerto:3000 \x1b[42m\x1b[30m%s\x1b[0m', 'ONLINE');
});
