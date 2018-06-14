
//=============
//  Puerto
//=============

process.env.PORT=process.env.PORT  ||  3000;

process.env.NODE_ENV=process.env.NODE_ENV || 'dev';

//=============
//  Vencimiento del Token
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
//=============
process.env.CADUCIDAD_TOKEN=process.env.CADUCIDAD_TOKEN || 60*60*24*30;

//========
// SEED de autenticacion
process.env.SEED=process.env.SEED || "Este-es-el-seed";
//=========

let urlDB;
if (process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
    urlDB=process.env.MONGO_URI;
}

process.env.urlDB=urlDB;

//==========
// Google Client id
//==========
process.env.CLIENT_ID=process.env.CLIENT_ID || "696338438250-ujk513bl88jrt828d73obv6lurfo3nl6.apps.googleusercontent.com"