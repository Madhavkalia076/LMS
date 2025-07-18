document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
});

async function fetchCourses() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/courses", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  const container = document.getElementById("coursesList");

  if (!Array.isArray(data)) {
    container.innerHTML = "<p>Failed to load courses.</p>";
    return;
  }

  data.forEach((course) => {
    const courseElement = document.createElement("div");
    courseElement.classList.add("card");

    courseElement.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p><strong>Instructor:</strong> ${course.instructor}</p>
      <p><strong>Price:</strong> ₹${course.price}</p>
      <a class="btn" href="/courses/${course._id}">Go to Course</a>
    `;

    container.appendChild(courseElement);
  });
}
