const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  completedLessons: [String],
  quizAttempts: [{
    course: mongoose.Schema.Types.ObjectId,
    quiz: mongoose.Schema.Types.ObjectId,
    score: Number,
    date: Date
  }]
});

module.exports = mongoose.model("User", userSchema);
