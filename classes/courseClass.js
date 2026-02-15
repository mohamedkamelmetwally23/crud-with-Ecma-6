export class courseClass {
  constructor(id, name, instructorId) {
    this.id = id;
    this.name = name;
    this.instructorId = instructorId;
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      instructorId: this.instructorId,
    };
  }
}
