import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

// Q1 - Define the 3 models and their properties
const Student = sequelize.define("Student", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
});

const Class = sequelize.define("Class", {
    name: DataTypes.STRING,
    schedule: DataTypes.STRING,
});

const AttendanceRecord = sequelize.define("AttendanceRecord", {
    date: DataTypes.DATEONLY,
    status: DataTypes.ENUM("Present", "Absent", "Late"),
});

// Q2 - Define the relationship between the 3 tables (belongsTo, hasOne, hasMany)
// A Student has many Attendance Records
Student.hasMany(AttendanceRecord, { foreignKey: "StudentId" });
AttendanceRecord.belongsTo(Student, { foreignKey: "StudentId" });

// A class has many Attendance Records
Class.hasMany(AttendanceRecord, { foreignKey: "ClassId" });
AttendanceRecord.belongsTo(Class, { foreignKey: "ClassId" });

// Q3 - Write code to

// 1. Mark attendance for a student in a class on a given date
const markAttendance = async (studentId, classId, date, status) => {
    return await AttendanceRecord.create({
        StudentId: studentId,
        ClassId: classId,
        date,
        status,
    });
};

// 2. Get attendance for a student on a specific date
const getAttendanceByDate = async (studentId, date) => {
    return await AttendanceRecord.findOne({
        where: { StudentId: studentId, date },
        include: [Class],
    });
};

// 3. List attendance for all students in a class
const getAttendanceByClass = async (classId) => {
    return await AttendanceRecord.findAll({
        where: { ClassId: classId },
        include: [Student],
        order: [["date", "ASC"]],
    });
};

// 4. Get attendance summary for a student
const getAttendanceSummary = async (studentId) => {
    const records= await AttendanceRecord.findAll({
        where: { StudentId: studentId },
    });

    const summary = { Present: 0, Absent: 0, Late: 0 };

    for (const rec of records) {
        summary[rec.status]++;
    }

    return summary;
};

async function initDatabase() {
  await sequelize.sync();
  console.log("Database synchronized");

  if ((await Student.count()) === 0) {
    await Student.bulkCreate([
      { name: "Alice Smith", email: "alice.smith@example.com" },
      { name: "Bob Johnson", email: "bob.johnson@example.com" },
      { name: "Charlie Lee", email: "charlie.lee@example.com" },
      { name: "Diana King", email: "diana.king@example.com" },
      { name: "Ethan Wright", email: "ethan.wright@example.com" },
    ]);
    console.log("✅ Students added");
  }

  if ((await Class.count()) === 0) {
    await Class.bulkCreate([
      { name: "Math 101", schedule: "Mon-Wed-Fri 9AM-10AM" },
      { name: "Physics 201", schedule: "Tue-Thu 10AM-11:30AM" },
      { name: "Chemistry 301", schedule: "Mon-Wed 1PM-2:30PM" },
      { name: "English Literature", schedule: "Fri 3PM-5PM" },
      { name: "Computer Science", schedule: "Tue-Thu 2PM-3:30PM" },
    ]);
    console.log("✅ Classes added");
  }

  if ((await AttendanceRecord.count()) === 0) {
    await AttendanceRecord.bulkCreate([
      { StudentId: 1, ClassId: 1, date: "2025-06-26", status: "Present" },
      { StudentId: 2, ClassId: 1, date: "2025-06-26", status: "Absent" },
      { StudentId: 3, ClassId: 2, date: "2025-06-17", status: "Late" },
      { StudentId: 4, ClassId: 3, date: "2025-06-17", status: "Present" },
      { StudentId: 5, ClassId: 4, date: "2025-06-26", status: "Present" },
    ]);
    console.log("✅ Sample attendance records added");
  }
}

// TODO - Export the model User
export {
    Student, 
    Class, 
    AttendanceRecord, 
    markAttendance, 
    getAttendanceByDate, 
    getAttendanceByClass, 
    getAttendanceSummary,
    initDatabase,
};