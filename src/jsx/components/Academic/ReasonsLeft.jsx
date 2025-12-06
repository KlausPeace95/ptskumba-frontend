import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Table, Dropdown } from 'react-bootstrap';
import { AcademicService } from '../../../services/AcademicService';

const ReasonsLeft = () => {
  const [reasonsLeft, setReasonsLeft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReason, setEditingReason] = useState(null);
  const [formData, setFormData] = useState({
    reason: ''
  });

  // Load reasons left on component mount
  useEffect(() => {
    loadReasonsLeft();
  }, []);

  const loadReasonsLeft = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AcademicService.getReasonsLeft();
      setReasonsLeft(data);
    } catch (err) {
      console.error('Error loading reasons left:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load reasons left');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.reason.trim()) {
      setError('Reason is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingReason) {
        await AcademicService.updateReasonLeft(editingReason.id, formData);
      } else {
        await AcademicService.createReasonLeft(formData);
      }

      setShowModal(false);
      resetForm();
      loadReasonsLeft();
    } catch (err) {
      console.error('Error saving reason left:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save reason left');
    }
  };

  const handleEdit = (reason) => {
    setEditingReason(reason);
    setFormData({
      reason: reason.reason || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (reasonId) => {
    if (window.confirm('Are you sure you want to delete this reason?')) {
      try {
        await AcademicService.deleteReasonLeft(reasonId);
        loadReasonsLeft();
      } catch (err) {
        console.error('Error deleting reason left:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete reason left');
      }
    }
  };

  const resetForm = () => {
    setFormData({ reason: '' });
    setEditingReason(null);
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
        <p className="mt-2">Loading reasons left...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Reasons Left</h4>
              <Button variant="primary" onClick={openCreateModal}>
                <i className="fas fa-plus me-2"></i>Add New Reason
              </Button>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {reasonsLeft.length === 0 ? (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    No reasons left found. Create your first reason to get started!
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reasonsLeft.map((reason) => (
                        <tr key={reason.id}>
                          <td>
                            <span className="badge bg-primary">{reason.id}</span>
                          </td>
                          <td>
                            <strong>{reason.reason}</strong>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(reason)}>
                                  <i className="fas fa-edit me-2"></i>Edit
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleDelete(reason.id)}
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
            {editingReason ? 'Edit Reason Left' : 'Create New Reason Left'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Reason *</Form.Label>
              <Form.Control
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason (e.g., Graduated, Transferred, Dropped out)"
                required
              />
              <Form.Text className="text-muted">
                The reason why a student left the school
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingReason ? 'Update Reason' : 'Create Reason'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ReasonsLeft;
