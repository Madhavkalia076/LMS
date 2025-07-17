const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load env
dotenv.config();

// Load models
const User = require("./models/User");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

// Connect
mongoose.connect(process.env.MONGO_URI).then(seed).catch(console.error);

async function seed() {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();
    await Question.deleteMany();

    // Create sample user
    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await User.create({
      name: "Madhav",
      email: "madhav@example.com",
      password: hashedPassword
    });

    // Sample course 1
    const course1 = await Course.create({
      title: "Node.js for Beginners",
      description: "Learn Node.js from scratch",
      instructor: "John Doe",
      price: 0
    });

    const lessons1 = await Lesson.insertMany([
      {
        title: "Intro to Node.js",
        videoUrl: "https://youtube.com/xyz1",
        course: course1._id
      },
      {
        title: "Installing Node.js",
        videoUrl: "https://youtube.com/xyz2",
        course: course1._id
      }
    ]);

    const q1 = await Question.create({
      text: "What is Node.js?",
      options: ["Framework", "Library", "Runtime", "IDE"],
      correctIndex: 2
    });

    const quiz1 = await Quiz.create({
      course: course1._id,
      questions: [q1._id]
    });

    course1.lessons = lessons1.map(l => l._id);
    course1.quizzes = [quiz1._id];
    await course1.save();

    // Sample course 2
    const course2 = await Course.create({
      title: "JavaScript Essentials",
      description: "Master the core concepts of JavaScript",
      instructor: "Jane Smith",
      price: 0
    });

    const lessons2 = await Lesson.insertMany([
      {
        title: "Variables and Types",
        videoUrl: "https://youtube.com/js1",
        course: course2._id
      },
      {
        title: "Functions in JavaScript",
        videoUrl: "https://youtube.com/js2",
        course: course2._id
      }
    ]);

    const q2 = await Question.create({
      text: "Which keyword declares a variable?",
      options: ["var", "const", "let", "All of the above"],
      correctIndex: 3
    });

    const quiz2 = await Quiz.create({
      course: course2._id,
      questions: [q2._id]
    });

    course2.lessons = lessons2.map(l => l._id);
    course2.quizzes = [quiz2._id];
    await course2.save();

    console.log("✅ Seeding complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}
