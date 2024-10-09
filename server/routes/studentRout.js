const express = require("express");
const Student = require("../modules/student.js");
const studentRoute = express.Router();
const newStudent = new Student();

studentRoute
    .route('/')
    .post(newStudent.createStudent); // POST for creating a student

studentRoute
    .route('/update-student')
    .put(newStudent.updateStudent);

studentRoute
    .route('/all-students')
    .get(newStudent.getAllStudents);

studentRoute
    .route('/delete-student/:id')
    .delete(newStudent.deleteStudent);



module.exports = studentRoute;
