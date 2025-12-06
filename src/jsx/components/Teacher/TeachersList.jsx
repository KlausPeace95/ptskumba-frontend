import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeachers, deleteTeacher, searchTeachersByName } from '../../../services/TeachersService';
import { useAuthStore } from '../../../store/store';

const TeachersList = () => {
    const { token, user } = useAuthStore();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    // Load teachers on component mount
    useEffect(() => {
        if (token && user) {
            loadTeachers();
        }
    }, [token, user]);

    // Filter teachers based on search term
    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = teachers.filter(teacher => 
                teacher.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.empId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTeachers(filtered);
        } else {
            setFilteredTeachers(teachers);
        }
    }, [searchTerm, teachers]);

    const loadTeachers = async () => {
        try {
            setLoading(true);
            setError(null);
            const teachersData = await getAllTeachers();
            setTeachers(teachersData);
            setFilteredTeachers(teachersData);
            console.log('✅ Teachers loaded:', teachersData);
        } catch (err) {
            console.error('❌ Error loading teachers:', err);
            setError('Failed to load teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete teacher "${name}"?`)) {
            try {
                setLoading(true);
                await deleteTeacher(id);
                setTeachers(prev => prev.filter(teacher => teacher.id !== id));
                setFilteredTeachers(prev => prev.filter(teacher => teacher.id !== id));
                console.log('✅ Teacher deleted successfully');
            } catch (err) {
                console.error('❌ Error deleting teacher:', err);
                alert('Failed to delete teacher: ' + (err.response?.data?.error || err.message));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            try {
                setLoading(true);
                const results = await searchTeachersByName(searchTerm);
                setFilteredTeachers(results);
            } catch (err) {
                console.error('❌ Error searching teachers:', err);
                setError('Search failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setFilteredTeachers(teachers);
    };

    if (!token || !user) {
        return (
            <div className="container-fluid">
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Please log in to view teachers.
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">👨‍🏫 Teachers Management</h5>
                                <Link to="/teachers/add" className="btn btn-primary">
                                    <i className="fas fa-plus me-2"></i>Add New Teacher
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search teachers by name, email, or employment ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <button 
                                            className="btn btn-outline-primary" 
                                            onClick={handleSearch}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                        {searchTerm && (
                                            <button 
                                                className="btn btn-outline-secondary" 
                                                onClick={clearSearch}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-outline-success"
                                            onClick={loadTeachers}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-sync me-2"></i>Refresh
                                        </button>
                                        <Link to="/dashboard" className="btn btn-outline-info">
                                            <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info">
                            <div className="d-flex align-items-center">
                                <div className="spinner-border spinner-border-sm me-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div>Loading teachers...</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-triangle me-2"></i>{error}
                        </div>
                    </div>
                </div>
            )}

            {/* Teachers Table */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h6 className="mb-0">
                                Teachers List ({filteredTeachers.length} of {teachers.length})
                            </h6>
                        </div>
                        <div className="card-body p-0">
                            {filteredTeachers.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted">No teachers found</h5>
                                    <p className="text-muted">
                                        {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first teacher'}
                                    </p>
                                    {!searchTerm && (
                                        <Link to="/teachers/add" className="btn btn-primary">
                                            <i className="fas fa-plus me-2"></i>Add First Teacher
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Photo</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Employment ID</th>
                                                <th>Subjects</th>
                                                <th>Gender</th>
                                                <th>Salary</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTeachers.map((teacher) => (
                                                <tr key={teacher.id}>
                                                    <td>
                                                        <div className="avatar avatar-sm">
                                                            <div className="avatar-initial bg-primary text-white rounded-circle">
                                                                {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <h6 className="mb-0">
                                                                {teacher.first_name} {teacher.middle_name} {teacher.last_name}
                                                            </h6>
                                                            <small className="text-muted">{teacher.short_name}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="text-primary">{teacher.email}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">{teacher.empId}</span>
                                                    </td>
                                                    <td>
                                                        {teacher.subject_specialization_display && teacher.subject_specialization_display.length > 0 ? (
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {teacher.subject_specialization_display.slice(0, 2).map((subject, index) => (
                                                                    <span key={index} className="badge bg-secondary">
                                                                        {subject}
                                                                    </span>
                                                                ))}
                                                                {teacher.subject_specialization_display.length > 2 && (
                                                                    <span className="badge bg-light text-dark">
                                                                        +{teacher.subject_specialization_display.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">No subjects</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${teacher.gender === 'Male' ? 'bg-primary' : 'bg-pink'}`}>
                                                            {teacher.gender}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-bold text-success">
                                                            {teacher.salary ? `₦${teacher.salary.toLocaleString()}` : 'Not set'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <Link 
                                                                to={`/teachers/edit/${teacher.id}`}
                                                                className="btn btn-outline-primary"
                                                                title="Edit Teacher"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button 
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDelete(teacher.id, `${teacher.first_name} ${teacher.last_name}`)}
                                                                title="Delete Teacher"
                                                                disabled={loading}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
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
        </div>
    );
};

export default TeachersList;
