import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Modal, Form, Button, Alert } from 'react-bootstrap';
import { BlogService } from '../../../services/BlogService';
import { useAuthStore } from '../../../store/store';

const Articles = () => {
    const { token, user } = useAuthStore();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        picture: null
    });
    const [formErrors, setFormErrors] = useState({});
    const fileInputRef = useRef(null);

    // Debug functions
    const testAPIConnection = async () => {
        try {
            console.log('🧪 Testing Articles API connection...');
            const data = await BlogService.getArticles();
            console.log('✅ Articles API connection successful:', data);
            alert('✅ Articles API connection successful!');
        } catch (error) {
            console.error('❌ Articles API connection failed:', error);
            alert('❌ Articles API connection failed: ' + (error?.response?.data || error?.message));
        }
    };

    const testCreateArticle = async () => {
        try {
            console.log('🧪 Testing Article creation...');
            const testData = new FormData();
            testData.append('title', 'Test Article');
            testData.append('content', 'This is a test article for API testing.');
            
            const result = await BlogService.createArticle(testData);
            console.log('✅ Test article created successfully:', result);
            alert('✅ Test article created successfully! Check console for details.');
            
            // Reload articles to show the new test article
            await loadArticles();
        } catch (error) {
            console.error('❌ Test article creation failed:', error);
            alert('❌ Test article creation failed: ' + (error?.response?.data || error?.message));
        }
    };

    // Load articles from backend
    useEffect(() => {
        if (token && user) {
            loadArticles();
        }
    }, [token, user]);

    const loadArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await BlogService.getArticles();
            setArticles(response);
        } catch (err) {
            console.error('Error loading articles:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load articles');
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
        if (!formData.content.trim()) errors.content = 'Content is required';
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
            submitData.append('content', formData.content);
            if (formData.picture) {
                submitData.append('picture', formData.picture);
            }

            if (editingArticle) {
                await BlogService.updateArticle(editingArticle.id, submitData);
            } else {
                await BlogService.createArticle(submitData);
            }

            setShowModal(false);
            resetForm();
            loadArticles();
        } catch (err) {
            console.error('Error saving article:', err);
            setError(err.response?.data?.message || err.message || 'Failed to save article');
        }
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title || '',
            content: article.content || '',
            picture: null
        });
        setShowModal(true);
    };

    const handleDelete = async (articleId) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await BlogService.deleteArticle(articleId);
                loadArticles();
            } catch (err) {
                console.error('Error deleting article:', err);
                setError(err.response?.data?.message || err.message || 'Failed to delete article');
            }
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', picture: null });
        setEditingArticle(null);
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
                <p className="mt-2">Loading articles...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="heading mb-0">Articles</h4>
                            <Button variant="primary" onClick={openCreateModal}>
                                <i className="fas fa-plus me-2"></i>Add New Article
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
                                                    <button className="btn btn-success btn-sm me-2 mb-2" onClick={testCreateArticle}>
                                                        Test Create Article
                                                    </button>
                                                    <button className="btn btn-info btn-sm mb-2" onClick={loadArticles}>
                                                        🔄 Reload Data
                                                    </button>
                                                </div>
                                                <div className="col-md-3">
                                                    <h6>Data Status</h6>
                                                    <p><strong>Articles Count:</strong> {articles.length}</p>
                                                    <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                                                    <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
                                                </div>
                                                <div className="col-md-3">
                                                    <h6>Form Status</h6>
                                                    <p><strong>Modal Open:</strong> {showModal ? 'Yes' : 'No'}</p>
                                                    <p><strong>Editing:</strong> {editingArticle ? 'Yes' : 'No'}</p>
                                                    <p><strong>Form Errors:</strong> {Object.keys(formErrors).length}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <h6>Debug Data (First 2 articles):</h6>
                                                <pre className="bg-light p-2 rounded">{JSON.stringify(articles.slice(0, 2), null, 2)}</pre>
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

                            {articles.length === 0 ? (
                                <div className="text-center py-4">
                                    <div className="alert alert-info" role="alert">
                                        <i className="fas fa-info-circle me-2"></i>
                                        No articles found. Create your first article to get started!
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Content Preview</th>
                                                <th>Author</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((article) => (
                                                <tr key={article.id}>
                                                    <td>
                                                        {article.picture ? (
                                                            <img 
                                                                src={article.picture} 
                                                                alt={article.title}
                                                                className="img-thumbnail"
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div className="bg-light d-flex align-items-center justify-content-center"
                                                                 style={{ width: '60px', height: '60px' }}>
                                                                <i className="fas fa-image text-muted"></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <strong>{article.title}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="text-muted">
                                                            {article.short_content || article.content?.substring(0, 100)}...
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">
                                                            {article.created_by || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small className="text-muted">
                                                            {new Date(article.created_at).toLocaleDateString()}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                                                                <i className="fas fa-ellipsis-v"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => handleEdit(article)}>
                                                                    <i className="fas fa-edit me-2"></i>Edit
                                                                </Dropdown.Item>
                                                                <Dropdown.Item 
                                                                    onClick={() => handleDelete(article.id)}
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
                                    </table>
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
                        {editingArticle ? 'Edit Article' : 'Create New Article'}
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
                                placeholder="Enter article title"
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.title}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Content *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.content}
                                placeholder="Enter article content"
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.content}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <Form.Text className="text-muted">
                                Upload an image for your article (optional)
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingArticle ? 'Update Article' : 'Create Article'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Articles;
