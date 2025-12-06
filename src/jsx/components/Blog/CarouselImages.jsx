import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Modal, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { BlogService } from '../../../services/BlogService';
import { useAuthStore } from '../../../store/store';

const CarouselImages = () => {
    const { token, user } = useAuthStore();
    const [carouselImages, setCarouselImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        picture: null
    });
    const [formErrors, setFormErrors] = useState({});
    const fileInputRef = useRef(null);

    // Debug functions
    const testAPIConnection = async () => {
        try {
            console.log('🧪 Testing Carousel Images API connection...');
            const data = await BlogService.getCarouselImages();
            console.log('✅ Carousel Images API connection successful:', data);
            alert('✅ Carousel Images API connection successful!');
        } catch (error) {
            console.error('❌ Carousel Images API connection failed:', error);
            alert('❌ Carousel Images API connection failed: ' + (error?.response?.data || error?.message));
        }
    };

    const testCreateCarouselImage = async () => {
        try {
            console.log('🧪 Testing Carousel Image creation...');
            const testData = new FormData();
            testData.append('title', 'Test Carousel Image');
            testData.append('description', 'This is a test carousel image for API testing.');
            
            const result = await BlogService.createCarouselImage(testData);
            console.log('✅ Test carousel image created successfully:', result);
            alert('✅ Test carousel image created successfully! Check console for details.');
            
            // Reload carousel images to show the new test image
            await loadCarouselImages();
        } catch (error) {
            console.error('❌ Test carousel image creation failed:', error);
            alert('❌ Test carousel image creation failed: ' + (error?.response?.data || error?.message));
        }
    };

    // Load carousel images from backend
    useEffect(() => {
        if (token && user) {
            loadCarouselImages();
        }
    }, [token, user]);

    const loadCarouselImages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await BlogService.getCarouselImages();
            setCarouselImages(response);
        } catch (err) {
            console.error('Error loading carousel images:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load carousel images');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, picture: file }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!editingImage && !formData.picture) errors.picture = 'Image is required for new carousel items';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            if (formData.picture) {
                submitData.append('picture', formData.picture);
            }

            if (editingImage) {
                await BlogService.updateCarouselImage(editingImage.id, submitData);
            } else {
                await BlogService.createCarouselImage(submitData);
            }

            setShowModal(false);
            resetForm();
            loadCarouselImages();
        } catch (err) {
            console.error('Error saving carousel image:', err);
            setError(err.response?.data?.message || err.message || 'Failed to save carousel image');
        }
    };

    const handleEdit = (image) => {
        setEditingImage(image);
        setFormData({
            title: image.title || '',
            description: image.description || '',
            picture: null
        });
        setShowModal(true);
    };

    const handleDelete = async (imageId) => {
        if (window.confirm('Are you sure you want to delete this carousel image?')) {
            try {
                await BlogService.deleteCarouselImage(imageId);
                loadCarouselImages();
            } catch (err) {
                console.error('Error deleting carousel image:', err);
                setError(err.response?.data?.message || err.message || 'Failed to delete carousel image');
            }
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', picture: null });
        setEditingImage(null);
        setFormErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                <p className="mt-2">Loading carousel images...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="heading mb-0">Carousel Images</h4>
                            <Button variant="primary" onClick={openCreateModal}>
                                <i className="fas fa-plus me-2"></i>Add New Image
                            </Button>
                        </div>
                        <div className="card-body">
                            {/* Debug Information Section */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card border-info">
                                        <div className="card-header bg-info text-white">
                                            <h6 className="mb-0">🔍 Debug Information</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <h6>Authentication Status</h6>
                                                    <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</p>
                                                    <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
                                                    <p><strong>LocalStorage Token:</strong> {localStorage.getItem('userToken') ? 'Present' : 'Missing'}</p>
                                                </div>
                                                <div className="col-md-3">
                                                    <h6>🧪 API Testing</h6>
                                                    <button className="btn btn-primary btn-sm me-2 mb-2" onClick={testAPIConnection}>
                                                        Test API Connection
                                                    </button>
                                                    <button className="btn btn-success btn-sm me-2 mb-2" onClick={testCreateCarouselImage}>
                                                        Test Create Image
                                                    </button>
                                                    <button className="btn btn-info btn-sm mb-2" onClick={loadCarouselImages}>
                                                        🔄 Reload Data
                                                    </button>
                                                </div>
                                                <div className="col-md-3">
                                                    <h6>Data Status</h6>
                                                    <p><strong>Carousel Images Count:</strong> {carouselImages.length}</p>
                                                    <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                                                    <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
                                                </div>
                                                <div className="col-md-3">
                                                    <h6>Form Status</h6>
                                                    <p><strong>Modal Open:</strong> {showModal ? 'Yes' : 'No'}</p>
                                                    <p><strong>Editing:</strong> {editingImage ? 'Yes' : 'No'}</p>
                                                    <p><strong>Form Errors:</strong> {Object.keys(formErrors).length}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <h6>Debug Data (First 2 carousel images):</h6>
                                                <pre className="bg-light p-2 rounded">{JSON.stringify(carouselImages.slice(0, 2), null, 2)}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}

                            {carouselImages.length === 0 ? (
                                <div className="text-center py-4">
                                    <div className="alert alert-info" role="alert">
                                        <i className="fas fa-info-circle me-2"></i>
                                        No carousel images found. Add your first image to get started!
                                    </div>
                                </div>
                            ) : (
                                <Row>
                                    {carouselImages.map((image) => (
                                        <Col key={image.id} lg={4} md={6} className="mb-4">
                                            <Card className="h-100">
                                                <div className="position-relative">
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={image.picture} 
                                                        alt={image.title}
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div className="position-absolute top-0 end-0 m-2">
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="outline-light" size="sm">
                                                                <i className="fas fa-ellipsis-v"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => handleEdit(image)}>
                                                                    <i className="fas fa-edit me-2"></i>Edit
                                                                </Dropdown.Item>
                                                                <Dropdown.Item 
                                                                    onClick={() => handleDelete(image.id)}
                                                                    className="text-danger"
                                                                >
                                                                    <i className="fas fa-trash me-2"></i>Delete
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <Card.Body>
                                                    <Card.Title className="h6">{image.title}</Card.Title>
                                                    <Card.Text className="text-muted small">
                                                        {image.description}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingImage ? 'Edit Carousel Image' : 'Add New Carousel Image'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title *</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.title}
                                placeholder="Enter image title"
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.title}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.description}
                                placeholder="Enter image description"
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image {!editingImage && '*'}</Form.Label>
                            <Form.Control
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                isInvalid={!!formErrors.picture}
                            />
                            <Form.Text className="text-muted">
                                {editingImage 
                                    ? 'Upload a new image to replace the current one (optional)'
                                    : 'Upload an image for the carousel (required)'
                                }
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {formErrors.picture}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {editingImage && editingImage.picture && (
                            <Form.Group className="mb-3">
                                <Form.Label>Current Image</Form.Label>
                                <div>
                                    <img 
                                        src={editingImage.picture} 
                                        alt="Current"
                                        className="img-thumbnail"
                                        style={{ maxWidth: '200px' }}
                                    />
                                </div>
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingImage ? 'Update Image' : 'Add Image'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default CarouselImages;
