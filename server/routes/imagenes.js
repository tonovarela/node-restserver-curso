const express = require("express");


const fs = require("fs");
const path = require('path');

let app = express();

const { verificaTokenImg } = require("../middleware/autenticacion");

app.get('/imagen/:tipo/:img',verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../..//uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImgPath = path.resolve(__dirname, "../assets/no-image.jpg")
        res.sendFile(noImgPath);
    }


});


module.exports = app;