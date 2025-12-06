import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherAttendance, createTeacherAttendance, patchTeacherAttendance } from '../../../services/AttendanceService';
import { useAuthStore } from '../../../store/store';

const TeacherAttendance = () => {
    console.log('📚 TeacherAttendance component rendered');
    
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allowed, setAllowed] = useState([]);
    const [creating, setCreating] = useState(false);
    const [patchingId, setPatchingId] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        time_in: '',
        time_out: '',
        status: 'Present', // Add default status to prevent backend error
        notes: ''
    });

    // Get auth state
    const { user, token } = useAuthStore();

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            console.log('🔍 Attempting to load teacher attendance...');
            console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
            console.log('👤 Current user:', user);
            console.log('🔑 Store token:', token);
            
            // Get allowed methods via OPTIONS
            try {
                const opt = await getTeacherAttendance(true);
                const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
                setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
            } catch (e) {}
            
            const data = await getTeacherAttendance();
            console.log('✅ Teacher attendance loaded successfully:', data);
            setAttendanceList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error loading teacher attendance:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error data:', error.response?.data);
            setError(error?.response?.data || error?.message);
        } finally {
            setLoading(false);
        }
    };

    // Test API connection directly
    const testAPIConnection = async () => {
        try {
            console.log('🧪 Testing API connection to /api/attendance/teacher-attendance/');
            const response = await fetch('http://ptskumba-backend.onrender.com/api/attendance/teacher-attendance/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('🧪 API Response Status:', response.status);
            console.log('🧪 API Response Headers:', response.headers);
            
            if (response.ok) {
                const data = await response.json();
                console.log('🧪 API Response Data:', data);
                alert(`✅ API Connection Successful!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
            } else {
                const errorData = await response.text();
                console.error('🧪 API Error Response:', errorData);
                alert(`❌ API Connection Failed!\nStatus: ${response.status}\nError: ${errorData}`);
            }
        } catch (err) {
            console.error('🧪 API Connection Test Error:', err);
            alert(`❌ API Connection Test Error: ${err.message}`);
        }
    };

    // Test PATCH endpoint
    const testPatchEndpoint = async (attendance) => {
        try {
            console.log('🧪 Testing PATCH endpoint for teacher attendance:', attendance.id);
            const patchData = {
                notes: `Updated via PATCH at ${new Date().toLocaleString()}`
            };
            
            await patchTeacherAttendance(attendance.id, patchData);
            alert(`✅ PATCH Test Successful!\nUpdated teacher attendance: ${attendance.teacher}\nNew notes: ${patchData.notes}`);
            
            // Reload data to show the change
            await loadAttendance();
        } catch (err) {
            console.error('🧪 PATCH Test Error:', err);
            alert(`❌ PATCH Test Failed: ${err.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.date) {
            setError('Date is required');
            return;
        }
        
        if (!formData.status) {
            setError('Status is required');
            return;
        }
        
        // Validate time format if provided
        if (formData.time_in && !formData.time_in.includes(':')) {
            setError('Time In must be in HH:MM format');
            return;
        }
        if (formData.time_out && !formData.time_out.includes(':')) {
            setError('Time Out must be in HH:MM format');
            return;
        }
        
        setCreating(true);
        try {
            console.log('📚 Submitting teacher attendance data:', formData);
            
            // Prepare data for backend - ensure all fields are properly formatted
            const submitData = {
                date: formData.date,
                status: formData.status, // Ensure status is always sent
                time_in: formData.time_in || null,
                time_out: formData.time_out || null,
                notes: formData.notes || ''
            };
            
            console.log('📚 Formatted data for submission:', submitData);
            
            const result = await createTeacherAttendance(submitData);
            console.log('✅ Teacher attendance created successfully:', result);
            
            // Reload attendance list after creation
            await loadAttendance();
            // Reset form
            setFormData({
                date: '',
                time_in: '',
                time_out: '',
                status: 'Present', // Reset status
                notes: ''
            });
            setError(null); // Clear any previous errors
            
            // Show success message
            alert('✅ Teacher attendance created successfully!');
        } catch (error) {
            console.error('❌ Error creating teacher attendance:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error data:', error.response?.data);
            
            // Extract error details for better user experience
            let errorMessage = 'An error occurred while creating attendance';
            if (error?.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.error) {
                    errorMessage = `${error.response.data.error}: ${error.response.data.detail || 'Unknown error'}`;
                } else if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            
            // Show detailed error in console for debugging
            console.error('📚 Detailed error information:', {
                originalError: error,
                responseData: error?.response?.data,
                status: error?.response?.status,
                message: errorMessage
            });
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    {/* Debug Information Card */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">🔍 Debug Information</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>Authentication Status</h6>
                                    <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</p>
                                    <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
                                    <p><strong>LocalStorage Token:</strong> {localStorage.getItem('userToken') ? 'Present' : 'Missing'}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>🧪 API Testing</h6>
                                    <button 
                                        className="btn btn-primary btn-sm me-2" 
                                        onClick={testAPIConnection}
                                    >
                                        Test API Connection
                                    </button>
                                    <button 
                                        className="btn btn-success btn-sm" 
                                        onClick={loadAttendance}
                                    >
                                        🔄 Reload Data
                                    </button>
                                </div>
                                <div className="col-md-4">
                                    <h6>Data Status</h6>
                                    <p><strong>Teacher Attendance:</strong> {attendanceList.length}</p>
                                    <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                                    <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            {/* Debug Data Display */}
                            <div className="mt-3">
                                <h6>Debug Data (First 2 items):</h6>
                                <pre className="bg-light p-2 rounded">
                                    {JSON.stringify(attendanceList.slice(0, 2), null, 2)}
                                </pre>
                            </div>
                            
                            {/* Form Data Validation */}
                            <div className="mt-3">
                                <h6>Current Form Data:</h6>
                                <pre className="bg-light p-2 rounded">
                                    {JSON.stringify(formData, null, 2)}
                                </pre>
                                <div className="mt-2">
                                    <small className="text-muted">
                                        <strong>Validation:</strong> 
                                        Date: {formData.date ? '✅ Valid' : '❌ Required'} | 
                                        Status: {formData.status ? '✅ Valid' : '❌ Required'} | 
                                        Time In: {formData.time_in ? (formData.time_in.includes(':') ? '✅ Valid' : '❌ Invalid format') : '⚠️ Optional'} | 
                                        Time Out: {formData.time_out ? (formData.time_out.includes(':') ? '✅ Valid' : '❌ Invalid format') : '⚠️ Optional'}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Teacher Attendance</h4>
                            {allowed.length > 0 && (
                                <span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
                            )}
                        </div>
                        <div className="card-body">
                            {/* CREATE FORM - POST functionality */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6>Create New Teacher Attendance</h6>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="col-md-2">
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
                                            <label className="form-label">Time In</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="time_in"
                                                value={formData.time_in}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Time Out</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="time_out"
                                                value={formData.time_out}
                                                onChange={handleInputChange}
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
                                                <option value="Half Day">Half Day</option>
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
                                                className="btn btn-primary w-100"
                                                disabled={creating || !formData.date || !formData.status}
                                            >
                                                {creating ? '...' : '+'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* ATTENDANCE LIST - GET functionality */}
                            {loading && <p>Loading...</p>}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <strong>Error Creating Attendance:</strong>
                                            <div className="mt-2">
                                                {typeof error === 'string' ? (
                                                    <p className="mb-0">{error}</p>
                                                ) : (
                                                    <div>
                                                        {error.error && <p className="mb-1"><strong>Type:</strong> {error.error}</p>}
                                                        {error.detail && <p className="mb-1"><strong>Details:</strong> {error.detail}</p>}
                                                        {error.message && <p className="mb-0"><strong>Message:</strong> {error.message}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="btn-close" 
                                            onClick={() => setError(null)}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="mt-3">
                                        <small className="text-muted">
                                            <strong>Debug Info:</strong> Check the browser console for detailed error information.
                                        </small>
                                    </div>
                                </div>
                            )}
                            {!loading && !error && (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Teacher</th>
                                                <th>Date</th>
                                                <th>Time In</th>
                                                <th>Time Out</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceList.map((attendance) => (
                                                <tr key={attendance.id}>
                                                    <td>{attendance.id}</td>
                                                    <td>{attendance.teacher || '—'}</td>
                                                    <td>{attendance.date || '—'}</td>
                                                    <td>{attendance.time_in || '—'}</td>
                                                    <td>{attendance.time_out || '—'}</td>
                                                    <td>{attendance.status || '—'}</td>
                                                    <td>{attendance.notes || '—'}</td>
                                                    <td>
                                                        <div className="d-flex gap-1">
                                                        <Link 
                                                                to={`/attendance/teacher-attendance/${attendance.id}`} 
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                                View
                                                        </Link>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-info"
                                                                onClick={() => testPatchEndpoint(attendance)}
                                                                disabled={patchingId === attendance.id}
                                                            >
                                                                {patchingId === attendance.id ? '...' : 'PATCH'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {attendanceList.length === 0 && (
                                                <tr><td colSpan={8} className="text-center text-muted">No teacher attendance records found</td></tr>
                                            )}
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

export default TeacherAttendance; 