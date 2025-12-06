import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    getAdminApplications, 
    updateApplicationStatus 
} from '../../../services/ApplicationService';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [authStatus, setAuthStatus] = useState({
        isAuthenticated: false,
        token: null,
        userRole: null
    });
    const [filters, setFilters] = useState({
        status: '',
        program: '',
        search: ''
    });
    const [stats, setStats] = useState({
        total: 0,
        draft: 0,
        submitted: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        waitlisted: 0
    });

    // Check authentication status
    const checkAuthStatus = () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        
        const isAuthenticated = !!token;
        
        // Log detailed authentication info
        console.log('🔍 Admin auth check details:', {
            access_token: localStorage.getItem('access_token'),
            userToken: localStorage.getItem('userToken'),
            userData: localStorage.getItem('userData'),
            isAuthenticated,
            token: token ? token.substring(0, 20) + '...' : null,
            userRole: user?.role || 'Unknown'
        });
        
        setAuthStatus({
            isAuthenticated,
            token: token ? token.substring(0, 20) + '...' : null,
            userRole: user?.role || 'Unknown'
        });
        
        console.log('🔍 Admin auth check result:', { isAuthenticated, token: token ? 'Present' : 'None', userRole: user?.role });
        
        return isAuthenticated;
    };

    // Load applications data
    const loadApplications = async () => {
        try {
            // Check authentication first
            if (!checkAuthStatus()) {
                setError('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            console.log('🔍 Loading admin applications...');
            const data = await getAdminApplications();
            console.log('✅ Admin applications loaded:', data);
            
            if (data && Array.isArray(data)) {
                setApplications(data);
                setFilteredApplications(data);
                calculateStats(data);
            } else {
                setError('Invalid data format received');
                setApplications([]);
                setFilteredApplications([]);
            }
        } catch (error) {
            console.error('❌ Failed to load applications:', error);
            
            if (error?.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                // Clear invalid tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('userToken');
            } else {
                setError(error?.response?.data?.error || error.message || 'Failed to load applications');
            }
            
            setApplications([]);
            setFilteredApplications([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (apps) => {
        const stats = {
            total: apps.length,
            draft: apps.filter(app => app.status === 'draft').length,
            submitted: apps.filter(app => app.status === 'submitted').length,
            under_review: apps.filter(app => app.status === 'under_review').length,
            approved: apps.filter(app => app.status === 'approved').length,
            rejected: apps.filter(app => app.status === 'rejected').length,
            waitlisted: apps.filter(app => app.status === 'waitlisted').length
        };
        setStats(stats);
    };

    // Apply filters
    const applyFilters = () => {
        let filtered = [...applications];

        if (filters.status) {
            filtered = filtered.filter(app => app.status === filters.status);
        }

        if (filters.program) {
            filtered = filtered.filter(app => 
                app.program_name?.toLowerCase().includes(filters.program.toLowerCase())
            );
        }

        if (filters.search) {
            filtered = filtered.filter(app => 
                app.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                app.application_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
                app.email?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    };

    // Generate student creation URL with application data
    const getStudentCreationUrl = (application) => {
        const params = new URLSearchParams({
            fromApplication: 'true',
            firstName: application.first_name || '',
            middleName: application.middle_name || '',
            lastName: application.last_name || '',
            email: application.email || '',
            phone: application.phone_number || '',
            gender: application.gender || '',
            dateOfBirth: application.date_of_birth || '',
            religion: application.religion || '',
            nationality: application.nationality || '',
            address: application.address_line_1 || '',
            city: application.city || '',
            region: application.state_province || '',
            country: application.country || ''
        });
        
        return `/add-student?${params.toString()}`;
    };

    // Update application status
    const updateStatus = async (applicationId, newStatus, comments = '') => {
        try {
            await updateApplicationStatus(applicationId, {
                status: newStatus,
                reviewer_comments: comments
            });
            
            // Reload applications
            await loadApplications();
            
            // Show success message
            alert(`Application status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status: ' + (error?.response?.data?.error || error.message));
        }
    };

    // View application details
    const viewDetails = (application) => {
        setSelectedApplication(application);
        setShowDetails(true);
    };

    // Close details modal
    const closeDetails = () => {
        setShowDetails(false);
        setSelectedApplication(null);
    };

    // Export applications
    const exportApplications = () => {
        const csvContent = [
            ['Application ID', 'Student Name', 'Email', 'Program', 'Status', 'Submitted Date', 'Phone', 'Nationality'],
            ...filteredApplications.map(app => [
                app.application_id,
                app.full_name,
                app.email,
                app.program_name,
                app.status,
                new Date(app.created_at).toLocaleDateString(),
                app.phone_number,
                app.nationality
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Load data on component mount
    useEffect(() => {
        // Check authentication first
        checkAuthStatus();
        // Then load applications if authenticated
        if (checkAuthStatus()) {
            loadApplications();
        }
    }, []);

    // Apply filters when filters change
    useEffect(() => {
        applyFilters();
    }, [filters, applications]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error Loading Applications</h4>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={loadApplications}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="heading mb-0">📚 Student Applications Management</h4>
                            <p className="text-muted mb-0">Manage and review student applications for academic programs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Authentication Debug Panel */}
            <div className="row mb-4">
                <div className="col-xl-12">
                    <div className="card border-info">
                        <div className="card-header bg-info text-white">
                            <h5 className="heading mb-0">🔐 Authentication Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <p><strong>Status:</strong> 
                                        <span className={`badge ${authStatus.isAuthenticated ? 'bg-success' : 'bg-danger'} ms-2`}>
                                            {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong>Token:</strong> {authStatus.token || 'None'}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong>User Role:</strong> {authStatus.userRole}</p>
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-primary btn-sm me-2" onClick={checkAuthStatus}>
                                        <i className="fas fa-sync me-2"></i>Check Auth
                                    </button>
                                    <button className="btn btn-warning btn-sm" onClick={loadApplications}>
                                        <i className="fas fa-sync me-2"></i>Reload Data
                                    </button>
                                </div>
                            </div>
                            {!authStatus.isAuthenticated && (
                                <div className="alert alert-warning mt-3">
                                    <strong>⚠️ Authentication Required:</strong> You must be logged in to view applications. 
                                    <a href="/login" className="btn btn-warning btn-sm ms-3">Go to Login</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* API Testing Panel */}
            <div className="row mb-4">
                <div className="col-xl-12">
                    <div className="card border-warning">
                        <div className="card-header bg-warning text-white">
                            <h5 className="heading mb-0">🧪 API Testing & Debug</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>Test Applications API</h6>
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={async () => {
                                                try {
                                                    console.log('🧪 Testing getAdminApplications...');
                                                    const result = await getAdminApplications();
                                                    console.log('✅ getAdminApplications result:', result);
                                                    alert(`✅ getAdminApplications successful! Found ${result.length} applications`);
                                                } catch (error) {
                                                    console.error('❌ getAdminApplications failed:', error);
                                                    alert(`❌ getAdminApplications failed: ${error.message}`);
                                                }
                                            }}
                                        >
                                            Test Get Admin Applications
                                        </button>
                                        <button 
                                            className="btn btn-outline-success btn-sm"
                                            onClick={async () => {
                                                try {
                                                    console.log('🧪 Testing localStorage...');
                                                    const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
                                                    const userData = localStorage.getItem('userData');
                                                    console.log('✅ localStorage check:', { token: token ? 'Present' : 'None', userData });
                                                    alert(`✅ localStorage check: Token ${token ? 'Present' : 'None'}, UserData ${userData ? 'Present' : 'None'}`);
                                                } catch (error) {
                                                    console.error('❌ localStorage check failed:', error);
                                                    alert(`❌ localStorage check failed: ${error.message}`);
                                                }
                                            }}
                                        >
                                            Test LocalStorage
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h6>Debug Actions</h6>
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={() => {
                                                console.log('🧪 Logging current state...');
                                                console.log('Auth status:', authStatus);
                                                console.log('Applications:', applications);
                                                console.log('Error:', error);
                                                console.log('Loading:', loading);
                                                alert('✅ State logged to console!');
                                            }}
                                        >
                                            Log Current State
                                        </button>
                                        <button 
                                            className="btn btn-outline-info btn-sm"
                                            onClick={() => {
                                                const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
                                                if (token) {
                                                    try {
                                                        const payload = JSON.parse(atob(token.split('.')[1]));
                                                        const expiry = new Date(payload.exp * 1000);
                                                        alert(`Token expires: ${expiry.toLocaleString()}\nCurrent time: ${new Date().toLocaleString()}`);
                                                    } catch (e) {
                                                        alert('Invalid token format');
                                                    }
                                                } else {
                                                    alert('No token found');
                                                }
                                            }}
                                        >
                                            Check Token Expiry
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h6>Quick Actions</h6>
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => {
                                                if (confirm('Clear all authentication data?')) {
                                                    localStorage.removeItem('access_token');
                                                    localStorage.removeItem('userToken');
                                                    localStorage.removeItem('userData');
                                                    checkAuthStatus();
                                                    alert('✅ Authentication data cleared!');
                                                }
                                            }}
                                        >
                                            Clear Auth Data
                                        </button>
                                        <button 
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => {
                                                window.location.reload();
                                            }}
                                        >
                                            Reload Page
                                        </button>
                                        <button 
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => {
                                                // Simulate login for testing
                                                const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnRlcm5hbCIsIm5hbWUiOiJBZG1pbiBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3NzI3NTUyMDB9.test';
                                                localStorage.setItem('access_token', testToken);
                                                localStorage.setItem('userData', JSON.stringify({ role: 'admin', name: 'Test Admin' }));
                                                checkAuthStatus();
                                                alert('✅ Test login applied! Check auth status.');
                                            }}
                                        >
                                            Test Login
                                        </button>
                                        <button 
                                            className="btn btn-outline-info btn-sm"
                                            onClick={() => {
                                                console.log('🧪 Testing route access...');
                                                console.log('Current URL:', window.location.href);
                                                console.log('Current pathname:', window.location.pathname);
                                                console.log('Available routes:', ['/admin/applications', '/applications/admin/applications']);
                                                alert('✅ Route info logged to console!');
                                            }}
                                        >
                                            Test Route
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <h3 className="text-primary">{stats.total}</h3>
                                        <p className="mb-0">Total</p>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <h3 className="text-warning">{stats.draft}</h3>
                                        <p className="mb-0">Draft</p>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <h3 className="text-info">{stats.submitted}</h3>
                                        <p className="mb-0">Submitted</p>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <h3 className="text-secondary">{stats.under_review}</h3>
                                        <p className="mb-0">Under Review</p>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <h3 className="text-success">{stats.approved}</h3>
                                        <p className="mb-0">Approved</p>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <h3 className="text-danger">{stats.rejected}</h3>
                                        <p className="mb-0">Rejected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <label className="form-label">Status Filter</label>
                                    <select 
                                        className="form-select"
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="draft">Draft</option>
                                        <option value="submitted">Submitted</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="waitlisted">Waitlisted</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Program Filter</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search programs..."
                                        value={filters.program}
                                        onChange={(e) => setFilters(prev => ({ ...prev, program: e.target.value }))}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Search</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name, ID, or email..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Actions</label>
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-primary" onClick={loadApplications}>
                                            <i className="fas fa-sync me-2"></i>Refresh
                                        </button>
                                        <button className="btn btn-success" onClick={exportApplications}>
                                            <i className="fas fa-download me-2"></i>Export CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="heading mb-0">
                                Applications ({filteredApplications.length} of {applications.length})
                            </h5>
                        </div>
                        <div className="card-body">
                            {filteredApplications.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5>No applications found</h5>
                                    <p className="text-muted">Try adjusting your filters or refresh the data.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Application ID</th>
                                                <th>Student Name</th>
                                                <th>Email</th>
                                                <th>Program</th>
                                                <th>Status</th>
                                                <th>Submitted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.map((app) => (
                                                <tr key={app.id}>
                                                    <td>
                                                        <strong>{app.application_id}</strong>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <strong>{app.full_name}</strong>
                                                            <br />
                                                            <small className="text-muted">
                                                                {app.phone_number} • {app.nationality}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    <td>{app.email}</td>
                                                    <td>
                                                        <span className="badge bg-info">
                                                            {app.program_name}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${
                                                            app.status === 'approved' ? 'bg-success' :
                                                            app.status === 'rejected' ? 'bg-danger' :
                                                            app.status === 'under_review' ? 'bg-warning' :
                                                            app.status === 'submitted' ? 'bg-info' :
                                                            app.status === 'waitlisted' ? 'bg-secondary' :
                                                            'bg-light text-dark'
                                                        }`}>
                                                            {app.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                        <br />
                                                        <small className="text-muted">
                                                            {new Date(app.created_at).toLocaleTimeString()}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button 
                                                                className="btn btn-info btn-sm"
                                                                onClick={() => viewDetails(app)}
                                                                title="View Details"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            
                                                            {app.status === 'submitted' && (
                                                                <>
                                                                    <button 
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={() => updateStatus(app.id, 'under_review', 'Application moved to review')}
                                                                        title="Move to Review"
                                                                    >
                                                                        <i className="fas fa-eye"></i>
                                                                    </button>
                                                                    <button 
                                                                        className="btn btn-warning btn-sm"
                                                                        onClick={() => updateStatus(app.id, 'waitlisted', 'Application waitlisted')}
                                                                        title="Waitlist"
                                                                    >
                                                                        <i className="fas fa-clock"></i>
                                                                    </button>
                                                                </>
                                                            )}
                                                            
                                                            {app.status === 'under_review' && (
                                                                <>
                                                                    <button 
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={() => updateStatus(app.id, 'approved', 'Application approved')}
                                                                        title="Approve"
                                                                    >
                                                                        <i className="fas fa-check"></i>
                                                                    </button>
                                                                    <button 
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => updateStatus(app.id, 'rejected', 'Application rejected')}
                                                                        title="Reject"
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </>
                                                            )}
                                                            
                                                            {app.status === 'approved' && (
                                                                <Link 
                                                                    to={getStudentCreationUrl(app)}
                                                                    className="btn btn-primary btn-sm"
                                                                    title="Create Student Record"
                                                                >
                                                                    <i className="fas fa-user-plus"></i>
                                                                </Link>
                                                            )}
                                                        </div>
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

            {/* Application Details Modal */}
            {showDetails && selectedApplication && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Application Details - {selectedApplication.application_id}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={closeDetails}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Personal Information</h6>
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Full Name:</strong></td>
                                                    <td>{selectedApplication.full_name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Email:</strong></td>
                                                    <td>{selectedApplication.email}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Phone:</strong></td>
                                                    <td>{selectedApplication.phone_number}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Date of Birth:</strong></td>
                                                    <td>{new Date(selectedApplication.date_of_birth).toLocaleDateString()}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Gender:</strong></td>
                                                    <td>{selectedApplication.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Nationality:</strong></td>
                                                    <td>{selectedApplication.nationality}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Marital Status:</strong></td>
                                                    <td>{selectedApplication.marital_status}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Program & Status</h6>
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Program:</strong></td>
                                                    <td>{selectedApplication.program_name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Status:</strong></td>
                                                    <td>
                                                        <span className={`badge ${
                                                            selectedApplication.status === 'approved' ? 'bg-success' :
                                                            selectedApplication.status === 'rejected' ? 'bg-danger' :
                                                            selectedApplication.status === 'under_review' ? 'bg-warning' :
                                                            selectedApplication.status === 'submitted' ? 'bg-info' :
                                                            selectedApplication.status === 'waitlisted' ? 'bg-secondary' :
                                                            'bg-light text-dark'
                                                        }`}>
                                                            {selectedApplication.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Created:</strong></td>
                                                    <td>{new Date(selectedApplication.created_at).toLocaleString()}</td>
                                                </tr>
                                                {selectedApplication.submitted_at && (
                                                    <tr>
                                                        <td><strong>Submitted:</strong></td>
                                                        <td>{new Date(selectedApplication.submitted_at).toLocaleString()}</td>
                                                    </tr>
                                                )}
                                                {selectedApplication.reviewed_at && (
                                                    <tr>
                                                        <td><strong>Reviewed:</strong></td>
                                                        <td>{new Date(selectedApplication.reviewed_at).toLocaleString()}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <h6>Address Information</h6>
                                        <p>
                                            {selectedApplication.address_line_1}
                                            {selectedApplication.address_line_2 && <br />}
                                            {selectedApplication.address_line_2}
                                            <br />
                                            {selectedApplication.city}, {selectedApplication.state_province} {selectedApplication.postal_code}
                                            <br />
                                            {selectedApplication.country}
                                        </p>
                                    </div>
                                </div>

                                {selectedApplication.reviewer_comments && (
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <h6>Reviewer Comments</h6>
                                            <div className="alert alert-info">
                                                {selectedApplication.reviewer_comments}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={closeDetails}
                                >
                                    Close
                                </button>
                                {selectedApplication.status === 'submitted' && (
                                    <button 
                                        className="btn btn-success"
                                        onClick={() => {
                                            updateStatus(selectedApplication.id, 'under_review', 'Application moved to review');
                                            closeDetails();
                                        }}
                                    >
                                        Move to Review
                                    </button>
                                )}
                                {selectedApplication.status === 'under_review' && (
                                    <>
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => {
                                                updateStatus(selectedApplication.id, 'approved', 'Application approved');
                                                closeDetails();
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => {
                                                updateStatus(selectedApplication.id, 'rejected', 'Application rejected');
                                                closeDetails();
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                
                                {selectedApplication.status === 'approved' && (
                                    <Link 
                                        to={getStudentCreationUrl(selectedApplication)}
                                        className="btn btn-primary"
                                        onClick={closeDetails}
                                    >
                                        <i className="fas fa-user-plus me-2"></i>Create Student Record
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop for modal */}
            {showDetails && (
                <div className="modal-backdrop fade show"></div>
            )}
        </div>
    );
};

export default AdminApplications;

