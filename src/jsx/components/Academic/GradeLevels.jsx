import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';

const GradeLevels = () => {
  const [gradeLevels, setGradeLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGradeLevel, setEditingGradeLevel] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });

  // Load grade levels on component mount
  useEffect(() => {
    loadGradeLevels();
  }, []);

  const loadGradeLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AcademicService.getGradeLevels();
      setGradeLevels(data);
    } catch (err) {
      console.error('Error loading grade levels:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load grade levels');
    } finally {
      setLoading(false);
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
        name: formData.name
      };

      if (editingGradeLevel) {
        await AcademicService.updateGradeLevel(editingGradeLevel.id, submitData);
      } else {
        await AcademicService.createGradeLevel(submitData);
      }

      setShowModal(false);
      resetForm();
      loadGradeLevels();
    } catch (err) {
      console.error('Error saving grade level:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save grade level');
    }
  };

  const handleEdit = (gradeLevel) => {
    setEditingGradeLevel(gradeLevel);
    setFormData({
      id: gradeLevel.id.toString(),
      name: gradeLevel.name || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (gradeLevelId) => {
    if (window.confirm('Are you sure you want to delete this grade level?')) {
      try {
        await AcademicService.deleteGradeLevel(gradeLevelId);
        loadGradeLevels();
      } catch (err) {
        console.error('Error deleting grade level:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete grade level');
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '' });
    setEditingGradeLevel(null);
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
        <p className="mt-2">Loading grade levels...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Grade Levels</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Grade Level
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {gradeLevels.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No grade levels found. Create your first grade level to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeLevels.map((gradeLevel) => (
                        <tr key={gradeLevel.id}>
                          <td>
                            <span className="badge bg-primary">{gradeLevel.id}</span>
                          </td>
                          <td>
                            <strong>{gradeLevel.name}</strong>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(gradeLevel)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(gradeLevel.id)}
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
            {editingGradeLevel ? 'Edit Grade Level' : 'Create New Grade Level'}
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
                placeholder="Enter grade level ID"
                required
                disabled={!!editingGradeLevel}
              />
              <Form.Text className="text-muted">
                {editingGradeLevel ? 'ID cannot be changed' : 'Unique identifier for the grade level'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter grade level name"
                required
              />
              <Form.Text className="text-muted">
                The name of the grade level (e.g., Primary, Secondary, High School)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingGradeLevel ? 'Update Grade Level' : 'Create Grade Level'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default GradeLevels;
