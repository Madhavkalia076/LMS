const router = require("express").Router();
const Course = require("../models/Course");
const auth = require("../middlewares/auth");

router.get("/", async (_, res) => {
  const courses = await Course.find();
  res.json(courses);
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("lessons")
    .populate({ path: "quizzes", populate: { path: "questions" } });
  res.json(course);
});

router.post("/enroll/:id", auth, async (req, res) => {
  const user = await require("../models/User").findById(req.user.id);
  if (!user.enrolledCourses.includes(req.params.id)) {
    user.enrolledCourses.push(req.params.id);
    await user.save();
  }
  res.json({ message: "Enrolled successfully" });
});

module.exports = router;
