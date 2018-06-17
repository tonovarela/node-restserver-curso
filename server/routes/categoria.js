const express = require('express');
const _ = require("underscore");


let { verificarToken, verificaAdmin_Role } = require("../middleware/autenticacion");

let app = express();

let Categoria = require('../models/categoria');



//Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias

            });
        });

});

//Mostra una categoria por id
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El Id no es correcto"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

//Crear nueva categoria
app.post('/categoria', verificarToken, (req, res) => {


    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false, err
            });
        }
        if (categoriaDB == null) {
            return res.status(400).json({
                ok: false, err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });






    });

});

//Actualiza la categoria
app.put('/categoria/:id', verificarToken, (req, res) => {
    //Solo un administrador puede actualizar categorias
    //Categorias 


    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    let descCategoria = {
        descripcion: body.descripcion
    };


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no Encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: categoriaBorrado
        });


    });

});





module.exports = app;