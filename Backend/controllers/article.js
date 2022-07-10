'use strict'

var validator = require('validator');
var Article = require('../models/article')
var fs = require('fs');
var path = require('path');

let controller = {

    datoscurso: (req, res)=> {
        console.log(req.query.aaa);
        return res.status(200).send({
            curso : "Curso ReactJs",
            alumno : "Eduardo Onetto",
            url : "https://github.com/eduardoonetto"
        });
    
    },

    test: (req, res) => {
        return res.status(200).send({
            message : 'Soy la accion test de mi controlador de articulos'
        });
    },

    saveArticle: (req, res) => {
        //recoger Params:
        let Params = req.body;
        
        //Validar Datos:
        try{
            var validate_title = !validator.isEmpty(Params.title);
            var validate_content = !validator.isEmpty(Params.content);
            if(validate_title && validate_content){
                //Crear el objeto a guardar:
                var article = new Article();
                //Asignar Valores:
                article.title = Params.title;
                article.content = Params.content;
                article.image = null;
                //Guardar Articulo:
                article.save((err, articleStored) => {
                    if(err || !articleStored){
                        return res.status(400).send({
                            status  : 'OK',
                            message : 'El Articulo no se ha guardado.'
                        });
                    }
                    //devolver respuesta:
                    return res.status(200).send({
                        status  : 'OK',
                        article : articleStored
                    });

                });
            }else{
                return res.status(400).send({
                    status  : 'NOK',
                    message : 'Validacion incorrecta'
                });
            }
        }catch(err){
            console.log(err);
            return res.status(400).send({
                status  : 'NOK',
                message : 'Faltan Campos'
            });
        }

    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        console.log(last);
        if(last || last != undefined ){
            query.limit(2);
        }
        // buscar:
        query.sort('-_id').exec((err, articles) =>{
            if (err){
                return res.status(500).send({
                    status  : 'NOK',
                    message : 'Error al consultar coleccion'
                }); 
            }

            if(!articles){
                return res.status(404).send({
                    status  : 'NOK',
                    message : 'No hay Articulos'
                });
            }

            return res.status(200).send({
                status : 'OK',
                articles
            });
        });
        
    },

    getArticle: (req, res) => {

        //recoger id:
        var id = req.params.id
        //comprobar que existe:
        if(id || id != undefined ){
            //buscar el articulo:
            Article.findById(id,(err, articulo)=>{
                // Devolverlo en un json:
                if (err){
                    return res.status(500).send({
                        status : 'NOK',
                        message : 'Error en Motor'
                    });
                }
                if (!articulo){
                    return res.status(404).send({
                        status : 'NOK',
                        message : 'Articulo no encontrado'
                    });
                }
                return res.status(200).send({
                    status : 'OK',
                    articulo
                });
            });
        }else{
            return res.status(400).send({
                status : 'NOK',
                message : 'falta id de articulo'
            });
        }
        
    },

    updateArticle: (req, res) => {
        // Recoger id
        var articleId = req.params.id;

        // Recoger los datos que llegan por put:
        var params = req.body;

        // Validar datos:
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            if (validate_content && validate_title){
                Article.findByIdAndUpdate({_id : articleId}, params, {new:true}, (err, articleUpdated)=> {
                    if (err){
                        return res.status(500).send({
                            status : 'NOK',
                            message : 'Error al Actualizar'
                        });
                    }

                    if(!articleUpdated){
                        return res.status(400).send({
                            status : 'NOK',
                            message : 'No existe el Articulo'
                        });
                    }
                    
                    return res.status(200).send({
                        status : 'OK',
                        articleUpdated
                    });

                })
            }else{
                return res.status(400).send({
                    status : 'NOK',
                    message : 'Tiene campos Vacios'
                });
            }
        }catch(err){
            return res.status(400).send({
                status : 'NOK',
                message : 'falta campos de articulo'
            });
        }
    },
    deleteArticle: (req, res) => {
        var articleId = req.params.id;
        try{
            Article.findOneAndDelete({_id : articleId}, (err, articleRemoved)=> {
                if(err){
                    return res.status(500).send({
                        status : 'NOK',
                        message : 'Error al borrar'
                    });
                }

                if(!articleRemoved){
                    return res.status(400).send({
                        status : 'NOK',
                        message : 'No existe el Articulo'
                    });
                }

                return res.status(200).send({
                    status : 'OK',
                    articleRemoved
                });

            });
        }catch(err){
            return res.status(400).send({
                status : 'NOK',
                message : 'falta campos de articulo'
            });
        }
    },
    upload: (req, res) => {
        var articleId = req.params.id;
        // Recoger el fichero de la peticion
        var file_name = 'Imagen no subida';
        //console.log(req.files.file0);
        if (!req.files.file0){
            return res.status(400).send({
                status : 'NOK',
                message : file_name
            });
        }

        //conseguir nombre y extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var file_extension = file_name.split('\.')[1];

        //comprobar extension (solo images):
        const ext_allowed = ['png', 'jpg', 'jpeg', 'gif'];
        if (!ext_allowed.includes(file_extension)){
            //borrar archivo subido
            fs.unlink(file_path, (err)=>{
                
                return res.status(400).send({
                    status : 'NOK',
                    message : 'Imagen no valida'
                });
            });

        }else{
            //Buscar Articulo, asignar imagen, y actualizar:
            Article.findOneAndUpdate({_id : articleId}, {image : file_name}, {new:true}, (err, articleUpdated)=>{
                if (err){
                    return res.status(500).send({
                        status : 'NOK',
                        message : 'Error al Actualizar'
                    });
                }

                if(!articleUpdated){
                    return res.status(400).send({
                        status : 'NOK',
                        message : 'No existe el Articulo'
                    });
                }
                
                return res.status(200).send({
                    status : 'OK',
                    articleUpdated
                });
            });
        }
    },
    getImageArticle: (req, res) => {

        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        if(fs.existsSync(path_file)){
            return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(400).send({
                status : 'NOK',
                message : 'Imagen no existe'
            });
        }
    },

    searchArticle: (req, res) => {
        var searchString = req.params.search;

        Article.find({ "$or" : 
            [
                { "title" : { "$regex" : searchString, "$options": "i" }},
                { "content" : { "$regex" : searchString, "$options": "i" }}
            ]
        }).sort([['date', 'descending']])
        .exec((err, articulos)=>{
            if(err){
                return res.status(500).send({
                    status : 'NOK',
                    message : 'Error al borrar'
                });
            }

            if(!articulos || articulos.length <= 0){
                return res.status(400).send({
                    status : 'NOK',
                    message : 'No se encontraron articulos con: '+ searchString
                });
            }

            return res.status(200).send({
                status : 'OK',
                articulos
            });
        });
    }
    
        
}; //end controller

module.exports = controller;