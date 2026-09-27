const express = require("express");
const router = express.Router();
const students = require("../data/students");

// Get all students
router.get("/", (req, res) => {
  res.status(200).json(students);
});

//Get a student by ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.status(200).json(student);
});

// Create a new student i.e post request
router.post("/", (req, res) => {
  const {name,course} = req.body;
  if (!name || !course) {
    return res.status(400).json({ message: "Name and course are required" });
  }
  const newStudent = {
    id: students.length + 1,
    name,
    course,
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Update a student by ID i.e put request
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  const { name, course } = req.body;
  if (name) student.name = name;
  if (course) student.course = course;

  res.status(200).json(student);
});

//delete a student by ID i.e delete request
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex((s) => s.id === id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }
  students.splice(studentIndex, 1);
  res.status(200).json({ message: "Student deleted" });
});

module.exports = router;