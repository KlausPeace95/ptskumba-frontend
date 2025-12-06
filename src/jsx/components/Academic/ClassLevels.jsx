import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';

const ClassLevels = () => {
  const [classLevels, setClassLevels] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClassLevel, setEditingClassLevel] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    grade_level: ''
  });

  // Get auth state
  const { user, token } = useAuthStore();

  // Load class levels and grade levels on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Attempting to load class levels and grade levels...');
      console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
      console.log('👤 Current user:', user);
      console.log('🔑 Store token:', token);
      const [classLevelsData, gradeLevelsData] = await Promise.all([
        AcademicService.getClassLevels(),
        AcademicService.getGradeLevels()
      ]);
      console.log('✅ Class levels loaded successfully:', classLevelsData);
      console.log('✅ Grade levels loaded successfully:', gradeLevelsData);
      setClassLevels(classLevelsData);
      setGradeLevels(gradeLevelsData);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/class-levels/', {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.id || !formData.name.trim()) {
      setError('ID and Name are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        id: parseInt(formData.id),
        name: formData.name,
        grade_level: formData.grade_level ? parseInt(formData.grade_level) : null
      };

      if (editingClassLevel) {
        await AcademicService.updateClassLevel(editingClassLevel.id, submitData);
      } else {
        await AcademicService.createClassLevel(submitData);
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error('Error saving class level:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save class level');
    }
  };

  const handleEdit = (classLevel) => {
    setEditingClassLevel(classLevel);
    setFormData({
      id: classLevel.id.toString(),
      name: classLevel.name || '',
      grade_level: classLevel.grade_level?.id?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (classLevelId) => {
    if (window.confirm('Are you sure you want to delete this class level?')) {
      try {
        await AcademicService.deleteClassLevel(classLevelId);
        loadData();
      } catch (err) {
        console.error('Error deleting class level:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete class level');
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', grade_level: '' });
    setEditingClassLevel(null);
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
        <p className="mt-2">Loading class levels...</p>
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
                  <Button variant="secondary" size="sm" className="ms-2" onClick={loadData}>
                    🔄 Reload Data
                  </Button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <p><strong>Data Status:</strong></p>
                  <ul className="list-unstyled">
                    <li>📚 Class Levels: {classLevels.length}</li>
                    <li>📊 Grade Levels: {gradeLevels.length}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Class Levels</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Class Level
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {/* Debug: Show class levels data */}
              <div className="mb-3 p-3 bg-light border rounded">
                <small className="text-muted">
                  <strong>Debug:</strong> Class Levels loaded: {classLevels.length} | 
                  Data: {JSON.stringify(classLevels.slice(0, 2))}
                </small>
              </div>

              {classLevels.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No class levels found. Create your first class level to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Grade Level</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classLevels.map((classLevel) => (
                        <tr key={classLevel.id}>
                          <td>
                            <span className="badge bg-primary">{classLevel.id}</span>
                          </td>
                          <td>
                            <strong>{classLevel.name}</strong>
                          </td>
                          <td>
                            {classLevel.grade_level ? (
                              <span className="badge bg-info">
                                {classLevel.grade_level.name}
                              </span>
                            ) : (
                              <span className="text-muted">Not assigned</span>
                            )}
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(classLevel)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(classLevel.id)}
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
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingClassLevel ? 'Edit Class Level' : 'Create New Class Level'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ID *</Form.Label>
              <Form.Control
                type="number"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Enter class level ID"
                required
                disabled={!!editingClassLevel}
              />
              <Form.Text className="text-muted">
                {editingClassLevel ? 'ID cannot be changed' : 'Unique identifier for the class level'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter class level name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Grade Level</Form.Label>
              <Form.Select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleInputChange}
              >
                <option value="">Select Grade Level (Optional)</option>
                {gradeLevels.map((gradeLevel) => (
                  <option key={gradeLevel.id} value={gradeLevel.id}>
                    {gradeLevel.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Associate this class level with a grade level
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingClassLevel ? 'Update Class Level' : 'Create Class Level'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassLevels;
