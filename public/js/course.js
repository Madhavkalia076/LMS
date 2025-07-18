document.addEventListener("DOMContentLoaded", () => {
  loadCourse();
});

async function loadCourse() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login first.");

  try {
    const res = await fetch(`/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      document.body.innerHTML = `<p>${data.message || "Failed to load course."}</p>`;
      return;
    }

    // Course Info
    document.getElementById("courseTitle").innerText = data.title;
    document.getElementById("courseDesc").innerText = data.description;

    if (!data.enrolled) {
      // 🔁 Show enroll button if not enrolled
      const enrollBtn = document.createElement("button");
      enrollBtn.classList.add("btn");
      enrollBtn.innerText = "Enroll Now";
      enrollBtn.onclick = () => enrollInCourse(courseId, token);
      document.body.querySelector("main").prepend(enrollBtn);
      return;
    }

    // ✅ Show progress
    document.getElementById("progressText").innerText =
      `You have completed ${data.progress || 0}% of this course.`;

    // ✅ Render lessons
    const lessonsDiv = document.getElementById("lessonsContainer");
    lessonsDiv.innerHTML = "";
    data.lessons.forEach(lesson => {
      const lessonEl = document.createElement("div");
      lessonEl.classList.add("card");
      lessonEl.innerHTML = `
        <h4>${lesson.title}</h4>
        <p>${lesson.content}</p>
      `;
      lessonsDiv.appendChild(lessonEl);
    });

    // ✅ Render quiz
    renderQuiz(data.quiz || []);

  } catch (err) {
    console.error("Error loading course:", err);
    document.body.innerHTML = "<p>Error loading course.</p>";
  }
}

async function enrollInCourse(courseId, token) {
  try {
    const res = await fetch(`/api/courses/enroll/${courseId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert("Enrollment successful! Reloading...");
      location.reload();
    } else {
      alert(data.message || "Enrollment failed.");
    }
  } catch (err) {
    alert("Enrollment error:", err.message);
  }
}

function renderQuiz(quiz) {
  const quizForm = document.getElementById("quizForm");
  quizForm.innerHTML = "";

  quiz.forEach((question, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${index + 1}. ${question.text}</p>`;

    question.options.forEach((opt, i) => {
      const id = `q${index}_opt${i}`;
      div.innerHTML += `
        <label for="${id}">
          <input type="radio" name="q${index}" id="${id}" value="${i}">
          ${opt}
        </label><br>`;
    });

    quizForm.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit Quiz";
  submitBtn.onclick = handleQuizSubmit;
  quizForm.appendChild(submitBtn);
}

function handleQuizSubmit(e) {
  e.preventDefault();
  alert("Quiz submitted (this can be extended to backend scoring)");
}
