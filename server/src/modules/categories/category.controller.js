const asyncHandler = require('../../utils/asyncHandler');
const categoryService = require('./category.service');
const ApiResponse = require('../../utils/ApiResponse');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.send(new ApiResponse(200, 'Categories retrieved successfully', categories));
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).send(new ApiResponse(201, 'Category created successfully', category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.send(new ApiResponse(200, 'Category updated successfully', category));
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.send(new ApiResponse(200, 'Category deleted successfully', null));
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
