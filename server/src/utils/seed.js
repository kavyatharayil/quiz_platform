const mongoose = require('mongoose');
const User = require('../DB/model/user.model');
const Quiz = require('../DB/model/quiz.model');
const Question = require('../DB/model/question.model');
const Result = require('../DB/model/result.model');
const Category = require('../DB/model/category.model');
const config = require('../config/env');

// Hardcoded data based on client/src/data/quizData.js
const quizzesData = [
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript fundamentals and core concepts.",
    category: "Programming",
    duration: 10,
    totalMarks: 50,
    isPublished: true,
    questions: [
      { question: "Which keyword is used to declare a variable in JavaScript?", options: [{ id: "1", text: "var" }, { id: "2", text: "style" }, { id: "3", text: "class" }, { id: "4", text: "define" }], correctAnswer: "1", marks: 10 },
      { question: "Which method converts JSON into a JavaScript object?", options: [{ id: "1", text: "JSON.parse()" }, { id: "2", text: "JSON.stringify()" }, { id: "3", text: "JSON.convert()" }, { id: "4", text: "JSON.object()" }], correctAnswer: "1", marks: 10 },
      { question: "Which of the following is a JavaScript data type?", options: [{ id: "1", text: "String" }, { id: "2", text: "HTML" }, { id: "3", text: "CSS" }, { id: "4", text: "SQL" }], correctAnswer: "1", marks: 10 },
      { question: "Which symbol is used for a single-line comment in JavaScript?", options: [{ id: "1", text: "//" }, { id: "2", text: "/*" }, { id: "3", text: "#" }, { id: "4", text: "<!--" }], correctAnswer: "1", marks: 10 },
      { question: "Which method adds an item to the end of an array?", options: [{ id: "1", text: "push()" }, { id: "2", text: "pop()" }, { id: "3", text: "shift()" }, { id: "4", text: "slice()" }], correctAnswer: "1", marks: 10 }
    ]
  },
  {
    title: "React Fundamentals",
    description: "Test your understanding of React components, props, state, and hooks.",
    category: "Frontend",
    duration: 15,
    totalMarks: 50,
    isPublished: true,
    questions: [
      { question: "Which hook is used to manage state in a React component?", options: [{ id: "1", text: "useState" }, { id: "2", text: "useRoute" }, { id: "3", text: "useStyle" }, { id: "4", text: "usePage" }], correctAnswer: "1", marks: 10 },
      { question: "What is JSX primarily used for?", options: [{ id: "1", text: "Writing UI structure in JavaScript" }, { id: "2", text: "Managing databases" }, { id: "3", text: "Creating CSS files" }, { id: "4", text: "Running backend servers" }], correctAnswer: "1", marks: 10 },
      { question: "Which prop is commonly used to uniquely identify list items?", options: [{ id: "1", text: "key" }, { id: "2", text: "id" }, { id: "3", text: "index" }, { id: "4", text: "unique" }], correctAnswer: "1", marks: 10 },
      { question: "Which hook is commonly used for side effects?", options: [{ id: "1", text: "useEffect" }, { id: "2", text: "useState" }, { id: "3", text: "useValue" }, { id: "4", text: "useComponent" }], correctAnswer: "1", marks: 10 },
      { question: "What are React components used to create?", options: [{ id: "1", text: "Reusable UI elements" }, { id: "2", text: "Database tables" }, { id: "3", text: "Server configurations" }, { id: "4", text: "Operating systems" }], correctAnswer: "1", marks: 10 }
    ]
  },
  {
    title: "HTML & CSS Essentials",
    description: "Test your knowledge of HTML structure and CSS styling fundamentals.",
    category: "Web Development",
    duration: 10,
    totalMarks: 50,
    isPublished: true,
    questions: [
      { question: "Which HTML element is used for the largest heading?", options: [{ id: "1", text: "<h1>" }, { id: "2", text: "<h2>" }, { id: "3", text: "<h6>" }, { id: "4", text: "<head>" }], correctAnswer: "1", marks: 10 },
      { question: "Which CSS property changes the text color?", options: [{ id: "1", text: "color" }, { id: "2", text: "font" }, { id: "3", text: "text-style" }, { id: "4", text: "background" }], correctAnswer: "1", marks: 10 },
      { question: "Which CSS layout system is designed for one-dimensional layouts?", options: [{ id: "1", text: "Flexbox" }, { id: "2", text: "Tables" }, { id: "3", text: "Float" }, { id: "4", text: "Position" }], correctAnswer: "1", marks: 10 },
      { question: "Which HTML element is used to create a hyperlink?", options: [{ id: "1", text: "<a>" }, { id: "2", text: "<link>" }, { id: "3", text: "<href>" }, { id: "4", text: "<url>" }], correctAnswer: "1", marks: 10 },
      { question: "Which CSS property controls the space inside an element?", options: [{ id: "1", text: "padding" }, { id: "2", text: "margin" }, { id: "3", text: "spacing" }, { id: "4", text: "gap" }], correctAnswer: "1", marks: 10 }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoose.url);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({}),
      Result.deleteMany({}),
      Category.deleteMany({})
    ]);
    console.log('Database cleared.');

    // Create Categories
    await Category.insertMany([
      { name: "Programming", status: "Active" },
      { name: "Frontend", status: "Active" },
      { name: "Web Development", status: "Active" },
      { name: "Database", status: "Active" },
    ]);
    console.log('Categories created.');

    // Create Admin User
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "ADMIN"
    });

    // Create Normal User
    const regularUser = await User.create({
      name: "Test User",
      email: "user@example.com",
      password: "password123",
      role: "USER"
    });

    console.log('Users created.');

    // Insert Quizzes and Questions
    for (const quizData of quizzesData) {
      const { questions, ...quizDetails } = quizData;

      const createdQuiz = await Quiz.create({
        ...quizDetails,
        createdBy: adminUser._id
      });

      const questionsToInsert = questions.map(q => ({
        ...q,
        quizId: createdQuiz._id
      }));

      await Question.insertMany(questionsToInsert);
      console.log(`Created Quiz: ${createdQuiz.title} with ${questionsToInsert.length} questions.`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
