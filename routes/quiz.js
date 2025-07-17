const router = require("express").Router();
const Quiz = require("../models/Quiz");

router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate("questions");
  res.json(quiz);
});

module.exports = router;
