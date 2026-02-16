import { getData, postData, putData, deleteData } from "../controller/crud.js";
const tableBody = document.querySelector("#studentsTable tbody");
const addBtn = document.getElementById("addStudentBtn");
const modal = document.getElementById("studentFormModal");
const formTitle = document.getElementById("formTitle");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("studentEmail");
const ageInput = document.getElementById("studentAge");
const coursesDiv = document.getElementById("studentCourses");
const saveBtn = document.getElementById("saveStudentBtn");
const cancelBtn = document.getElementById("cancelBtn");
const sortNameBtn = document.getElementById("sortNameBtn");
const sortAgeBtn = document.getElementById("sortAgeBtn");
const searchInput = document.getElementById("searchInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
let currentPage = 1;
const pageSize = 10;
function renderTable() {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedStudents = students.slice(start, end);

  paginatedStudents.forEach((s) => {
    const courseNames =
      s.courseIds?.map((id) => courseMap[id]).join(", ") || "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.age}</td>
      <td>${courseNames}</td>
      <td>
        <button class="edit-btn" data-id="${s.id}">Edit</button>
        <button class="delete-btn" data-id="${s.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  renderPagination();
}
function renderPagination() {
  const totalPages = Math.ceil(students.length / pageSize);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});
nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(students.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});
let allStudents = [];
let filteredStudents = [];
let students = [];
let courses = [];
let courseMap = {};
window.addEventListener("load", async () => {
  courses = await getData("courses");
  allStudents = await getData("students");

  filteredStudents = [...allStudents];
  students = [...filteredStudents];

  courses.forEach((c) => (courseMap[c.id] = c.name));

  fillCoursesCheckboxes();
  renderTable();
});

function fillCoursesCheckboxes() {
  coursesDiv.innerHTML = "";
  courses.forEach((c) => {
    const div = document.createElement("div");
    div.classList.add("checkbox-item");
    div.innerHTML = `
      <input type="checkbox" value="${c.id}" id="course_${c.id}" />
      <label for="course_${c.id}">${c.name}</label>
    `;
    coursesDiv.appendChild(div);
  });
}
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  filteredStudents = allStudents.filter((s) =>
    s.name.toLowerCase().includes(value),
  );
  students = [...filteredStudents];
  currentPage = 1;
  renderTable();
});
function openForm(student = null) {
  modal.style.display = "block";

  if (student) {
    formTitle.textContent = "Edit Student";

    studentIdInput.value = student.id;
    nameInput.value = student.name;
    emailInput.value = student.email || "";
    ageInput.value = student.age;
    [...coursesDiv.querySelectorAll("input[type=checkbox]")].forEach((cb) => {
      cb.checked = student.courseIds.includes(cb.value);
    });
  } else {
    formTitle.textContent = "Add Student";

    studentIdInput.value = "";
    nameInput.value = "";
    emailInput.value = "";
    ageInput.value = "";

    [...coursesDiv.querySelectorAll("input[type=checkbox]")].forEach(
      (cb) => (cb.checked = false),
    );
  }
}
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

addBtn.addEventListener("click", () => openForm());

tableBody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("edit-btn")) {
    openForm(students.find((s) => s.id == id));
  }

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Delete this student?")) {
      await deleteData("students", id);
      allStudents = allStudents.filter((s) => s.id != id);
      filteredStudents = [...allStudents];
      students = [...filteredStudents];
      renderTable();
    }
  }
});
saveBtn.addEventListener("click", async () => {
  const id = studentIdInput.value;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const age = +ageInput.value;

  const courseIds = [
    ...coursesDiv.querySelectorAll("input[type=checkbox]:checked"),
  ].map((cb) => cb.value);

  if (name === "" || !isNaN(name)) {
    alert("Enter a valid name");
    return;
  }
  if (email === "") {
    alert("Email is required");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Enter a valid email");
    return;
  }
  const duplicate = allStudents.find((s) => s.email === email && s.id != id);

  if (duplicate) {
    alert("Email already exists");
    return;
  }
  if (age < 15 || age > 30) {
    alert("Age must be between 15 and 30");
    return;
  }
  if (courseIds.length === 0) {
    alert("Select at least one course");
    return;
  }

  const data = { name, email, age, courseIds };

  if (id) {
    const updated = await putData("students", id, data);

    allStudents = allStudents.map((s) => (s.id == id ? updated : s));
  } else {
    const created = await postData("students", data);
    allStudents.push(created);
  }

  filteredStudents = [...allStudents];
  students = [...filteredStudents];

  modal.style.display = "none";
  currentPage = 1;

  renderTable();
});

let nameSortAsc = true;
sortNameBtn.addEventListener("click", () => {
  students.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase())
      return nameSortAsc ? -1 : 1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
      return nameSortAsc ? 1 : -1;
    return 0;
  });
  nameSortAsc = !nameSortAsc;
  renderTable();
});

let ageSortAsc = true;

sortAgeBtn.addEventListener("click", () => {
  students.sort((a, b) => (ageSortAsc ? a.age - b.age : b.age - a.age));
  ageSortAsc = !ageSortAsc;
  renderTable();
});
