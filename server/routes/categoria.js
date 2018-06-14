const express=require('express');

let {verificarToken}=require("../middleware/autenticacion");

let app=express();

let Categoria=require('../models/categoria');



//Mostrar todas las categorias
app.get('categoria', (req, res) => {


});



module.exports=app;