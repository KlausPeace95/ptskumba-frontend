import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject_code: '',
    is_selectable: false,
    graded: true,
    description: '',
    department: ''
  });

  // Get auth state
  const { user, token } = useAuthStore();

  // Load subjects and departments on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Attempting to load subjects and departments...');
      console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
      console.log('👤 Current user:', user);
      console.log('🔑 Store token:', token);
      const [subjectsData, departmentsData] = await Promise.all([
        AcademicService.getSubjects(),
        AcademicService.getDepartments()
      ]);
      console.log('✅ Subjects loaded successfully:', subjectsData);
      console.log('✅ Departments loaded successfully:', departmentsData);
      setSubjects(subjectsData);
      setDepartments(departmentsData);
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
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/subjects/', {
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
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/subjects/bulk-upload/', {
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Subject name is required');
      return false;
    }
    if (!formData.subject_code.trim()) {
      setError('Subject code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        department: formData.department ? parseInt(formData.department) : null
      };

      if (editingSubject) {
        await AcademicService.updateSubject(editingSubject.id, submitData);
      } else {
        await AcademicService.createSubject(submitData);
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error('Error saving subject:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      subject_code: subject.subject_code || '',
      is_selectable: subject.is_selectable || false,
      graded: subject.graded !== false,
      description: subject.description || '',
      department: subject.department?.id?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await AcademicService.deleteSubject(subjectId);
        loadData();
      } catch (err) {
        console.error('Error deleting subject:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete subject');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject_code: '',
      is_selectable: false,
      graded: true,
      description: '',
      department: ''
    });
    setEditingSubject(null);
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
        <p className="mt-2">Loading subjects...</p>
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
                  <Button variant="secondary" size="sm" className="ms-2" onClick={loadData}>
                    🔄 Reload Data
                  </Button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <p><strong>Data Status:</strong></p>
                  <ul className="list-unstyled">
                    <li>📚 Subjects: {subjects.length}</li>
                    <li>🏢 Departments: {departments.length}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Subjects</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Subject
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {/* Debug: Show subjects data */}
              <div className="mb-3 p-3 bg-light border rounded">
                <small className="text-muted">
                  <strong>Debug:</strong> Subjects loaded: {subjects.length} | 
                  Data: {JSON.stringify(subjects.slice(0, 2))}
                </small>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No subjects found. Create your first subject to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Department</th>
                        <th>Optional</th>
                        <th>Graded</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.id}>
                          <td>
                            <span className="badge bg-primary">{subject.id}</span>
                          </td>
                          <td>
                            <strong>{subject.name}</strong>
                          </td>
                          <td>
                            <code>{subject.subject_code}</code>
                          </td>
                          <td>
                            {subject.department ? (
                              <span className="badge bg-info">{subject.department.name}</span>
                            ) : (
                              <span className="text-muted">No department</span>
                            )}
                          </td>
                          <td>
                            {subject.is_selectable ? (
                              <span className="badge bg-warning">Optional</span>
                            ) : (
                              <span className="badge bg-success">Required</span>
                            )}
                          </td>
                          <td>
                            {subject.graded ? (
                              <span className="badge bg-primary">Graded</span>
                            ) : (
                              <span className="badge bg-secondary">Not Graded</span>
                            )}
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(subject)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(subject.id)}
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
            {editingSubject ? 'Edit Subject' : 'Create New Subject'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Subject Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter subject name"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Subject Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject_code"
                    value={formData.subject_code}
                    onChange={handleInputChange}
                    placeholder="Enter subject code"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department (Optional)</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter subject description"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="is_selectable"
                    checked={formData.is_selectable}
                    onChange={handleInputChange}
                    label="Optional Subject"
                  />
                  <Form.Text className="text-muted">
                    Check if this subject is optional for students
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="graded"
                    checked={formData.graded}
                    onChange={handleInputChange}
                    label="Graded Subject"
                  />
                  <Form.Text className="text-muted">
                    Check if teachers can submit grades for this subject
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
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Subjects;
