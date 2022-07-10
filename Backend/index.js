'use strict'

const mongoose = require('mongoose');
const app = require('./app')
const port = 3900
const url = 'mongodb://localhost:27017/api_rest_blog' ;
const options = { useNewUrlParser : true };

mongoose.Promise = global.Promise;
mongoose.connect(url, options).then(()=> {
    console.log('Conexion Exitosa...');
    //Crear servidor:
    app.listen(port, ()=>{
        console.log("Servidor corriendo en http://localhost:"+port);
    });
});