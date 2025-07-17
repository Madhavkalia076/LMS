const API = "http://localhost:5000/api";
let token = "";

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  token = data.token;
  alert("Login successful!");
  fetchCourses();
}

async function register() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  alert("Registration successful! You can now log in.");
}

async function fetchCourses() {
  const res = await fetch(`${API}/courses`);
  const courses = await res.json();
  const container = document.getElementById("course-container");
  container.innerHTML = "";
  courses.forEach(course => {
    container.innerHTML += `
      <div class="card">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Price:</strong> $${course.price}</p>
        <button class="btn" onclick="enroll('${course._id}')">Enroll</button>
      </div>
    `;
  });
}

async function enroll(courseId) {
  if (!token) return alert("Please login to enroll.");
  const res = await fetch(`${API}/courses/enroll/${courseId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  alert(data.message || "Enrolled successfully!");
}