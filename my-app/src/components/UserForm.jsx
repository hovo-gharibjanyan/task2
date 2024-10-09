import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: ''
  });

  const [students, setStudents] = useState([]);  // Store all students
  const [studentData, setStudentData] = useState(null);  // Store submitted student data
  const [isEditOpen, setIsEditOpen] = useState(false);  // Track dialog open state
  const [editData, setEditData] = useState(null);       // Store data to edit

  useEffect(() => {
    // Fetch all students when the component mounts
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get('http://localhost:7070/all-students');
      setStudents(response.data); // Set the list of students
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7070', formData);
      console.log('Response from server:', response.data);
      
      setStudents([...students, { ...formData, id: response.data.id }]); // Add the new student to the list
      setFormData({ name: '', surname: '', age: '' }); // Reset the form
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  // Open edit dialog
  const handleEditOpen = (student) => {
    setEditData(student);
    setIsEditOpen(true);
  };

  // Close edit dialog
  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  // Handle submit for edit form
  const handleEditSubmit = async () => {
    try {
      // Send updated student data to backend with ID
      await axios.put('http://localhost:7070/update-student', editData);
      
      // Update the students array with the edited student
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === editData.id ? { ...editData } : student
        )
      );

      setIsEditOpen(false);  // Close the dialog
    } catch (error) {
      console.error('Error updating student information:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7070/delete-student/${id}`);
      
      // Remove the student from the students array
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Form to Add New Student */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit
        </Button>
      </form>

      {/* Display All Students */}
      {students.map((student) => (
        <Card style={{ marginTop: '20px' }} key={student.id}>
          <CardContent>
            <Typography variant="h5">Student Information</Typography>
            <Typography variant="body1">Name: {student.name}</Typography>
            <Typography variant="body1">Surname: {student.surname}</Typography>
            <Typography variant="body1">Age: {student.age}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEditOpen(student)}
              style={{ marginTop: '10px' }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(student.id)}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Student Information</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editData?.name || ''}
            onChange={handleEditChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            label="Surname"
            name="surname"
            value={editData?.surname || ''}
            onChange={handleEditChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={editData?.age || ''}
            onChange={handleEditChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserForm;
