var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


//se crea el schema de usuario
var hospitalSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  image: { type: String, required: false },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, {
  collection: 'hospitales'
});

module.exports = mongoose.model('Hospital', hospitalSchema);
