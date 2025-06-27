import express from "express";
import {
  markAttendance,
  getAttendanceByDate,
  getAttendanceByClass,
  getAttendanceSummary,
} from "../models/user.js";

const router = express.Router();

// Q4 - Develop a functional REST API for an attendance system involving:
// 1. Mark Attendance for a student in a class on given date
router.post("/attendance", async (req, res) => {
  const { studentId, classId, date, status } = req.query;
  try {
    const record = await markAttendance(Number(studentId), Number(classId), date, status);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get attendance for a student on specific date
router.get("/attendance", async (req, res) => {
  const { studentId, date } = req.query;
  try {
    const record = await getAttendanceByDate(Number(studentId), date);
    if (!record) return res.status(404).json({ message: "No attendance found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. List attendance for all students in a class
router.get("/classes/:id/attendance", async (req, res) => {
  const classId = Number(req.params.id);

  try {
    if (isNaN(classId)) return res.status(400).json({ error: "Invalid class ID" });

    const records = await getAttendanceByClass(classId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get attendance summanry for a student
router.get("/students/:id/attendance", async (req, res) => {
  const studentId = Number(req.params.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  try {
    const summary = await getAttendanceSummary(studentId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;