import React, { useState, useEffect, useContext } from 'react';
// Import ALL attendance endpoints from AttendanceService
import { 
    getStudentAttendance, 
    createStudentAttendance,
    updateStudentAttendance,
    deleteStudentAttendance,
    getStudentAttendanceById,
    getPeriodAttendance,
    createPeriodAttendance,
    updatePeriodAttendance,
    deletePeriodAttendance
} from '../../../services/AttendanceService';
// Import ALL assignment endpoints from AssignmentsService
import { 
    getAssignments, 
    createAssignment, 
    updateAssignment, 
    deleteAssignment,
    getAssignmentById
} from '../../../services/AssignmentsService';
import UsersService from '../../../services/UsersService';
import { useAuthStore } from '../../../store/store';
import { ThemeContext } from '../../../context/ThemeContext';
import TeacherHeader from '../../layouts/nav/TeacherHeader';
import '../../../css/teacher-dashboard.css';

const TeacherDashboard = () => {
    // State for student attendance
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    
    // State for form data
    const [formData, setFormData] = useState({
        student: '',
        date: '',
        status: 'Present',
        notes: ''
    });

    // State for assignments
    const [assignments, setAssignments] = useState([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [assignmentsError, setAssignmentsError] = useState(null);
    const [creatingAssignment, setCreatingAssignment] = useState(false);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);

    // State for assignment form data
    const [assignmentFormData, setAssignmentFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        subject: '',
        total_points: ''
    });

    // State for period attendance (NEW)
    const [periodAttendance, setPeriodAttendance] = useState([]);
    const [periodLoading, setPeriodLoading] = useState(false);
    const [periodError, setPeriodError] = useState(null);
    const [creatingPeriod, setCreatingPeriod] = useState(false);
    const [editingPeriodAttendance, setEditingPeriodAttendance] = useState(null);
    
    // State for period attendance form data (NEW)
    const [periodFormData, setPeriodFormData] = useState({
        period: '',
        date: '',
        status: 'Present',
        notes: ''
    });

    // State for active tab (NEW)
    const [activeAttendanceTab, setActiveAttendanceTab] = useState('student'); // 'student' or 'period'

    // State for detail views (NEW)
    const [viewingAttendanceDetails, setViewingAttendanceDetails] = useState(null);
    const [viewingAssignmentDetails, setViewingAssignmentDetails] = useState(null);

    // Get auth state and theme context
    const { user, token } = useAuthStore();
    const { changeBackground } = useContext(ThemeContext);

    // Normalize error messages to prevent white screen crashes
    const getErrorMessage = (err) => {
        const errorDetail = err?.response?.data?.detail;
        if (typeof errorDetail === 'string') {
            return errorDetail;
        } else if (errorDetail && typeof errorDetail === 'object') {
            return JSON.stringify(errorDetail, null, 2);
        } else if (err?.response?.data) {
            return JSON.stringify(err.response.data, null, 2);
        }
        return err?.message || 'An error occurred';
    };

    // Load student attendance data and set theme
    useEffect(() => {
        changeBackground({ value: "light", label: "Light" });
        loadStudentAttendance();
        loadAssignments();
        loadPeriodAttendance(); // Load period attendance on mount
    }, []);

    // Load period attendance when tab changes
    useEffect(() => {
        if (activeAttendanceTab === 'period') {
            loadPeriodAttendance();
        }
    }, [activeAttendanceTab]);

    const loadStudentAttendance = async () => {
        try {
            setLoading(true);
            console.log('🔍 Loading student attendance for teacher...');
            const data = await getStudentAttendance();
            console.log('✅ Student attendance loaded:', data);
            setStudentAttendance(Array.isArray(data) ? data : []);
            setError(null);
        } catch (error) {
            console.error('❌ Error loading student attendance:', error);
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const loadAssignments = async () => {
        try {
            setAssignmentsLoading(true);
            console.log('📝 Loading assignments for teacher...');
            const data = await getAssignments();
            console.log('✅ Assignments loaded:', data);
            setAssignments(Array.isArray(data) ? data : []);
            setAssignmentsError(null);
        } catch (error) {
            console.error('❌ Error loading assignments:', error);
            setAssignmentsError(getErrorMessage(error));
        } finally {
            setAssignmentsLoading(false);
        }
    };

    // Load period attendance (NEW - Endpoint #10)
    const loadPeriodAttendance = async () => {
        try {
            setPeriodLoading(true);
            console.log('⏰ Loading period attendance...');
            const data = await getPeriodAttendance();
            console.log('✅ Period attendance loaded:', data);
            setPeriodAttendance(Array.isArray(data) ? data : []);
            setPeriodError(null);
        } catch (error) {
            console.error('❌ Error loading period attendance:', error);
            setPeriodError(getErrorMessage(error));
        } finally {
            setPeriodLoading(false);
        }
    };

    // View student attendance details by ID (NEW - Endpoint #9)
    const handleViewAttendanceDetails = async (id) => {
        try {
            console.log('👁️ Fetching attendance details for ID:', id);
            const details = await getStudentAttendanceById(id);
            console.log('✅ Attendance details loaded:', details);
            setViewingAttendanceDetails(details);
            // Show alert with details
            alert(`Attendance Details:\n\nStudent: ${details.student || 'N/A'}\nDate: ${details.date || 'N/A'}\nStatus: ${details.status || 'N/A'}\nNotes: ${details.notes || 'None'}\n\nFull Data:\n${JSON.stringify(details, null, 2)}`);
        } catch (error) {
            console.error('❌ Error fetching attendance details:', error);
            alert('❌ Failed to load attendance details: ' + getErrorMessage(error));
        }
    };

    // View assignment details by ID (NEW - Endpoint #14)
    const handleViewAssignmentDetails = async (id) => {
        try {
            console.log('👁️ Fetching assignment details for ID:', id);
            const details = await getAssignmentById(id);
            console.log('✅ Assignment details loaded:', details);
            setViewingAssignmentDetails(details);
            // Show alert with details
            alert(`Assignment Details:\n\nTitle: ${details.title || 'N/A'}\nSubject: ${details.subject || 'N/A'}\nDue Date: ${details.due_date || 'N/A'}\nDescription: ${details.description || 'None'}\nPoints: ${details.total_points || 'N/A'}\n\nFull Data:\n${JSON.stringify(details, null, 2)}`);
        } catch (error) {
            console.error('❌ Error fetching assignment details:', error);
            alert('❌ Failed to load assignment details: ' + getErrorMessage(error));
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle assignment form input changes
    const handleAssignmentInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle assignment form submission
    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        if (!assignmentFormData.title || !assignmentFormData.description || !assignmentFormData.due_date) {
            setAssignmentsError('Please fill in all required fields');
            return;
        }

        setCreatingAssignment(true); // Set to true only when actually submitting
        try {
            // For assignments, backend expects teacher email/username and questions array
            // Using a simplified format that should work with the backend
            const payload = {
                title: assignmentFormData.title,
                subject: assignmentFormData.subject || '',
                due_date: assignmentFormData.due_date,
                description: assignmentFormData.description,
                total_points: assignmentFormData.total_points || null
            };

            if (editingAssignment) {
                console.log('📝 Updating assignment:', editingAssignment.id, payload);
                const result = await updateAssignment(editingAssignment.id, payload);
                console.log('✅ Assignment updated:', result);
                alert('✅ Assignment updated successfully!');
            } else {
                console.log('📝 Creating new assignment:', payload);
                const result = await createAssignment(payload);
                console.log('✅ Assignment created:', result);
                alert('✅ Assignment created successfully!');
            }
            await loadAssignments();
            setAssignmentFormData({ title: '', description: '', due_date: '', subject: '', total_points: '' });
            setEditingAssignment(null);
            setShowAssignmentForm(false);
            setAssignmentsError(null);
        } catch (error) {
            console.error('❌ Error saving assignment:', error);
            const errorMessage = getErrorMessage(error);
            setAssignmentsError(errorMessage);
            alert('❌ Failed to save assignment: ' + errorMessage);
        } finally {
            setCreatingAssignment(false);
        }
    };

    // Handle assignment deletion
    const handleDeleteAssignment = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                console.log('📝 Deleting assignment:', id);
                await deleteAssignment(id);
                console.log('✅ Assignment deleted:', id);
                await loadAssignments();
                alert('✅ Assignment deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting assignment:', error);
                const errorMessage = getErrorMessage(error);
                setAssignmentsError(errorMessage);
                alert('❌ Failed to delete assignment: ' + errorMessage);
            }
        }
    };

    // Handle assignment editing
    const handleEditAssignment = (assignment) => {
        setEditingAssignment(assignment);
        setShowAssignmentForm(true);
        setAssignmentFormData({
            title: assignment.title || '',
            description: assignment.description || '',
            due_date: assignment.due_date || '',
            subject: assignment.subject || '',
            total_points: assignment.total_points || ''
        });
    };

    // Cancel assignment editing
    const cancelAssignmentEdit = () => {
        setEditingAssignment(null);
        setShowAssignmentForm(false);
        setAssignmentFormData({ title: '', description: '', due_date: '', subject: '', total_points: '' });
        setAssignmentsError(null);
    };

    // Handle attendance form submission (CREATE or UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.student || !formData.date || !formData.status) {
            setError('Please fill in all required fields');
            return;
        }

        setCreating(true);
        setError(null);
        
        try {
            const payload = {
                student: parseInt(formData.student) || 1,
                date: formData.date,
                status: formData.status,
                notes: formData.notes || ''
            };
            
            if (editingAttendance) {
                // UPDATE attendance
                console.log('📚 Updating student attendance:', editingAttendance.id, payload);
                const result = await updateStudentAttendance(editingAttendance.id, payload);
                console.log('✅ Student attendance updated:', result);
                alert('✅ Student attendance updated successfully!');
            } else {
                // CREATE attendance
                console.log('📚 Creating student attendance with payload:', payload);
                const result = await createStudentAttendance(payload);
            console.log('✅ Student attendance created:', result);
                alert('✅ Student attendance recorded successfully!');
            }
            
            // Reset form
            setFormData({ student: '', date: '', status: 'Present', notes: '' });
            setEditingAttendance(null);
            setError(null);
            
            // Reload data
            await loadStudentAttendance();
            
        } catch (error) {
            console.error('❌ Error saving student attendance:', error);
            const errorMessage = getErrorMessage(error);
            setError(errorMessage);
            alert('❌ Failed to save attendance: ' + errorMessage);
        } finally {
            setCreating(false);
        }
    };

    // Handle attendance editing
    const handleEditAttendance = (attendance) => {
        setEditingAttendance(attendance);
        setFormData({
            student: attendance.student || '',
            date: attendance.date || '',
            status: attendance.status || 'Present',
            notes: attendance.notes || ''
        });
        // Scroll to form
        document.getElementById('attendanceForm')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle attendance deletion
    const handleDeleteAttendance = async (id) => {
        if (window.confirm(`Are you sure you want to delete attendance record #${id}?`)) {
            try {
                console.log('📚 Deleting student attendance:', id);
                await deleteStudentAttendance(id);
                console.log('✅ Student attendance deleted:', id);
                await loadStudentAttendance();
                alert('✅ Student attendance deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting attendance:', error);
                const errorMessage = getErrorMessage(error);
                setError(errorMessage);
                alert('❌ Failed to delete attendance: ' + errorMessage);
            }
        }
    };

    // Cancel attendance editing
    const cancelAttendanceEdit = () => {
        setEditingAttendance(null);
        setFormData({ student: '', date: '', status: 'Present', notes: '' });
        setError(null);
    };

    // Period attendance handlers (NEW - Endpoints #11, #12, #13)
    const handlePeriodSubmit = async (e) => {
        e.preventDefault();
        if (!periodFormData.period || !periodFormData.date || !periodFormData.status) {
            setPeriodError('Please fill in all required fields');
            return;
        }

        setCreatingPeriod(true);
        setPeriodError(null);
        
        try {
            const payload = {
                period: parseInt(periodFormData.period) || 1,
                date: periodFormData.date,
                status: periodFormData.status,
                notes: periodFormData.notes || ''
            };
            
            if (editingPeriodAttendance) {
                // UPDATE period attendance
                console.log('⏰ Updating period attendance:', editingPeriodAttendance.id, payload);
                const result = await updatePeriodAttendance(editingPeriodAttendance.id, payload);
                console.log('✅ Period attendance updated:', result);
                alert('✅ Period attendance updated successfully!');
            } else {
                // CREATE period attendance
                console.log('⏰ Creating period attendance with payload:', payload);
                const result = await createPeriodAttendance(payload);
                console.log('✅ Period attendance created:', result);
                alert('✅ Period attendance recorded successfully!');
            }
            
            // Reset form
            setPeriodFormData({ period: '', date: '', status: 'Present', notes: '' });
            setEditingPeriodAttendance(null);
            setPeriodError(null);
            
            // Reload data
            await loadPeriodAttendance();
            
        } catch (error) {
            console.error('❌ Error saving period attendance:', error);
            const errorMessage = getErrorMessage(error);
            setPeriodError(errorMessage);
            alert('❌ Failed to save period attendance: ' + errorMessage);
        } finally {
            setCreatingPeriod(false);
        }
    };

    // Handle period attendance editing
    const handleEditPeriodAttendance = (periodAttendance) => {
        setEditingPeriodAttendance(periodAttendance);
        setPeriodFormData({
            period: periodAttendance.period || '',
            date: periodAttendance.date || '',
            status: periodAttendance.status || 'Present',
            notes: periodAttendance.notes || ''
        });
        // Scroll to form
        document.getElementById('periodAttendanceForm')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle period attendance deletion
    const handleDeletePeriodAttendance = async (id) => {
        if (window.confirm(`Are you sure you want to delete period attendance record #${id}?`)) {
            try {
                console.log('⏰ Deleting period attendance:', id);
                await deletePeriodAttendance(id);
                console.log('✅ Period attendance deleted:', id);
                await loadPeriodAttendance();
                alert('✅ Period attendance deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting period attendance:', error);
                const errorMessage = getErrorMessage(error);
                setPeriodError(errorMessage);
                alert('❌ Failed to delete period attendance: ' + errorMessage);
            }
        }
    };

    // Cancel period attendance editing
    const cancelPeriodAttendanceEdit = () => {
        setEditingPeriodAttendance(null);
        setPeriodFormData({ period: '', date: '', status: 'Present', notes: '' });
        setPeriodError(null);
    };

    // Handle period input changes
    const handlePeriodInputChange = (e) => {
        const { name, value } = e.target;
        setPeriodFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // DEBUG FUNCTIONS - COMMENTED OUT (Not used in production)
    // These functions are kept for debugging purposes but not called from UI
    
    // Test API connection (DEBUG)
    const testAPIConnection = async () => {
        try {
            console.log('🧪 Testing API connection...');
            const data = await getStudentAttendance();
            console.log('✅ API connection successful:', data);
            alert('✅ API connection successful!');
        } catch (error) {
            console.error('❌ API connection failed:', error);
            alert('❌ API connection failed: ' + getErrorMessage(error));
        }
    };

    // Test profile endpoint (DEBUG)
    const testProfileEndpoint = async () => {
        try {
            console.log('🧪 Testing profile endpoint...');
            const profile = await UsersService.getProfile();
            console.log('✅ Profile endpoint successful:', profile);
            alert('✅ Profile endpoint successful! Check console for details.');
        } catch (error) {
            console.error('❌ Profile endpoint failed:', error);
            alert('❌ Profile endpoint failed: ' + getErrorMessage(error));
        }
    };

    // Test assignments API connection (DEBUG)
    const testAssignmentsAPI = async () => {
        try {
            console.log('🧪 Testing assignments API connection...');
            const data = await getAssignments();
            console.log('✅ Assignments API connection successful:', data);
            alert('✅ Assignments API connection successful!');
        } catch (error) {
            console.error('❌ Assignments API connection failed:', error);
            alert('❌ Assignments API connection failed: ' + getErrorMessage(error));
        }
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'badge-success';
            case 'absent': return 'badge-danger';
            case 'late': return 'badge-warning';
            case 'excused': return 'badge-info';
            default: return 'badge-secondary';
        }
    };

    // Handle loading and error states
    if (loading) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading Teacher Dashboard...</span>
                                </div>
                                <p className="mt-3">Loading Student Attendance Data...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-danger" role="alert">
                                    <h4 className="alert-heading">Teacher Dashboard Error</h4>
                                    <p>{error}</p>
                                    <hr />
                                    <p className="mb-0">Check console for detailed error information.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Teacher Header */}
            <TeacherHeader />

            {/* Spacing between header and content */}
            <div style={{ marginTop: '30px', marginBottom: '20px' }}></div>

            {/* Statistics Cards */}
            <div className="row" style={{ marginTop: '20px' }}>
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body pb-xl-4 pb-sm-3 pb-0">
                            <div className="row">
                                <div className="col-xl-2 col-6">
                                    <div className="content-box">
                                        <div className="icon-box icon-box-xl bg-primary">
                                            <i className="material-symbols-outlined">school</i>
                                        </div>
                                        <div className="chart-num">
                                            <p>Total Students</p>
                                            <h2 className="font-w700 mb-0">{studentAttendance.length}</h2>
                                            <small className="text-muted">In attendance records</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-6">
                                    <div className="content-box">
                                        <div className="icon-box icon-box-xl bg-success">
                                            <i className="material-symbols-outlined">check_circle</i>
                                        </div>
                                        <div className="chart-num">
                                            <p>Present Today</p>
                                            <h2 className="font-w700 mb-0">
                                                {studentAttendance.filter(a => a.status === 'Present').length}
                                            </h2>
                                            <small className="text-muted">Students present</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-6">
                                    <div className="content-box">
                                        <div className="icon-box icon-box-xl bg-warning">
                                            <i className="material-symbols-outlined">schedule</i>
                                        </div>
                                        <div className="chart-num">
                                            <p>Late Today</p>
                                            <h2 className="font-w700 mb-0">
                                                {studentAttendance.filter(a => a.status === 'Late').length}
                                            </h2>
                                            <small className="text-muted">Students late</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-6">
                                    <div className="content-box">
                                        <div className="icon-box icon-box-xl bg-danger">
                                            <i className="material-symbols-outlined">cancel</i>
                                        </div>
                                        <div className="chart-num">
                                            <p>Absent Today</p>
                                            <h2 className="font-w700 mb-0">
                                                {studentAttendance.filter(a => a.status === 'Absent').length}
                                            </h2>
                                            <small className="text-muted">Students absent</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-6">
                                    <div className="content-box">
                                        <div className="icon-box icon-box-xl bg-info">
                                            <i className="material-symbols-outlined">assignment</i>
                                        </div>
                                        <div className="chart-num">
                                            <p>Total Assignments</p>
                                            <h2 className="font-w700 mb-0">{assignments.length}</h2>
                                            <small className="text-muted">Active assignments</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Debug Information Card - COMMENTED OUT */}
            {/* <div className="row" style={{ marginTop: '30px' }}>
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header pb-0 border-0 flex-wrap">
                            <div className="mb-2 mb-sm-0">
                                <div className="chart-title mb-3">
                                    <h2 className="heading">🔍 Debug Information</h2>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-2">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>Authentication Status</h6>
                                    <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</p>
                                    <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
                                    <p><strong>LocalStorage Token:</strong> {localStorage.getItem('userToken') ? 'Present' : 'Missing'}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>🧪 API Testing</h6>
                                    <button className="btn btn-primary btn-sm me-2 mb-2" onClick={testAPIConnection}>
                                        Test API Connection
                                    </button>
                                    <button className="btn btn-info btn-sm me-2 mb-2" onClick={testProfileEndpoint}>
                                        Test Profile Endpoint
                                    </button>
                                    <button className="btn btn-warning btn-sm me-2 mb-2" onClick={testAssignmentsAPI}>
                                        Test Assignments API
                                    </button>
                                    <button className="btn btn-success btn-sm mb-2" onClick={loadStudentAttendance}>
                                        🔄 Reload Data
                                    </button>
                                </div>
                                <div className="col-md-4">
                                    <h6>Data Status</h6>
                                    <p><strong>Student Attendance:</strong> {studentAttendance.length}</p>
                                    <p><strong>Assignments:</strong> {assignments.length}</p>
                                    <p><strong>Loading:</strong> {loading || assignmentsLoading ? 'Yes' : 'No'}</p>
                                    <p><strong>Error:</strong> {error || assignmentsError ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h6>Debug Data (First 2 items):</h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Student Attendance:</h6>
                                        <pre className="bg-light p-2 rounded">{JSON.stringify(studentAttendance.slice(0, 2), null, 2)}</pre>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Assignments:</h6>
                                        <pre className="bg-light p-2 rounded">{JSON.stringify(assignments.slice(0, 2), null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Quick Actions - IMPROVED DESIGN */}
            <div className="row" style={{ marginTop: '30px' }}>
                <div className="col-xl-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white pb-0 border-0">
                            <h3 className="card-title d-flex align-items-center">
                                <i className="material-symbols-outlined me-2 text-primary">dashboard</i>
                                Quick Actions
                            </h3>
                                </div>
                        <div className="card-body">
                            <div className="row g-3">
                                        <div className="col-md-6 col-lg-3">
                                    <button 
                                        className="btn btn-primary btn-lg w-100 py-3 shadow-sm" 
                                        onClick={() => {
                                            cancelAttendanceEdit(); // Reset form state
                                            document.getElementById('attendanceForm')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <i className="material-symbols-outlined me-2" style={{ fontSize: '24px' }}></i>
                                        <span className="fw-bold">Record Attendance</span>
                                    </button>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <button 
                                        className="btn btn-success btn-lg w-100 py-3 shadow-sm" 
                                        onClick={() => { 
                                            loadStudentAttendance(); 
                                            loadAssignments(); 
                                            loadPeriodAttendance();
                                        }}
                                    >
                                        <i className="material-symbols-outlined me-2" style={{ fontSize: '24px' }}></i>
                                        <span className="fw-bold">Refresh Data</span>
                                    </button>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <button 
                                        className="btn btn-info btn-lg w-100 py-3 shadow-sm" 
                                        onClick={() => setShowAssignmentForm(true)}
                                    >
                                        <i className="material-symbols-outlined me-2" style={{ fontSize: '24px' }}></i>
                                        <span className="fw-bold">Create Assignment</span>
                                    </button>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <button 
                                        className="btn btn-danger btn-lg w-100 py-3 shadow-sm" 
                                        onClick={() => {
                                        const { logout } = useAuthStore.getState();
                                        logout();
                                        window.location.href = '/login';
                                        }}
                                    >
                                        <i className="material-symbols-outlined me-2" style={{ fontSize: '24px' }}></i>
                                        <span className="fw-bold">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Management - IMPROVED with TABS */}
            <div className="row" style={{ marginTop: '30px' }}>
                <div className="col-xl-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-gradient-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="card-title d-flex align-items-center mb-0">
                                    <i className="material-symbols-outlined me-2"></i>
                                    Attendance Management
                                </h3>
                                {/* Tabs for Student and Period Attendance */}
                                <ul className="nav nav-tabs" id="attendanceTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className={`nav-link ${activeAttendanceTab === 'student' ? 'active' : ''}`}
                                            onClick={() => setActiveAttendanceTab('student')}
                                            type="button"
                                            style={{ color: activeAttendanceTab === 'student' ? 'white' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            <i className="material-symbols-outlined me-2">school</i>
                                            Student Attendance
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className={`nav-link ${activeAttendanceTab === 'period' ? 'active' : ''}`}
                                            onClick={() => setActiveAttendanceTab('period')}
                                            type="button"
                                            style={{ color: activeAttendanceTab === 'period' ? 'white' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            <i className="material-symbols-outlined me-2"></i>
                                            Period Attendance
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Student Attendance Tab Content */}
                            {activeAttendanceTab === 'student' && (
                                <>
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <strong>Error:</strong> {error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            {/* Create/Edit Attendance Form */}
                            <div className="row mb-4" id="attendanceForm">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">
                                            {editingAttendance ? (
                                                <>
                                                    <i className="material-symbols-outlined me-2"></i>
                                                    Edit Student Attendance
                                                </>
                                            ) : (
                                                <>
                                                    <i className="material-symbols-outlined me-2"></i>
                                                    Record New Student Attendance
                                                </>
                                            )}
                                        </h6>
                                        {editingAttendance && (
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-secondary" 
                                                onClick={cancelAttendanceEdit}
                                            >
                                                <i className="material-symbols-outlined me-1"></i>
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Student Name/ID *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="student" 
                                                value={formData.student} 
                                                onChange={handleInputChange} 
                                                placeholder="Enter student name or ID" 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Date *</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                name="date" 
                                                value={formData.date} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Status *</label>
                                            <select 
                                                className="form-control" 
                                                name="status" 
                                                value={formData.status} 
                                                onChange={handleInputChange} 
                                                required
                                            >
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                                <option value="Late">Late</option>
                                                <option value="Excused">Excused</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Notes</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="notes" 
                                                value={formData.notes} 
                                                onChange={handleInputChange} 
                                                placeholder="Optional notes" 
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">&nbsp;</label>
                                            <button 
                                                type="submit" 
                                                className={`btn ${editingAttendance ? 'btn-warning' : 'btn-primary'} w-100`} 
                                                disabled={creating || !formData.student || !formData.date || !formData.status}
                                            >
                                                {creating ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Saving...
                                                    </>
                                                ) : editingAttendance ? (
                                                    <>
                                                        <i className="material-symbols-outlined me-1"></i>
                                                        Update Attendance
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="material-symbols-outlined me-1"></i>
                                                        Record Attendance
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Attendance Records Table */}
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Student</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Notes</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentAttendance.length > 0 ? (
                                            studentAttendance.map((attendance) => (
                                                <tr key={attendance.id}>
                                                    <td>#{attendance.id}</td>
                                                    <td>{attendance.student || '—'}</td>
                                                    <td>{attendance.date || '—'}</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(attendance.status)}`}>
                                                            {attendance.status || '—'}
                                                        </span>
                                                    </td>
                                                    <td>{attendance.notes || '—'}</td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button className="btn btn-sm btn-primary" title="View Details" onClick={() => handleViewAttendanceDetails(attendance.id)}>
                                                                <i className="material-symbols-outlined"></i>
                                                        </button>
                                                            <button className="btn btn-sm btn-warning" title="Edit Record" onClick={() => handleEditAttendance(attendance)}>
                                                                <i className="material-symbols-outlined"></i>
                                                        </button>
                                                            <button className="btn btn-sm btn-danger" title="Delete Record" onClick={() => handleDeleteAttendance(attendance.id)}>
                                                                <i className="material-symbols-outlined"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-4">
                                                    <p className="mb-2">No student attendance records found</p>
                                                    <small>Start by recording attendance using the form above</small>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            </>
                            )}

                            {/* Period Attendance Tab Content - Uses Endpoints #10, #11, #12, #13 */}
                            {activeAttendanceTab === 'period' && (
                                <>
                                    {periodError && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            <strong>Error:</strong> {periodError}
                                            <button type="button" className="btn-close" onClick={() => setPeriodError(null)}></button>
                        </div>
                                    )}

                                    {/* Create/Edit Period Attendance Form */}
                                    <div className="row mb-4" id="periodAttendanceForm">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">
                                                    {editingPeriodAttendance ? (
                                                        <>
                                                            <i className="material-symbols-outlined me-2">edit</i>
                                                            Edit Period Attendance
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="material-symbols-outlined me-2">schedule</i>
                                                            Record New Period Attendance
                                                        </>
                                                    )}
                                                </h6>
                                                {editingPeriodAttendance && (
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-secondary" 
                                                        onClick={cancelPeriodAttendanceEdit}
                                                    >
                                                        <i className="material-symbols-outlined me-1">close</i>
                                                        Cancel Edit
                                                    </button>
                                                )}
                    </div>
                                            <form onSubmit={handlePeriodSubmit} className="row g-3">
                                                <div className="col-md-3">
                                                    <label className="form-label">Period ID *</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="period" 
                                                        value={periodFormData.period} 
                                                        onChange={handlePeriodInputChange} 
                                                        placeholder="Enter period ID" 
                                                        required 
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Date *</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        name="date" 
                                                        value={periodFormData.date} 
                                                        onChange={handlePeriodInputChange} 
                                                        required 
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Status *</label>
                                                    <select 
                                                        className="form-control" 
                                                        name="status" 
                                                        value={periodFormData.status} 
                                                        onChange={handlePeriodInputChange} 
                                                        required
                                                    >
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent</option>
                                                        <option value="Late">Late</option>
                                                        <option value="Excused">Excused</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Notes</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="notes" 
                                                        value={periodFormData.notes} 
                                                        onChange={handlePeriodInputChange} 
                                                        placeholder="Optional notes" 
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">&nbsp;</label>
                                                    <button 
                                                        type="submit" 
                                                        className={`btn ${editingPeriodAttendance ? 'btn-warning' : 'btn-primary'} w-100`} 
                                                        disabled={creatingPeriod || !periodFormData.period || !periodFormData.date || !periodFormData.status}
                                                    >
                                                        {creatingPeriod ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Saving...
                                                            </>
                                                        ) : editingPeriodAttendance ? (
                                                            <>
                                                                <i className="material-symbols-outlined me-1">save</i>
                                                                Update
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="material-symbols-outlined me-1">schedule</i>
                                                                Record
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                </div>
            </div>

                                    {/* Period Attendance Records Table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Period</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th>Notes</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {periodLoading ? (
                                                    <tr>
                                                        <td colSpan={6} className="text-center">Loading period attendance...</td>
                                                    </tr>
                                                ) : periodAttendance.length > 0 ? (
                                                    periodAttendance.map((period) => (
                                                        <tr key={period.id}>
                                                            <td>#{period.id}</td>
                                                            <td>{period.period || '—'}</td>
                                                            <td>{period.date || '—'}</td>
                                                            <td>
                                                                <span className={`badge ${getStatusBadgeClass(period.status)}`}>
                                                                    {period.status || '—'}
                                                                </span>
                                                            </td>
                                                            <td>{period.notes || '—'}</td>
                                                            <td>
                                                                <div className="btn-group" role="group">
                                                                    <button className="btn btn-sm btn-info" title="View Details" onClick={() => alert(`Period Attendance Details:\n\nPeriod: ${period.period}\nDate: ${period.date}\nStatus: ${period.status}\nNotes: ${period.notes || 'None'}`)}>
                                                                        <i className="material-symbols-outlined">visibility</i>
                                                                    </button>
                                                                    <button className="btn btn-sm btn-warning" title="Edit Record" onClick={() => handleEditPeriodAttendance(period)}>
                                                                        <i className="material-symbols-outlined">edit</i>
                                                                    </button>
                                                                    <button className="btn btn-sm btn-danger" title="Delete Record" onClick={() => handleDeletePeriodAttendance(period.id)}>
                                                                        <i className="material-symbols-outlined">delete</i>
                                                                    </button>
                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="text-center text-muted py-4">
                                                            <p className="mb-2">No period attendance records found</p>
                                                            <small>Start by recording period attendance using the form above</small>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                            </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments Management - IMPROVED */}
            <div className="row" style={{ marginTop: '30px' }}>
                <div className="col-xl-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-gradient-info text-white">
                            <h3 className="card-title d-flex align-items-center mb-0">
                                <i className="material-symbols-outlined me-2"></i>
                                Assignments Management
                            </h3>
                        </div>
                        <div className="card-body">
                            {assignmentsError && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <strong>Error:</strong> {assignmentsError}
                                    <button type="button" className="btn-close" onClick={() => setAssignmentsError(null)}></button>
                                </div>
                            )}

                            {/* Create/Edit Assignment Form - IMPROVED */}
                            {showAssignmentForm && (
                                <div className="card mb-4 border-info">
                                    <div className="card-header bg-info text-white">
                                        <h5 className="mb-0">
                                            <i className="material-symbols-outlined me-2">{editingAssignment ? 'edit' : 'add_circle'}</i>
                                            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                    <form onSubmit={handleAssignmentSubmit} className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Title *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="title" 
                                                value={assignmentFormData.title} 
                                                onChange={handleAssignmentInputChange} 
                                                placeholder="Assignment title" 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Subject</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="subject" 
                                                value={assignmentFormData.subject} 
                                                onChange={handleAssignmentInputChange} 
                                                placeholder="Subject (optional)" 
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Due Date *</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                name="due_date" 
                                                value={assignmentFormData.due_date} 
                                                onChange={handleAssignmentInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Description *</label>
                                            <textarea 
                                                className="form-control" 
                                                name="description" 
                                                value={assignmentFormData.description} 
                                                onChange={handleAssignmentInputChange} 
                                                placeholder="Assignment description" 
                                                rows="3"
                                                required 
                                            ></textarea>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Total Points</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                name="total_points" 
                                                value={assignmentFormData.total_points} 
                                                onChange={handleAssignmentInputChange} 
                                                placeholder="Points (optional)" 
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">&nbsp;</label>
                                            <div className="d-grid gap-2">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-success" 
                                                    disabled={creatingAssignment}
                                                >
                                                    {creatingAssignment ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        editingAssignment ? (
                                                            <>
                                                                <i className="material-symbols-outlined me-1">save</i>
                                                                Update Assignment
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="material-symbols-outlined me-1"></i>
                                                                Create Assignment
                                                            </>
                                                        )
                                                    )}
                                                </button>
                                                {editingAssignment && (
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-secondary" 
                                                        onClick={cancelAssignmentEdit}
                                                    >
                                                        Cancel Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                    <div className="card-footer bg-light">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => { 
                                                cancelAssignmentEdit(); 
                                                setShowAssignmentForm(false); 
                                            }}
                                        >
                                            <i className="material-symbols-outlined me-1"></i>
                                            Close Form
                                        </button>
                            </div>
                                </div>
                            )}

                            {/* Assignments Table */}
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Subject</th>
                                            <th>Due Date</th>
                                            <th>Points</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignmentsLoading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center">Loading assignments...</td>
                                            </tr>
                                        ) : assignments.length > 0 ? (
                                            assignments.map((assignment) => (
                                                <tr key={assignment.id}>
                                                    <td>#{assignment.id}</td>
                                                    <td>
                                                        <strong>{assignment.title || '—'}</strong>
                                                        {assignment.description && (
                                                            <>
                                                                <br />
                                                                <small className="text-muted">{assignment.description.substring(0, 50)}...</small>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td>{assignment.subject || '—'}</td>
                                                    <td>{assignment.due_date || '—'}</td>
                                                    <td>{assignment.total_points || '—'}</td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-sm btn-info me-1" 
                                                            title="View Details"
                                                            onClick={() => handleViewAssignmentDetails(assignment.id)}
                                                        >
                                                            <i className="material-symbols-outlined">visibility</i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-warning me-1" 
                                                            title="Edit Assignment"
                                                            onClick={() => handleEditAssignment(assignment)}
                                                        >
                                                            <i className="material-symbols-outlined">edit</i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-danger" 
                                                            title="Delete Assignment"
                                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                                        >
                                                            <i className="material-symbols-outlined">delete</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-4">
                                                    <p className="mb-2">No assignments found</p>
                                                    <small>Start by creating an assignment using the form above</small>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherDashboard;

