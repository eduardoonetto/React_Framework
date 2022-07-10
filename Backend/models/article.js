'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title   : String,
    content : String,
    image   : String,
    date    : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);

