const token = localStorage.getItem("token");
const courseId = window.location.pathname.split("/").pop();

async function fetchCourseDetails() {
  const res = await fetch(`/api/courses/${courseId}`);
  const course = await res.json();

  document.getElementById("courseTitle").innerText = course.title;
  document.getElementById("courseDesc").innerText = course.description;

  renderLessons(course.lessons);
  renderQuiz(course.quizzes?.[0]);
  fetchProgress();
}

async function renderLessons(lessons) {
  const container = document.getElementById("lessonsContainer");
  container.innerHTML = "";

  for (let lesson of lessons) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${lesson.title}</h4>
      <a href="${lesson.videoUrl}" target="_blank">Watch Video</a><br>
      <button onclick="completeLesson('${lesson._id}')">Mark Complete</button>
      <hr/>
    `;
    container.appendChild(div);
  }
}

async function completeLesson(lessonId) {
  if (!token) return alert("Login required.");
  const res = await fetch(`/api/progress/complete/${lessonId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  alert(data.message);
  fetchProgress();
}

async function fetchProgress() {
  const res = await fetch(`/api/progress/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById("progressText").innerText =
    `Completed ${data.completed} / ${data.totalLessons} lessons (${data.progress}%)`;
}

async function renderQuiz(quizId) {
  if (!quizId) return;

  const res = await fetch(`/api/quiz/${quizId}`);
  const quiz = await res.json();

  const form = document.getElementById("quizForm");
  form.innerHTML = "";

  quiz.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${q.text}</p>`;

    q.options.forEach((option, j) => {
      div.innerHTML += `
        <label>
          <input type="radio" name="q${i}" value="${j}"> ${option}
        </label><br/>
      `;
    });

    form.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.innerText = "Submit Quiz";
  form.appendChild(submitBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const answers = quiz.questions.map((_, i) => {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      return selected ? Number(selected.value) : -1;
    });

    const res = await fetch(`/api/progress/quiz/${quizId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ answers })
    });

    const data = await res.json();
    document.getElementById("quizScore").innerText = `Score: ${data.score}`;
  };
}

fetchCourseDetails();
