const { z } = require('zod');

const createQuiz = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    duration: z.number().int().positive('Duration must be a positive number'),
    totalMarks: z.number().int().positive('Total marks must be a positive number'),
    category: z.string().optional(),
    type: z.enum(['IT', 'Non-IT']).optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    isPublished: z.boolean().optional(),
  }),
});

const updateQuiz = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    duration: z.number().int().positive().optional(),
    totalMarks: z.number().int().positive().optional(),
    category: z.string().optional(),
    type: z.enum(['IT', 'Non-IT']).optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    isPublished: z.boolean().optional(),
  }),
});

module.exports = {
  createQuiz,
  updateQuiz,
};
