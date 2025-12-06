import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [streams, setStreams] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    stream: '',
    class_teacher: '',
    capacity: 40
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
      console.log('🔍 Attempting to load all classroom data...');
      console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
      console.log('👤 Current user:', user);
      console.log('🔑 Store token:', token);
      
      // Load all required data in parallel
      const [classroomsData, classLevelsData, streamsData] = await Promise.all([
        AcademicService.getClassrooms(),
        AcademicService.getClassLevels(),
        AcademicService.getStreams()
      ]);
      
      console.log('✅ Classrooms loaded successfully:', classroomsData);
      console.log('✅ Class levels loaded successfully:', classLevelsData);
      console.log('✅ Streams loaded successfully:', streamsData);
      
      setClassrooms(classroomsData);
      setClassLevels(classLevelsData);
      setStreams(streamsData);
    } catch (err) {
      console.error('❌ Error loading classroom data:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to load classroom data');
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/classrooms/', {
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
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/classrooms/bulk-upload/', {
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
    if (!formData.name.trim()) {
      setError('Class level is required');
      return false;
    }
    if (!formData.stream.trim()) {
      setError('Stream is required');
      return false;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError('Capacity must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingClassroom) {
        await AcademicService.updateClassroom(editingClassroom.id, formData);
      } else {
        await AcademicService.createClassroom(formData);
      }

      setShowModal(false);
      resetForm();
      loadAllData();
    } catch (err) {
      console.error('Error saving classroom:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save classroom');
    }
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      name: classroom.name?.id || '',
      stream: classroom.stream?.id || '',
      class_teacher: classroom.class_teacher?.id || '',
      capacity: classroom.capacity || 40
    });
    setShowModal(true);
  };

  const handleDelete = async (classroomId) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await AcademicService.deleteClassroom(classroomId);
        loadAllData();
      } catch (err) {
        console.error('Error deleting classroom:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete classroom');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', stream: '', class_teacher: '', capacity: 40 });
    setEditingClassroom(null);
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
        <p className="mt-2">Loading classrooms...</p>
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
                    <li>🏫 Classrooms: {classrooms.length}</li>
                    <li>📚 Class Levels: {classLevels.length}</li>
                    <li>🌊 Streams: {streams.length}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Classrooms</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Classroom
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {/* Debug: Show classrooms data */}
              <div className="mb-3 p-3 bg-light border rounded">
                <small className="text-muted">
                  <strong>Debug:</strong> Classrooms loaded: {classrooms.length} | 
                  Data: {JSON.stringify(classrooms.slice(0, 2))}
                </small>
              </div>

              {classrooms.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No classrooms found. Create your first classroom to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Class Level</th>
                        <th>Stream</th>
                        <th>Class Teacher</th>
                        <th>Capacity</th>
                        <th>Occupied</th>
                        <th>Available</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classrooms.map((classroom) => (
                        <tr key={classroom.id}>
                          <td>{classroom.id}</td>
                          <td>
                            <strong>{classroom.name?.name || 'N/A'}</strong>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {classroom.stream?.name || 'N/A'}
                            </span>
                          </td>
                          <td>
                            {classroom.class_teacher ? 
                              `${classroom.class_teacher.first_name} ${classroom.class_teacher.last_name}` : 
                              'Not assigned'
                            }
                          </td>
                          <td>{classroom.capacity}</td>
                          <td>{classroom.occupied_sits}</td>
                          <td>{classroom.available_sits}</td>
                          <td>
                            <span className={`badge ${classroom.available_sits > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {classroom.class_status}
                            </span>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(classroom)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(classroom.id)}
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
            {editingClassroom ? 'Edit Classroom' : 'Create New Classroom'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Class Level *</Form.Label>
                  <Form.Select
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Class Level</option>
                    {classLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Stream *</Form.Label>
                  <Form.Select
                    name="stream"
                    value={formData.stream}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Stream</option>
                    {streams.map((stream) => (
                      <option key={stream.id} value={stream.id}>
                        {stream.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Class Teacher</Form.Label>
                  <Form.Select
                    name="class_teacher"
                    value={formData.class_teacher}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Teacher (Optional)</option>
                    {/* Teachers would be loaded here if available */}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum number of students
                  </Form.Text>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingClassroom ? 'Update Classroom' : 'Create Classroom'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Classrooms;
