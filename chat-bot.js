const botui = new BotUI('botui-app');

// Enhanced responses with more context and actions
// Quiz data structure
const quizzes = {
  'python': [
    {
      question: 'What is Python?',
      options: ['A programming language', 'A snake', 'A database', 'An operating system'],
      correct: 0
    },
    {
      question: 'Which of these is not a Python data type?',
      options: ['Integer', 'Float', 'String', 'Varchar'],
      correct: 3
    },
    {
      question: 'What is the correct file extension for Python files?',
      options: ['.py', '.python', '.pt', '.pyt'],
      correct: 0
    },
    {
      question: 'What is used to define a block of code in Python?',
      options: ['Curly braces', 'Parentheses', 'Indentation', 'Square brackets'],
      correct: 2
    },
    {
      question: 'Which operator is used for exponentiation in Python?',
      options: ['^', '**', '^^', '//'],
      correct: 1
    }
  ],
  'computer networks': [
    {
      question: 'What is a protocol in networking?',
      options: ['A type of cable', 'A set of rules', 'A network device', 'An IP address'],
      correct: 1
    },
    {
      question: 'Which layer is responsible for routing in the OSI model?',
      options: ['Physical Layer', 'Network Layer', 'Transport Layer', 'Application Layer'],
      correct: 1
    },
    {
      question: 'What is the purpose of DNS?',
      options: ['To assign IP addresses', 'To secure websites', 'To resolve domain names to IP addresses', 'To encrypt data'],
      correct: 2
    },
    {
      question: 'What is the maximum length of an IPv4 address?',
      options: ['32 bits', '64 bits', '128 bits', '256 bits'],
      correct: 0
    },
    {
      question: 'Which protocol is used for secure web browsing?',
      options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
      correct: 2
    }
  ],
  'database': [
    {
      question: 'What is a primary key?',
      options: ['A unique identifier for a record', 'A password', 'A backup key', 'A foreign key'],
      correct: 0
    },
    {
      question: 'Which SQL command is used to retrieve data?',
      options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
      correct: 2
    },
    {
      question: 'What is normalization in DBMS?',
      options: ['Data encryption', 'Data backup', 'Process of organizing data', 'Data deletion'],
      correct: 2
    },
    {
      question: 'Which type of join returns all matching records from both tables?',
      options: ['Left Join', 'Right Join', 'Inner Join', 'Outer Join'],
      correct: 2
    },
    {
      question: 'What is ACID in database systems?',
      options: ['A chemical compound', 'A database language', 'A set of database properties', 'A type of query'],
      correct: 2
    }
  ],
  'operating systems': [
    {
      question: 'What is an operating system?',
      options: ['A hardware component', 'System software', 'Application software', 'A programming language'],
      correct: 1
    },
    {
      question: 'What is the purpose of a scheduler in OS?',
      options: ['To allocate memory', 'To manage processes', 'To handle I/O', 'To manage files'],
      correct: 1
    },
    {
      question: 'What is virtual memory?',
      options: ['RAM', 'Hard disk space used as RAM', 'Cache memory', 'ROM'],
      correct: 1
    },
    {
      question: 'What is a deadlock?',
      options: ['System crash', 'Process termination', 'Resource conflict', 'Memory leak'],
      correct: 2
    },
    {
      question: 'Which scheduling algorithm is considered most fair?',
      options: ['FCFS', 'Round Robin', 'Priority', 'SJF'],
      correct: 1
    }
  ]
};

// Track current quiz state
let currentQuiz = {
  subject: null,
  questions: null,
  currentQuestion: 0,
  score: 0
};

const responses = {
  'hello': {
    message: 'Hi there! I\'m your Smart Tutor assistant. I can help you with exam preparation, study materials, and academic guidance. What would you like to explore?',
    suggestions: ['Study Resources', 'Exam Help', 'Course Materials', 'Ask a Question']
  },
  'hi': {
    message: 'Welcome to Smart Tutor! I\'m your AI study companion. I can assist you with:\n- Course materials and notes\n- Exam preparation\n- Practice questions\n- Study tips and strategies\nWhat would you like to focus on?',
    suggestions: ['View Materials', 'Prepare for Exams', 'Practice Questions', 'Get Study Tips']
  },
  'help': {
    message: 'I\'m here to support your academic success! Here\'s how I can help:\n1. 📚 Access course materials and notes\n2. 📝 Prepare for exams with PYQs\n3. ✍️ Practice with interactive questions\n4. 📋 Get personalized study plans\n5. 📊 Track your progress\nWhat interests you?',
    suggestions: ['Course Materials', 'Exam Prep', 'Practice Tests', 'Study Plan']
  },
  'notes': {
    message: 'Access our comprehensive study materials:\n1. 📖 Verified lecture notes\n2. 📑 Subject summaries\n3. 🗂️ Topic-wise resources\n4. 📤 Easy sharing options\n5. 🔍 Smart search feature\nHow can I assist you with the study materials?',
    suggestions: ['View Notes', 'Find by Subject', 'Get Summaries', 'Share Notes']
  },
  'courses': {
    message: 'We offer comprehensive materials for various courses:\n- Python Programming\n- C++ and OOP\n- Computer Networks\n- Database Management\n- Operating Systems\nWhich subject interests you?',
    suggestions: ['Python', 'C++', 'Computer Networks']
  },
  'exam': {
    message: 'Let\'s ace your exams together! I offer:\n1. 📚 Previous Year Questions (PYQs)\n2. 📝 Subject-wise practice tests\n3. ✅ Step-by-step solutions\n4. 📅 Study schedules\n5. 📊 Progress tracking\n6. 💡 Exam strategies\nWhat would you like to start with?',
    suggestions: ['Access PYQs', 'Take Practice Test', 'Get Solutions', 'View Study Plan']
  },
  'exam prep': {
    message: '📝 EXAM PREPARATION ASSISTANT\n==========================\n\nI can help you create a personalized study plan. First, please tell me:\n\n1. Which subject are you preparing for?\n   • Python Programming\n   • Computer Networks\n   • Database Management\n   • Operating Systems\n\n2. When is your exam date? (Please provide in DD/MM/YYYY format)\n\nOnce you provide these details, I can create a customized study schedule for you!',
    suggestions: ['Python', 'Computer Networks', 'Database', 'Operating Systems']
  },
  'question': {
    message: 'I\'m your personal study helper! I can:\n1. 🔍 Analyze your questions\n2. 📝 Provide detailed explanations\n3. 💡 Share helpful examples\n4. 📚 Suggest study resources\n5. 🎯 Guide practice sessions\nWhat type of help do you need?',
    suggestions: ['Explain Topic', 'Show Examples', 'Practice Questions', 'Find Resources']
  },
  'practice': {
    message: 'Enhance your learning with our practice resources:\n1. Comprehensive PYQ database\n2. Topic-wise practice sets\n3. Timed mock tests\n4. Interactive problem-solving\n5. Performance analytics\nWhat type of practice would you prefer?',
    suggestions: ['Start mock test', 'Topic practice', 'View solutions', 'Take Quiz']
  },
  'quiz': {
    message: 'Ready to test your knowledge? Choose a subject to start the quiz:',
    suggestions: ['Python', 'Computer Networks', 'Database', 'Operating Systems']
  },
  'default': {
    message: 'I\'m here to help! To assist you better, you can:\n1. 📚 Tell me the subject you\'re studying\n2. ❓ Ask specific questions\n3. 🎯 Share your learning goals\n4. 📝 Request study materials\nOr choose from these options:',
    suggestions: ['Browse Subjects', 'Ask Question', 'Get Study Help', 'View Resources']
  }
};

// Initialize chat
function initChat() {
  botui.message.add({
    content: 'Hello! I\'m your study assistant. How can I help you today?'
  }).then(() => {
    return askQuestion();
  });
}

// Quiz handling functions
function startQuiz(subject) {
  subject = subject.toLowerCase();
  if (quizzes[subject]) {
    currentQuiz.subject = subject;
    currentQuiz.questions = quizzes[subject];
    currentQuiz.currentQuestion = 0;
    currentQuiz.score = 0;
    return showQuestion();
  }
  return handleError('Invalid subject selection');
}

function showQuestion() {
  if (!currentQuiz.questions || currentQuiz.currentQuestion >= currentQuiz.questions.length) {
    return showQuizResults();
  }

  const question = currentQuiz.questions[currentQuiz.currentQuestion];
  return botui.message.add({
    content: `Question ${currentQuiz.currentQuestion + 1}: ${question.question}`,
    delay: 500
  }).then(() => {
    return botui.action.button({
      action: question.options.map((option, index) => ({
        text: option,
        value: index
      }))
    });
  }).then(res => {
    if (res.value === question.correct) {
      currentQuiz.score++;
      return botui.message.add({
        content: '✅ Correct!',
        delay: 500
      });
    } else {
      return botui.message.add({
        content: `❌ Incorrect. The correct answer was: ${question.options[question.correct]}`,
        delay: 500
      });
    }
  }).then(() => {
    currentQuiz.currentQuestion++;
    return showQuestion();
  });
}

function showQuizResults() {
  const percentage = (currentQuiz.score / currentQuiz.questions.length) * 100;
  return botui.message.add({
    content: `Quiz completed!\nSubject: ${currentQuiz.subject}\nScore: ${currentQuiz.score}/${currentQuiz.questions.length} (${percentage}%)`,
    delay: 1000
  }).then(() => {
    // Reset quiz state
    currentQuiz = {
      subject: null,
      questions: null,
      currentQuestion: 0,
      score: 0
    };
    return askQuestion();
  });
}

// Enhanced input handling with context awareness
function handleUserInput(input) {
  if (!input || typeof input !== 'string') {
    return handleError('Please provide a valid input.');
  }

  const lowercaseInput = input.toLowerCase().trim();
  let responseObj = responses.default;
  let matchFound = false;

  try {
    // Advanced keyword matching with context awareness
    const keywords = {
      exam: ['exam', 'test', 'assessment', 'preparation', 'prep'],
      quiz: ['quiz', 'quizzes', 'test knowledge'],
      question: ['question', 'solve', 'answer', 'solution', 'help with', 'explain'],
      practice: ['practice', 'exercise', 'problem', 'try', 'mock'],
      notes: ['notes', 'material', 'study', 'document', 'resources'],
      courses: ['course', 'subject', 'topic', 'learn', 'class']
    };

    // Check for keyword matches with improved accuracy
    for (const [category, categoryKeywords] of Object.entries(keywords)) {
      if (categoryKeywords.some(keyword => lowercaseInput.includes(keyword))) {
        responseObj = responses[category];
        matchFound = true;
        break;
      }
    }

    // Check for direct matches if no keyword match found
    if (!matchFound) {
      for (const key in responses) {
        if (lowercaseInput.includes(key)) {
          responseObj = responses[key];
          matchFound = true;
          break;
        }
      }
    }

    // Display enhanced response with suggestions and typing indicator
    return botui.message.add({
      content: responseObj.message,
      loading: true,
      delay: Math.min(responseObj.message.length * 20, 1500) // Dynamic delay based on message length
    }).then(() => {
      // Add suggestion buttons with improved styling
      if (responseObj.suggestions && responseObj.suggestions.length > 0) {
        return botui.action.button({
          action: responseObj.suggestions.map(suggestion => ({
            text: suggestion,
            value: suggestion
          })),
          delay: 500 // Slight delay for better UX
        });
      }
    }).then(res => {
      if (res) {
        return handleUserInput(res.value);
      }
      return askQuestion();
    }).catch(error => handleError(error));
  } catch (error) {
    return handleError(error);
  }
}

// Enhanced error handling
function handleError(error) {
  console.error('Chat Error:', error);
  return botui.message.add({
    content: 'I apologize for the confusion. Could you please rephrase your question or select one of these options:',
    delay: 500
  }).then(() => {
    return botui.action.button({
      action: [
        { text: 'View Study Materials', value: 'notes' },
        { text: 'Get Help with Exams', value: 'exam' },
        { text: 'Ask Another Question', value: 'question' }
      ]
    });
  }).then(res => {
    if (res) {
      return handleUserInput(res.value);
    }
    return askQuestion();
  });
}

// Function to ask for user input
function askQuestion() {
  return botui.action.text({
    action: {
      placeholder: 'Type your message...'
    }
  }).then(function(res) {
    handleUserInput(res.value);
  });
}

// Start the chat
initChat();
