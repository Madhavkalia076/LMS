const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  completeLesson,
  attemptQuiz,
  getProgress
} = require("../controllers/progressController");

router.post("/complete/:lessonId", auth, completeLesson);
router.post("/quiz/:quizId", auth, attemptQuiz);
router.get("/:courseId", auth, getProgress);

module.exports = router;
