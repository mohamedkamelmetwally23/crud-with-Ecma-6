import { getData, postData, putData, deleteData } from "./Api.js";
import { courseClass } from "../classes/courseClass.js";

const tableData = document.querySelector(".tableData");
const addcourse = document.querySelector(".addcoursebtn");
const coursemodel = document.querySelector(".coursemodel");
const coursein = document.querySelector("#coursename");
const instructorin = document.querySelector("#instructorname");
const savebtn = document.querySelector(".addbtn");
const cancelbtn = document.querySelector(".cancelbtn");
async function renderdata() {
  const data = await getData("courses");
  const instructors = await getData("instructors");
  tableData.innerHTML = "";

  data.forEach((el) => {
    let instructor = instructors.find((inst) => inst.id == el.instructorId);
    let instructorName = instructor.name;

    tableData.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${el.id}</td>
        <td>${el.name}</td>
        <td>${instructorName}</td>
        <td><button class="deletebtn" data-id="${el.id}">delete</button></td>
      </tr>`,
    );
  });
}

window.addEventListener("load", async () => {
  renderdata();
});

tableData.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deletebtn")) {
    let courseid = e.target.closest("tr").children[0].textContent;
    let ok = confirm("Are you sure you want to delete this course?");
    if (!ok) return;

    await deleteData("courses", courseid);
    renderdata();
  }
});

addcourse.addEventListener("click", () => {
  coursemodel.style.display = "block";
  coursein.value = "";
  instructorin.value = "";
});

savebtn.addEventListener("click", async () => {
  const coursename = coursein.value.trim();
  const instructorname = instructorin.value.trim();

  if (!coursename || !instructorname) {
    alert("no data found");
    return;
  }

  const courses = await getData("courses");
  const instructors = await getData("instructors");

  const isDuplicate = courses.some((c) => c.name === coursename);

  if (isDuplicate) {
    alert("This course already exists!");
    return;
  }

  let findinstructor = instructors.find((el) => el.name === instructorname);

  if (!findinstructor) {
    alert("Instructor not found");
    return;
  }

  const newId =
    courses.length > 0 ? Math.max(...courses.map((c) => Number(c.id))) + 1 : 1;
  await postData(
    "courses",
    new courseClass(`${newId}`, coursename, findinstructor.id),
  );

  renderdata();
  coursemodel.style.display = "none";
});
cancelbtn.addEventListener("click", () => {
  coursemodel.style.display = "none";
});
