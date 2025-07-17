const User = require("../models/User");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");

exports.completeLesson = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { lessonId } = req.params;

  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    await user.save();
  }

  res.json({ message: "Lesson marked complete" });
};

exports.attemptQuiz = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { quizId } = req.params;
  const { answers } = req.body;

  const quiz = await Quiz.findById(quizId).populate("questions");
  let score = 0;

  quiz.questions.forEach((q, i) => {
    if (q.correctIndex === answers[i]) score++;
  });

  user.quizAttempts.push({
    course: quiz.course,
    quiz: quiz._id,
    score,
    date: new Date()
  });

  await user.save();
  res.json({ message: "Quiz submitted", score });
};

exports.getProgress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { courseId } = req.params;

  const total = await Lesson.countDocuments({ course: courseId });
  const completed = user.completedLessons.filter(id => id).length;
  const progress = total === 0 ? 0 : Math.floor((completed / total) * 100);

  res.json({ totalLessons: total, completed, progress });
};
