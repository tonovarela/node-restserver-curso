const express = require("express");
const app = express();

const _ = require("underscore");

const bcryt = require('bcrypt');

const Usuario = require('../models/usuario');

app.get("/usuario", (req, res) => {

     let predicado={estado:true};
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);

    Usuario.find(predicado, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count(predicado, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            });

        });

});

app.post("/usuario", (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password=null;
        res.json({
            usuario: UsuarioDB
        });
    });
    // if (body.ocupacion === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "La ocupacion es necesario"
    //     })
    // }
    // res.json({
    //     persona: body
    // });
});

app.put("/usuario/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.delete("/usuario/:id", (req, res) => {
    let id = req.params.id;

    let cambia = { estado: false };

    // Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err:{
    //                 message:"Usuario no Encontrado"
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });


    // });

    Usuario.findByIdAndUpdate(id, cambia, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no Encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



   

});

module.exports = app;