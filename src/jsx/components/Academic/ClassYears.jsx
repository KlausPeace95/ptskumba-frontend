import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';

const ClassYears = () => {
  const [classYears, setClassYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClassYear, setEditingClassYear] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    full_name: ''
  });

  // Load class years on component mount
  useEffect(() => {
    loadClassYears();
  }, []);

  const loadClassYears = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AcademicService.getClassYears();
      setClassYears(data);
    } catch (err) {
      console.error('Error loading class years:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load class years');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.year.trim()) {
      setError('Year is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingClassYear) {
        await AcademicService.updateClassYear(editingClassYear.id, formData);
      } else {
        await AcademicService.createClassYear(formData);
      }

      setShowModal(false);
      resetForm();
      loadClassYears();
    } catch (err) {
      console.error('Error saving class year:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save class year');
    }
  };

  const handleEdit = (classYear) => {
    setEditingClassYear(classYear);
    setFormData({
      year: classYear.year || '',
      full_name: classYear.full_name || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (classYearId) => {
    if (window.confirm('Are you sure you want to delete this class year?')) {
      try {
        await AcademicService.deleteClassYear(classYearId);
        loadClassYears();
      } catch (err) {
        console.error('Error deleting class year:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete class year');
      }
    }
  };

  const resetForm = () => {
    setFormData({ year: '', full_name: '' });
    setEditingClassYear(null);
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
        <p className="mt-2">Loading class years...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Class Years</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Class Year
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {classYears.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No class years found. Create your first class year to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Year</th>
                        <th>Full Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classYears.map((classYear) => (
                        <tr key={classYear.id}>
                          <td>
                            <span className="badge bg-primary">{classYear.id}</span>
                          </td>
                          <td>
                            <strong>{classYear.year}</strong>
                          </td>
                          <td>
                            <span className="text-muted">
                              {classYear.full_name || `Class of ${classYear.year}`}
                            </span>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(classYear)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(classYear.id)}
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
            {editingClassYear ? 'Edit Class Year' : 'Create New Class Year'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Year *</Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="Enter year (e.g., 2020)"
                required
              />
              <Form.Text className="text-muted">
                The academic year (e.g., 2020, 2021, 2022)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter full name (e.g., Class of 2020)"
              />
              <Form.Text className="text-muted">
                Optional: Custom full name for the class year
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingClassYear ? 'Update Class Year' : 'Create Class Year'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassYears;
