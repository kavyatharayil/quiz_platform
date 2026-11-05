export const quizzes = [
  {
    id: "javascript-basics",
    title: "JavaScript Fundamentals",
    category: "Programming",
    description:
      "Test your knowledge of JavaScript fundamentals and core concepts.",
    duration: 10,
    type: "IT",
    level: "Beginner",

    instructions: [
      "Read each question carefully before selecting an answer.",
      "Select one answer for each question.",
      "You can move between questions using the navigation controls.",
      "The quiz will be automatically submitted when the timer reaches zero.",
    ],

    questions: [
      {
        id: 1,
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "style", "class", "define"],
        correctAnswer: "var",
      },
      {
        id: 2,
        question: "Which method converts JSON into a JavaScript object?",
        options: [
          "JSON.parse()",
          "JSON.stringify()",
          "JSON.convert()",
          "JSON.object()",
        ],
        correctAnswer: "JSON.parse()",
      },
      {
        id: 3,
        question: "Which of the following is a JavaScript data type?",
        options: ["String", "HTML", "CSS", "SQL"],
        correctAnswer: "String",
      },
      {
        id: 4,
        question: "Which symbol is used for a single-line comment in JavaScript?",
        options: ["//", "/*", "#", "<!--"],
        correctAnswer: "//",
      },
      {
        id: 5,
        question: "Which method adds an item to the end of an array?",
        options: ["push()", "pop()", "shift()", "slice()"],
        correctAnswer: "push()",
      },
    ],
  },

  {
    id: "react-basics",
    title: "React Fundamentals",
    category: "Frontend",
    description:
      "Test your understanding of React components, props, state, and hooks.",
    duration: 15,
    type: "IT",
    level: "Intermediate",

    instructions: [
      "Read every question carefully.",
      "Select the best answer.",
      "You can navigate between questions.",
      "The quiz will automatically submit when the timer expires.",
    ],

    questions: [
      {
        id: 1,
        question: "Which hook is used to manage state in a React component?",
        options: ["useState", "useRoute", "useStyle", "usePage"],
        correctAnswer: "useState",
      },
      {
        id: 2,
        question: "What is JSX primarily used for?",
        options: [
          "Writing UI structure in JavaScript",
          "Managing databases",
          "Creating CSS files",
          "Running backend servers",
        ],
        correctAnswer: "Writing UI structure in JavaScript",
      },
      {
        id: 3,
        question: "Which prop is commonly used to uniquely identify list items?",
        options: ["key", "id", "index", "unique"],
        correctAnswer: "key",
      },
      {
        id: 4,
        question: "Which hook is commonly used for side effects?",
        options: ["useEffect", "useState", "useValue", "useComponent"],
        correctAnswer: "useEffect",
      },
      {
        id: 5,
        question: "What are React components used to create?",
        options: [
          "Reusable UI elements",
          "Database tables",
          "Server configurations",
          "Operating systems",
        ],
        correctAnswer: "Reusable UI elements",
      },
    ],
  },

  {
    id: "html-css",
    title: "HTML & CSS Essentials",
    category: "Web Development",
    description:
      "Test your knowledge of HTML structure and CSS styling fundamentals.",
    duration: 10,
    type: "IT",
    level: "Beginner",

    instructions: [
      "Read each question carefully.",
      "Choose one answer for every question.",
      "Review your answers before submitting.",
    ],

    questions: [
      {
        id: 1,
        question: "Which HTML element is used for the largest heading?",
        options: ["<h1>", "<h2>", "<h6>", "<head>"],
        correctAnswer: "<h1>",
      },
      {
        id: 2,
        question: "Which CSS property changes the text color?",
        options: ["color", "font", "text-style", "background"],
        correctAnswer: "color",
      },
      {
        id: 3,
        question: "Which CSS layout system is designed for one-dimensional layouts?",
        options: ["Flexbox", "Tables", "Float", "Position"],
        correctAnswer: "Flexbox",
      },
      {
        id: 4,
        question: "Which HTML element is used to create a hyperlink?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correctAnswer: "<a>",
      },
      {
        id: 5,
        question: "Which CSS property controls the space inside an element?",
        options: ["padding", "margin", "spacing", "gap"],
        correctAnswer: "padding",
      },
    ],
  },
];