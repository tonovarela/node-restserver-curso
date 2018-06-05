const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un role válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email es necesario"]
    },
    password: {
        type: String,
        required: [true, "El password es necesario"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
         type: String, 
         required: false,
        default: 'USER_ROLE',
        enum:rolesValidos
     },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});
usuarioSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser unico"
});
usuarioSchema.methods.toJSON==function(){
    let user=this;
    let userObject=user.toJSON;
    delete userObject.password;
    return userObject;
}
module.exports = mongoose.model('Usuario', usuarioSchema);