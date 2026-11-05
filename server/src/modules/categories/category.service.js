const Category = require('../../DB/model/category.model');
const Quiz = require('../../DB/model/quiz.model');
const ApiError = require('../../utils/ApiError');

const getAllCategories = async () => {
  const categories = await Category.find().lean();
  
  // Attach quiz count
  for (const cat of categories) {
    cat.quizCount = await Quiz.countDocuments({ category: cat.name });
  }
  
  return categories;
};

const createCategory = async (categoryBody) => {
  if (await Category.findOne({ name: categoryBody.name })) {
    throw new ApiError(400, 'Category already exists');
  }
  return await Category.create(categoryBody);
};

const updateCategory = async (id, categoryBody) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if name is changing and already exists
  if (categoryBody.name && categoryBody.name !== category.name) {
    if (await Category.findOne({ name: categoryBody.name })) {
      throw new ApiError(400, 'Category name already exists');
    }
    // Update all quizzes with this category
    await Quiz.updateMany({ category: category.name }, { category: categoryBody.name });
  }

  Object.assign(category, categoryBody);
  await category.save();
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  
  // Uncategorize quizzes
  await Quiz.updateMany({ category: category.name }, { category: 'General' });
  
  await category.deleteOne();
  return category;
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
