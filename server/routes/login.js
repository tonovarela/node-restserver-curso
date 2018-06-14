const express = require("express");
const app = express();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



const jwt = require("jsonwebtoken");

const Usuario = require('../models/usuario');

const bcryt = require('bcrypt');

app.post("/login", (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: "(Usuario) o contraseña incorrecto" }
            });
        }

        if (!bcryt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: "Usuario o (contraseña) incorrecto" }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB.usuario,
            token
        });

    });



});

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // console.log(payload.name);
    // console.log(payload.picture);
    // console.log(payload.email);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}







app.post("/google", async (req, res) => {
    let token = req.body.idtoken;
    let googleuser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e

            });
        }
        );

    Usuario.findOne({ email: googleuser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: { message: "Debe usar su autenticacion normal" }
                });

            } else {
                let token = jwt.sign({ usuario: usuarioDB },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN }
                );
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //Si el usuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre= googleuser.nombre;
            usuario.email = googleuser.email;
            usuario.img = googleuser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                       
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    usuario: usuarioDB,
                    mensaje: "desde el servidor",
                    ok:true,
                });


            });


        }
    });

    // return res.json({
    //     usuario: googleuser,
    //     mensaje: "desde el servidor"
    // });
});

module.exports = app;