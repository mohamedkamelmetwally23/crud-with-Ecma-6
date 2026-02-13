import { getData, postData, putData, deleteData } from "./Api.js";

const tableBody = document.querySelector("#studentsTable tbody");
const addBtn = document.getElementById("addStudentBtn");
const modal = document.getElementById("studentFormModal");
const formTitle = document.getElementById("formTitle");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("studentName");
const ageInput = document.getElementById("studentAge");
const coursesInput = document.getElementById("studentCourses");
const saveBtn = document.getElementById("saveStudentBtn");
const cancelBtn = document.getElementById("cancelBtn");

let students = [];
let courses = [];
let courseMap = {};

// 🔹 Load after window fully loads
window.addEventListener("load", async () => {
  courses = await getData("courses");
  courses.forEach((c) => (courseMap[c.id] = c.name));

  students = await getData("students");
  renderTable();
});

function renderTable() {
  tableBody.innerHTML = "";

  students.forEach((s) => {
    const tr = document.createElement("tr");
    const courseNames =
      s.courseIds?.map((id) => courseMap[id]).join(", ") || "-";

    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.email || ""}</td>
      <td>${s.age}</td>
      <td>${courseNames}</td>
      <td>
        <button class="edit-btn" data-id="${s.id}">Edit</button>
        <button class="delete-btn" data-id="${s.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);

    tr.querySelector(".edit-btn").style =
      "background:#17a2b8;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;";
    tr.querySelector(".delete-btn").style =
      "background:#ff6600;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;";
  });

  addBtn.style =
    "background:#007BFF;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;";
}

// 🔹 Event delegation for Edit/Delete
tableBody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("edit-btn"))
    openForm(students.find((s) => s.id == id));
  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Delete this student?")) {
      await deleteData("students", id);
      students = await getData("students");
      renderTable();
    }
  }
});

// 🔹 Open form
function openForm(student = null) {
  modal.style.display = "block";
  if (student) {
    formTitle.textContent = "Edit Student";
    studentIdInput.value = student.id;
    nameInput.value = student.name;
    ageInput.value = student.age;
    coursesInput.value = student.courseIds.join(",");
  } else {
    formTitle.textContent = "Add Student";
    studentIdInput.value = "";
    nameInput.value = "";
    ageInput.value = "";
    coursesInput.value = "";
  }
}

// 🔹 Close modal
cancelBtn.addEventListener("click", () => (modal.style.display = "none"));

// 🔹 Add new
addBtn.addEventListener("click", () => openForm());

// 🔹 Save
saveBtn.addEventListener("click", async () => {
  const id = studentIdInput.value;
  const data = {
    name: nameInput.value,
    age: +ageInput.value,
    courseIds: coursesInput.value.split(",").map((x) => +x.trim()),
  };

  if (id) await putData("students", id, data);
  else await postData("students", data);

  modal.style.display = "none";
  students = await getData("students");
  renderTable();
});
