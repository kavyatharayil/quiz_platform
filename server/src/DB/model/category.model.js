const mongoose = require('mongoose');
const categorySchema = require('../schema/category.schema');

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
