require("./config/config");
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path= require("path");

const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/index'));

//Habilitar la carpeta public

app.use(express.static(path.resolve(__dirname,"../public")));
console.log(path.resolve(__dirname,"../public"));

mongoose.connect(process.env.urlDB, (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE")
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto " + process.env.PORT);
})