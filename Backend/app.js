'use strict'

// Cargar Modulos de Node para crear Servidor
let express = require('express');
let bodyParser = require('body-parser');

// Ejecutar Express (http)
var app = express();

// Cargar ficheros/rutas
let article_routes = require('./routes/article');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos a rutas
app.use('/api/v1', article_routes);

// Exportar Modulo (fichero actual)
module.exports = app;