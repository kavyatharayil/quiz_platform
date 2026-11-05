const { z } = require('zod');

const submitQuiz = z.object({
  body: z.object({
    attemptId: z.string().min(1, 'attemptId is required'),
    answers: z.array(
      z.object({
        questionId: z.string().min(1, 'questionId is required'),
        selectedAnswer: z.string().min(1, 'selectedAnswer is required'),
      })
    ),
  }),
});

module.exports = {
  submitQuiz,
};
