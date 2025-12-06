import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { StudentsService } from '../../../services/StudentsService';
import { useAuthStore } from '../../../store/store';

const Students = () => {
    const navigate = useNavigate();
    const { token, user } = useAuthStore();
    
    // State for real data
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        class_level: ''
    });
    
    // Pagination
    const recordsPerPage = 15;
    
    // Load students from backend
    const loadStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔍 Loading students with filters:', filters);
            const response = await StudentsService.getStudents({
                ...filters,
                page: currentPage,
                page_size: recordsPerPage
            });
            
            if (response.results) {
                setStudents(response.results);
                setTotalPages(Math.ceil(response.count / recordsPerPage));
            } else {
                setStudents(response);
                setTotalPages(1);
            }
            
            console.log('✅ Students loaded successfully:', response);
        } catch (err) {
            console.error('❌ Error loading students:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };
    
    // Load students on component mount and filter changes
    useEffect(() => {
        if (token && user) {
            loadStudents();
        }
    }, [currentPage, filters, token, user]);
    
    // Handle search input changes
    const handleSearchChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };
    
    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    // Handle student deletion
    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await StudentsService.deleteStudent(studentId);
                console.log('✅ Student deleted successfully');
                loadStudents(); // Reload the list
            } catch (err) {
                console.error('❌ Error deleting student:', err);
                alert('Failed to delete student: ' + (err.response?.data?.message || err.message));
            }
        }
    };
    
    // Handle bulk upload
    const handleBulkUpload = async (file) => {
        try {
            setLoading(true);
            console.log('🔍 Starting bulk upload with file:', file.name, 'Size:', file.size);
            const result = await StudentsService.bulkUploadStudents(file);
            console.log('✅ Bulk upload successful:', result);
            alert(`Successfully uploaded ${result.message || 'students'}`);
            loadStudents(); // Reload the list
        } catch (err) {
            console.error('❌ Error in bulk upload:', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.detail || err.message || 'Unknown error';
            alert('Bulk upload failed: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Render loading state
    if (loading && students.length === 0) {
        return (
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading students...</span>
                            </div>
                            <p className="mt-3">Loading students from backend...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Render error state
    if (error) {
        return (
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="alert alert-danger" role="alert">
                                <h4 className="alert-heading">Error Loading Students</h4>
                                <p>{error}</p>
                                <button 
                                    className="btn btn-primary btn-sm" 
                                    onClick={loadStudents}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="page-title flex-wrap">
                                <div className="input-group search-area mb-md-0 mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Search by first name..." 
                                        value={filters.first_name}
                                        onChange={(e) => handleSearchChange('first_name', e.target.value)}
                                    />
                                    <span className="input-group-text">
                                        <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5605 15.4395L13.7527 11.6317C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6317 13.7527L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9747 18.1462 16.0252 17.5605 15.4395V15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5V7.5Z" fill="#01A3FF" />
                                        </svg>
                                    </span>
                                </div>
                                <div className='d-flex'>
                                    <input 
                                        type="text" 
                                        className="form-control me-3" 
                                        placeholder="Search by last name..." 
                                        value={filters.last_name}
                                        onChange={(e) => handleSearchChange('last_name', e.target.value)}
                                        style={{ width: '200px' }}
                                    />
                                    <input 
                                        type="text" 
                                        className="form-control me-3" 
                                        placeholder="Search by class level..." 
                                        value={filters.class_level}
                                        onChange={(e) => handleSearchChange('class_level', e.target.value)}
                                        style={{ width: '200px' }}
                                    />
                                    <button 
                                        className="btn btn-primary me-3"
                                        onClick={() => navigate('/add-student')}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add Student
                                    </button>
                                    <label className={`btn btn-success mb-0 ${loading ? 'disabled' : ''}`}>
                                        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-upload'} me-2`}></i>
                                        {loading ? 'Uploading...' : 'Bulk Upload'}
                                        <input 
                                            type="file" 
                                            accept=".xlsx,.xls,.csv" 
                                            style={{ display: 'none' }}
                                            disabled={loading}
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    handleBulkUpload(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Students Table */}
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Full Name</th>
                                            <th>Admission Number</th>
                                            <th>Class Level</th>
                                            <th>Gender</th>
                                            <th>Parent Contact</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id}>
                                                <td>{student.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-sm me-3">
                                                            <div className="avatar-initial rounded-circle bg-primary">
                                                                {student.first_name?.[0]}{student.last_name?.[0]}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">{student.full_name}</h6>
                                                            <small className="text-muted">
                                                                {student.first_name} {student.middle_name} {student.last_name}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{student.admission_number}</td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {student.class_level_display}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${student.gender === 'M' ? 'bg-primary' : 'bg-pink'}`}>
                                                        {student.gender === 'M' ? 'Male' : 'Female'}
                                                    </span>
                                                </td>
                                                <td>{student.parent_contact || 'N/A'}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link 
                                                            to={`/student-detail/${student.id}`}
                                                            className="btn btn-sm btn-info"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </Link>
                                                        <Link 
                                                            to={`/add-student/${student.id}`}
                                                            className="btn btn-sm btn-warning"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteStudent(student.id)}
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
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                        
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                            
                            {/* Results count */}
                            <div className="text-center mt-3">
                                <p className="text-muted">
                                    Showing {students.length} students 
                                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default Students;