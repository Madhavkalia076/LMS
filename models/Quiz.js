const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

module.exports = mongoose.model("Quiz", quizSchema);
