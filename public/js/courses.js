async function fetchCourses() {
  const res = await fetch("/api/courses");
  const courses = await res.json();
  const list = document.getElementById("coursesList");

  courses.forEach(course => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <button onclick="enroll('${course._id}')">Enroll</button>
      <a href="/courses/${course._id}">View Course</a>
      <hr/>
    `;
    list.appendChild(div);
  });
}

async function enroll(courseId) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login");

  const res = await fetch(`/api/courses/enroll/${courseId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  alert(data.message || "Enrolled");
}

fetchCourses();
