import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UsersService from '../../../services/UsersService';
import { getAssignments } from '../../../services/AssignmentsService';
import { useAuthStore } from '../../../store/store';

const StudentDashboard = () => {
    // Get authentication state
    const { user, token } = useAuthStore();
    
    const [studentData, setStudentData] = useState({
        name: "Loading...",
        email: "Loading...",
        role: "Loading...",
        username: "Loading..."
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for assignments
    const [assignments, setAssignments] = useState([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [assignmentsError, setAssignmentsError] = useState(null);

    // Check if user is authenticated
    if (!token || !user) {
        console.log('❌ StudentDashboard: No token or user, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // Check if user is a student
    if (!user.isStudent && !user.isAdmin) {
        console.log('❌ StudentDashboard: User is not a student, redirecting to dashboard');
        return <Navigate to="/dashboard" replace />;
    }

    useEffect(() => {
        // Fetch real student profile data from backend
        const fetchStudentProfile = async () => {
            try {
                setLoading(true);
                const profile = await UsersService.getProfile();
                setStudentData({
                    name: profile.username || `${profile.first_name} ${profile.last_name}`,
                    email: profile.email,
                    role: profile.isAdmin ? 'Admin' : profile.isTeacher ? 'Teacher' : profile.isAccountant ? 'Accountant' : 'Student',
                    username: profile.username,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    id: profile.id
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching student profile:', err);
                setError(err.message);
                // Fallback to stored user data if API fails
                const storedUser = UsersService.getCurrentUser();
                if (storedUser) {
                    setStudentData({
                        name: storedUser.username || `${storedUser.first_name} ${storedUser.last_name}`,
                        email: storedUser.email,
                        role: storedUser.isAdmin ? 'Admin' : storedUser.isTeacher ? 'Teacher' : storedUser.isAccountant ? 'Accountant' : 'Student',
                        username: storedUser.username,
                        first_name: storedUser.first_name,
                        last_name: storedUser.last_name,
                        id: storedUser.id
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        // Load assignments for the student
        const loadAssignments = async () => {
            try {
                setAssignmentsLoading(true);
                console.log('📝 Loading assignments for student...');
                const data = await getAssignments();
                console.log('✅ Assignments loaded for student:', data);
                setAssignments(Array.isArray(data) ? data : []);
                setAssignmentsError(null);
            } catch (error) {
                console.error('❌ Error loading assignments for student:', error);
                setAssignmentsError(error?.response?.data || error?.message);
            } finally {
                setAssignmentsLoading(false);
            }
        };

        fetchStudentProfile();
        loadAssignments();
    }, []);

    const quickActions = [
        {
            title: 'View Results',
            icon: 'grade',
            description: 'Check your academic results and grades',
            color: 'bg-primary',
            action: () => alert('Results feature will be implemented with backend endpoints')
        },
        {
            title: 'Course Registration',
            icon: 'app_registration',
            description: 'Register for new courses',
            color: 'bg-success',
            action: () => alert('Course registration feature will be implemented with backend endpoints')
        },
        {
            title: 'Class Schedule',
            icon: 'schedule',
            description: 'View your class timetable',
            color: 'bg-info',
            action: () => alert('Class schedule feature will be implemented with backend endpoints')
        },
        {
            title: 'View Assignments',
            icon: 'assignment',
            description: 'Check your current assignments',
            color: 'bg-warning',
            action: () => document.querySelector('#assignments-section')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            title: 'Academic Records',
            icon: 'history_edu',
            description: 'Access your academic history',
            color: 'bg-secondary',
            action: () => alert('Academic records feature will be implemented with backend endpoints')
        }
    ];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* User Profile Header */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card border-0 bg-primary">
                        {error && (
                            <div className="alert alert-warning mb-3">
                                <small>Using cached profile data. {error}</small>
                            </div>
                        )}
                        <div className="card-body text-white p-4">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h2 className="text-white mb-2">Welcome back, {studentData.name}!</h2>
                                    <p className="mb-0 opacity-75">
                                        <strong>Email:</strong> {studentData.email} | <strong>Role:</strong> {studentData.role}
                                        {studentData.id && (
                                            <span> | <strong>ID:</strong> {studentData.id}</span>
                                        )}
                                    </p>
                                </div>
                                <div className="col-md-4 text-end">
                                    <i className="material-symbols-outlined" style={{fontSize: '60px', opacity: 0.3}}>
                                        {studentData.role === 'Admin' ? 'admin_panel_settings' : 
                                         studentData.role === 'Teacher' ? 'person' : 
                                         studentData.role === 'Accountant' ? 'account_balance_wallet' : 'school'}
                                    </i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Quick Actions</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {quickActions.map((action, index) => (
                                    <div key={index} className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                        <div className="card border-0 shadow-sm h-100" style={{cursor: 'pointer'}} onClick={action.action}>
                                            <div className="card-body text-center p-4">
                                                <div className={`rounded-circle ${action.color} d-inline-flex align-items-center justify-content-center mb-3`} 
                                                     style={{width: '60px', height: '60px'}}>
                                                    <i className="material-symbols-outlined text-white fs-4">{action.icon}</i>
                                                </div>
                                                <h5 className="card-title">{action.title}</h5>
                                                <p className="card-text text-muted small">{action.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments Section */}
            <div className="row" id="assignments-section">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">📝 My Assignments</h4>
                            <p className="card-subtitle text-muted">Assignments posted by your teachers</p>
                        </div>
                        <div className="card-body">
                            {assignmentsError && (
                                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong>Note:</strong> {assignmentsError}
                                    <button type="button" className="btn-close" onClick={() => setAssignmentsError(null)}></button>
                                </div>
                            )}

                            {assignmentsLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Loading assignments...</span>
                                    </div>
                                    <p className="mt-2">Loading assignments...</p>
                                </div>
                            ) : assignments.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Subject</th>
                                                <th>Description</th>
                                                <th>Due Date</th>
                                                <th>Points</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.map((assignment) => (
                                                <tr key={assignment.id}>
                                                    <td>
                                                        <strong>{assignment.title || '—'}</strong>
                                                    </td>
                                                    <td>{assignment.subject || '—'}</td>
                                                    <td>
                                                        {assignment.description ? (
                                                            assignment.description.length > 50 
                                                                ? `${assignment.description.substring(0, 50)}...` 
                                                                : assignment.description
                                                        ) : '—'}
                                                    </td>
                                                    <td>
                                                        {assignment.due_date ? (
                                                            <span className={`badge ${
                                                                new Date(assignment.due_date) < new Date() 
                                                                    ? 'badge-danger' 
                                                                    : new Date(assignment.due_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                                                        ? 'badge-warning'
                                                                        : 'badge-success'
                                                            }`}>
                                                                {new Date(assignment.due_date).toLocaleDateString()}
                                                            </span>
                                                        ) : '—'}
                                                    </td>
                                                    <td>{assignment.total_points || '—'}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            new Date(assignment.due_date) < new Date() 
                                                                ? 'badge-danger' 
                                                                : new Date(assignment.due_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                                                    ? 'badge-warning'
                                                                    : 'badge-success'
                                                        }`}>
                                                            {new Date(assignment.due_date) < new Date() 
                                                                ? 'Overdue' 
                                                                : new Date(assignment.due_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                                                    ? 'Due Soon'
                                                                    : 'Active'
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="material-symbols-outlined text-muted" style={{fontSize: '48px'}}>
                                        assignment
                                    </i>
                                    <p className="text-muted mt-2">No assignments found</p>
                                    <p className="text-muted small">
                                        <i className="material-symbols-outlined me-1">info</i>
                                        Your teachers will post assignments here when they're available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Information Cards */}
            <div className="row">
                {/* Current Semester */}
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Current Semester</h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4">
                                <i className="material-symbols-outlined text-muted" style={{fontSize: '48px'}}>
                                    school
                                </i>
                                <p className="text-muted mt-2">Course data will be fetched from backend endpoints</p>
                                <p className="text-muted small">
                                    <i className="material-symbols-outlined me-1">info</i>
                                    This section will display real course data when backend endpoints are implemented
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Progress */}
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Academic Progress</h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4">
                                <i className="material-symbols-outlined text-muted" style={{fontSize: '48px'}}>
                                    trending_up
                                </i>
                                <p className="text-muted mt-2">Progress data will be fetched from backend endpoints</p>
                                <p className="text-muted small">
                                    <i className="material-symbols-outlined me-1">info</i>
                                    This section will display real progress data when backend endpoints are implemented
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Recent Activity</h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4">
                                <i className="material-symbols-outlined text-muted" style={{fontSize: '48px'}}>
                                    history
                                </i>
                                <p className="text-muted mt-2">Activity data will be fetched from backend endpoints</p>
                                <p className="text-muted small">
                                    <i className="material-symbols-outlined me-1">info</i>
                                    This section will display real activity data when backend endpoints are implemented
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard; 