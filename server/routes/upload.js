const express = require('express');

const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');


const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
//Default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ningun archivo"
            }
        });
    }

    //Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Los tipos permitidos son " + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    console.log(archivo);
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Las extensiones permitidas son " + extensionesValidas.join(", ")
            }
        });
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo == "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        }
        if (tipo == "productos") {
            imagenProducto(id, res, nombreArchivo);
        }


    });

});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: true,
                err
            });

        }
        if (!usuarioDB) {
            if (err) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(500).json({
                    ok: true,
                    err: "usuario no existe"
                });
            }

        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: true,
                err
            });

        }
        if (!productoDB) {
            if (err) {
                borraArchivo(nombreArchivo, 'productos');
                return res.status(500).json({
                    ok: true,
                    err: "producto no existe"
                });
            }

        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });
}


function borraArchivo(nombreImagen, tipo) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}



module.exports = app;
