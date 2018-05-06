var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
  values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
  message: '{VALUE} no es un role permitido'
};

//se crea el schema de usuario
var usuarioSchema = new Schema({
  nombre:   { type: String, required: [true, 'El nombre es necesario'] },
  email:    { type: String, unique: true, required: [true, 'El correo es necesario'] },
  password: { type: String, required: [true, 'La contraseña es necesaria'] },
  image:    { type: String, required: false },
  role:     { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser unico'
  }
);

//exporta el schema para que se pueda utilizar
module.exports = mongoose.model('Usuario', usuarioSchema);
