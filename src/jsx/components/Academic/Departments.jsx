import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    order_rank: ''
  });

  // Get auth state
  const { user, token } = useAuthStore();

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Attempting to load departments...');
      console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
      console.log('👤 Current user:', user);
      console.log('🔑 Store token:', token);
      const data = await AcademicService.getDepartments();
      console.log('✅ Departments loaded successfully:', data);
      setDepartments(data);
    } catch (err) {
      console.error('❌ Error loading departments:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch('http://ptskumba-backend.onrender.com/api/academic/departments/', {
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
    if (!formData.name.trim()) {
      setError('Department name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingDepartment) {
        await AcademicService.updateDepartment(editingDepartment.id, formData);
      } else {
        await AcademicService.createDepartment(formData);
      }

      setShowModal(false);
      resetForm();
      loadDepartments();
    } catch (err) {
      console.error('Error saving department:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save department');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      order_rank: department.order_rank || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await AcademicService.deleteDepartment(departmentId);
        loadDepartments();
      } catch (err) {
        console.error('Error deleting department:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete department');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', order_rank: '' });
    setEditingDepartment(null);
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
        <p className="mt-2">Loading departments...</p>
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
                  <Button variant="secondary" size="sm" className="ms-2" onClick={loadDepartments}>
                    🔄 Reload Departments
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Departments</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Department
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {/* Debug: Show departments data */}
              <div className="mb-3 p-3 bg-light border rounded">
                <small className="text-muted">
                  <strong>Debug:</strong> Departments loaded: {departments.length} | 
                  Data: {JSON.stringify(departments.slice(0, 2))}
                </small>
              </div>

              {departments.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No departments found. Create your first department to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Order Rank</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((department) => (
                        <tr key={department.id}>
                          <td>{department.id}</td>
                          <td>
                            <strong>{department.name}</strong>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {department.order_rank || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(department)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(department.id)}
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
            {editingDepartment ? 'Edit Department' : 'Create New Department'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Department Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Order Rank</Form.Label>
              <Form.Control
                type="number"
                name="order_rank"
                value={formData.order_rank}
                onChange={handleInputChange}
                placeholder="Enter order rank (optional)"
              />
              <Form.Text className="text-muted">
                Used for subject reports ordering
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingDepartment ? 'Update Department' : 'Create Department'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
