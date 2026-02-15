export class Student {
  constructor(id, name, age, courses) {
    this.id = id;
    this.name = name; // now public
    this.age = age;
    this.courses = courses;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      courses: this.courses,
    };
  }
}
