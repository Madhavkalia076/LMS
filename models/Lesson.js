const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  resourceLinks: [String],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
});

module.exports = mongoose.model("Lesson", lessonSchema);
