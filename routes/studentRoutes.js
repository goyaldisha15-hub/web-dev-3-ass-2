const express = require("express");
const students = require("../data/students");

const router = express.Router();

// ---------- Helpers ----------
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getNextId = () =>
  students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;

// ---------- GET /students ----------
router.get("/", (req, res) => {
  res.status(200).json(students);
});

// ---------- GET /students/:id ----------
router.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student id must be a positive integer" });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  res.status(200).json(student);
});

// ---------- POST /students ----------
router.post("/", (req, res) => {
  const { name, course } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(course)) {
    return res
      .status(400)
      .json({ error: "Both 'name' and 'course' are required and must be non-empty strings" });
  }

  const newStudent = { id: getNextId(), name: name.trim(), course: course.trim() };
  students.push(newStudent);

  res.status(201).json(newStudent);
});

// ---------- PUT /students/:id ----------
router.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student id must be a positive integer" });
  }

  const { name, course } = req.body || {};
  if (!isNonEmptyString(name) || !isNonEmptyString(course)) {
    return res
      .status(400)
      .json({ error: "Both 'name' and 'course' are required and must be non-empty strings" });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  student.name = name.trim();
  student.course = course.trim();

  res.status(200).json(student);
});

// ---------- DELETE /students/:id ----------
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student id must be a positive integer" });
  }

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  const [deleted] = students.splice(index, 1);

  res.status(200).json({ message: "Student deleted successfully", student: deleted });
});

module.exports = router;