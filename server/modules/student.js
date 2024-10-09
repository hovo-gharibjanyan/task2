const { connectToDb, getDb } = require("../db.js");
const { v4: uuidv4 } = require('uuid');
let db;
connectToDb((error) => {
  if (!error) {
    db = getDb();
  }
});

module.exports = class Student {
  async createStudent(req, res) {
    const { name, surname, age } = req.body;
    const student = { name, surname, age, id: uuidv4() }; // Create student with uuid

    try {
      await db.collection("Group").insertOne(student);
      return res.status(200).json({ message: "Student added successfully", id: student.id });
    } catch (error) {
      return res.status(500).json({ err: "Server error" });
    }
  }

  async updateStudent(req, res) {
    const { id, name, surname, age } = req.body;  // Get id from request body

    if (!id) {
      return res.status(400).json({ err: "Student ID is required" });
    }

    try {
      const result = await db.collection("Group").findOneAndUpdate(
        { id },  // Find the student by unique ID
        { $set: { name, surname, age } },  // Update the fields
        { returnDocument: 'after' }  // Return the updated document
      );

      if (!result.value) {
        return res.status(404).json({ err: "Student not found" });
      }

      return res.status(200).json({ message: "Student updated successfully", student: result.value });
    } catch (error) {
      return res.status(500).json({ err: "Server error" });
    }
  }
  async getAllStudents(req, res) {
    try {
      const students = await db.collection('Group').find().toArray();
      return res.status(200).json(students);
    } catch (error) {
      return res.status(500).json({ err: "Server error" });
    }
  }
  
  async deleteStudent(req, res) {
    const { id } = req.params;

    try {
      const result = await db.collection('Group').deleteOne({ id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ err: "Student not found" });
      }

      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      return res.status(500).json({ err: "Server error" });
    }
  }
};
