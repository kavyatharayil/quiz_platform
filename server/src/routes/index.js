const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const quizRoutes = require('../modules/quizzes/quiz.routes');
const questionRoutes = require('../modules/questions/question.routes');
const userRoutes = require('../modules/users/user.routes');
const resultRoutes = require('../modules/results/result.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const roleRoutes = require('../modules/roles/role.routes');
const reportRoutes = require('../modules/reports/report.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/questions', questionRoutes);
router.use('/users', userRoutes);
router.use('/results', resultRoutes);
router.use('/categories', categoryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', roleRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
