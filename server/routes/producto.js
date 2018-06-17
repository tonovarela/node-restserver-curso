const express = require('express');
let { verificarToken, verificaAdmin_Role } = require("../middleware/autenticacion");
let app = express();
let Producto = require('../models/producto');

//=========================
// Obtener todos los productos
//=======================

app.get('/producto', (req, res) => {
    //traer todos los productos
    //populate  usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos

            });
        });


});

//=========================
// Obtener un producto por id
//=======================

app.get('/producto/:id', (req, res) => {

    //populate  usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "El id del producto es incorrecto"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB

            });
        });


});


app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    res
                })
            }
            res.json({
                ok: true,
                productos
            });


        })

});

//=========================
// Crear un  nuevo producto
//=======================
app.post('/producto', verificarToken, (req, res) => {

    //Grabar el usuario
    //Grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                res
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

//=========================
// Actualizar un nuevo producto
//=======================


app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El ID no existe"
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });
}
);

//=========================
// Borrar un producto
//=======================
app.delete('/producto/:id', (req, res) => {

    //Disponible es falso
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Id del producto no existe"
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: "Producto Borrado"
            })

        });

    });

});


module.exports = app;