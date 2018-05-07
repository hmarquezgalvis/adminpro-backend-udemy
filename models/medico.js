var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


//se crea el schema de usuario
var medicochema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  image: { type: String, required: false },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});

module.exports = mongoose.model('Medico', medicochema);
