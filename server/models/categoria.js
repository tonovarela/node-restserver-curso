const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion  es necesario'],
        unique:true

    },
    usuario:{type: Schema.Types.ObjectId,ref:"Usuario"}

});

module.exports = mongoose.model('Categoria', categoriaSchema);