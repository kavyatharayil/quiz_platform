const { z } = require('zod');

const createQuestion = z.object({
  body: z.object({
    section: z.string().optional(),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
      })
    ).min(2, 'At least 2 options are required'),
    correctAnswer: z.string().min(1),
    marks: z.number().int().positive(),
  }),
});

const updateQuestion = z.object({
  body: z.object({
    section: z.string().optional(),
    question: z.string().min(1).optional(),
    options: z.array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
      })
    ).min(2).optional(),
    correctAnswer: z.string().min(1).optional(),
    marks: z.number().int().positive().optional(),
  }),
});

module.exports = {
  createQuestion,
  updateQuestion,
};
