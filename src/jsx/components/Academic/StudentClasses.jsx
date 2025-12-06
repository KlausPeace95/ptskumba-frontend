import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';

const StudentClasses = () => {
  const [studentClasses, setStudentClasses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudentClass, setEditingStudentClass] = useState(null);
  const [formData, setFormData] = useState({
    classroom: '',
    academic_year: '',
    student: ''
  });

  // Get auth state
  const { user, token } = useAuthStore();

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Attempting to load all student class data...');
      console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
      console.log('👤 Current user:', user);
      console.log('🔑 Store token:', token);
      
      // Load all required data in parallel
      const [studentClassesData, classroomsData] = await Promise.all([
        AcademicService.getStudentClasses(),
        AcademicService.getClassrooms()
      ]);
      
      console.log('✅ Student classes loaded successfully:', studentClassesData);
      console.log('✅ Classrooms loaded successfully:', classroomsData);
      
      setStudentClasses(studentClassesData);
      setClassrooms(classroomsData);
      
      // For now, we'll use placeholder data for academic years and students
      // In a real implementation, you'd load these from your backend
      setAcademicYears([
        { id: 1, name: '2024-2025' },
        { id: 2, name: '2023-2024' }
      ]);
      setStudents([
        { id: 1, first_name: 'John', last_name: 'Doe', admission_number: 'ST001' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', admission_number: 'ST002' }
      ]);
      
    } catch (err) {
      console.error('❌ Error loading student class data:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to load student class data');
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/student-classes/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('🧪 Test response status:', response.status);
      console.log('🧪 Test response headers:', response.headers);
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Test response data:', data);
        alert('API connection successful! Check console for details.');
      } else {
        const errorData = await response.json();
        console.log('🧪 Test error data:', errorData);
        alert(`API connection failed: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('🧪 Test connection error:', err);
      alert(`Test connection failed: ${err.message}`);
    }
  };

  // Test bulk upload endpoint
  const testBulkUploadEndpoint = async () => {
    try {
      console.log('🧪 Testing bulk upload endpoint...');
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/student-classes/bulk-upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: new FormData() // Empty form data for testing
      });
      console.log('🧪 Bulk upload test response status:', response.status);
      if (response.status === 400) {
        // 400 is expected for empty form data
        alert('Bulk upload endpoint is accessible! (400 error expected for empty data)');
      } else {
        alert(`Bulk upload endpoint response: ${response.status}`);
      }
    } catch (err) {
      console.error('🧪 Bulk upload test error:', err);
      alert(`Bulk upload test failed: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.classroom) {
      setError('Classroom is required');
      return false;
    }
    if (!formData.academic_year) {
      setError('Academic year is required');
      return false;
    }
    if (!formData.student) {
      setError('Student is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingStudentClass) {
        await AcademicService.updateStudentClass(editingStudentClass.id, formData);
      } else {
        await AcademicService.createStudentClass(formData);
      }

      setShowModal(false);
      resetForm();
      loadAllData();
    } catch (err) {
      console.error('Error saving student class:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save student class');
    }
  };

  const handleEdit = (studentClass) => {
    setEditingStudentClass(studentClass);
    setFormData({
      classroom: studentClass.classroom?.id || '',
      academic_year: studentClass.academic_year?.id || '',
      student: studentClass.student?.id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (studentClassId) => {
    if (window.confirm('Are you sure you want to delete this student class assignment?')) {
      try {
        await AcademicService.deleteStudentClass(studentClassId);
        loadAllData();
      } catch (err) {
        console.error('Error deleting student class:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete student class');
      }
    }
  };

  const resetForm = () => {
    setFormData({ classroom: '', academic_year: '', student: '' });
    setEditingStudentClass(null);
    setError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading student classes...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          {/* Debug Section */}
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">🔧 Debug Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Authentication Status:</strong></p>
                  <ul className="list-unstyled">
                    <li>👤 User: {user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</li>
                    <li>🔑 Token: {token ? 'Present' : 'Missing'}</li>
                    <li>💾 LocalStorage Token: {localStorage.getItem('userToken') ? 'Present' : 'Missing'}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <p><strong>API Testing:</strong></p>
                  <Button variant="info" size="sm" onClick={testAPIConnection}>
                    🧪 Test API Connection
                  </Button>
                  <Button variant="warning" size="sm" className="ms-2" onClick={testBulkUploadEndpoint}>
                    🧪 Test Bulk Upload
                  </Button>
                  <Button variant="secondary" size="sm" className="ms-2" onClick={loadAllData}>
                    🔄 Reload Data
                  </Button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <p><strong>Data Status:</strong></p>
                  <ul className="list-unstyled">
                    <li>👥 Student Classes: {studentClasses.length}</li>
                    <li>🏫 Classrooms: {classrooms.length}</li>
                    <li>📅 Academic Years: {academicYears.length}</li>
                    <li>🎓 Students: {students.length}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Student Classes</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Student Class
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {/* Debug: Show student classes data */}
              <div className="mb-3 p-3 bg-light border rounded">
                <small className="text-muted">
                  <strong>Debug:</strong> Student Classes loaded: {studentClasses.length} | 
                  Data: {JSON.stringify(studentClasses.slice(0, 2))}
                </small>
              </div>

              {studentClasses.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No student class assignments found. Create your first assignment to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Classroom</th>
                        <th>Academic Year</th>
                        <th>Current Class</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentClasses.map((studentClass) => (
                        <tr key={studentClass.id}>
                          <td>{studentClass.id}</td>
                          <td>
                            <strong>
                              {studentClass.student ? 
                                `${studentClass.student.first_name} ${studentClass.student.last_name}` : 
                                'N/A'
                              }
                            </strong>
                            <br />
                            <small className="text-muted">
                              {studentClass.student?.admission_number || 'No admission number'}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-primary">
                              {studentClass.classroom ? 
                                `${studentClass.classroom.name?.name || 'N/A'} ${studentClass.classroom.stream?.name || ''}` : 
                                'N/A'
                              }
                            </span>
                          </td>
                          <td>
                            {studentClass.academic_year?.name || 'N/A'}
                          </td>
                          <td>
                            <span className={`badge ${studentClass.is_current_class ? 'bg-success' : 'bg-secondary'}`}>
                              {studentClass.is_current_class ? 'Current' : 'Previous'}
                            </span>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(studentClass)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(studentClass.id)}
                                  className="text-danger"
                                >
                                  <i className="fas fa-trash me-2"></i>Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStudentClass ? 'Edit Student Class' : 'Create New Student Class Assignment'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Student *</Form.Label>
                  <Form.Select
                    name="student"
                    value={formData.student}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.admission_number})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Classroom *</Form.Label>
                  <Form.Select
                    name="classroom"
                    value={formData.classroom}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Classroom</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name?.name} {classroom.stream?.name} (Capacity: {classroom.capacity})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Academic Year *</Form.Label>
                  <Form.Select
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingStudentClass ? 'Update Student Class' : 'Create Student Class'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentClasses;
