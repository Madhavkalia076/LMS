const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
require("./models/User");
require("./models/Course");
require("./models/Quiz");
require("./models/Lesson");
require("./models/Question"); // ✅ This fixes your error


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.redirect("/login"); // or render a homepage instead
});
app.get("/courses/:id", (req, res) => {
  res.render("course", { courseId: req.params.id });
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/quiz", require("./routes/quiz"));

// Page routes
app.get("/login", (_, res) => res.render("login"));
app.get("/register", (_, res) => res.render("register"));
app.get("/courses", (_, res) => res.render("courses"));
app.get("/courses/:id", (_, res) => res.render("course"));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
  });
});
