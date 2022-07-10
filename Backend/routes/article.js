'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir : './upload/articles'});

//rutas de prueba
router.get('/datos-curso', ArticleController.datoscurso);
router.get('/test-de-controlador', ArticleController.test);

//rutas Productivas
router.post('/save-article', ArticleController.saveArticle);
router.get('/get-articles/:last?', ArticleController.getArticles);
router.get('/get-article/:id', ArticleController.getArticle);
router.put('/update-article/:id', ArticleController.updateArticle);
router.delete('/delete-article/:id', ArticleController.deleteArticle);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImageArticle);
router.get('/search/:search', ArticleController.searchArticle);


module.exports = router;