
const jwt = require("jsonwebtoken");

//========
//Verificar Token
//========

let verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decode.usuario;
        next();

    });


}




let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario.role );
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: "No tienes los privilegios suficientes"
            }
        });

    }

    // let token = req.get('token');
    // jwt.verify(token, process.env.SEED, (err, decode) => {
    //     if (err) {
    //         return res.status(401).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     req.usuario=decode.usuario;
    //     next();

    // });


}

module.exports = {
    verificarToken,
    verificaAdmin_Role
}