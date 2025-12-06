import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPeriodAttendance, createPeriodAttendance, patchPeriodAttendance } from '../../../services/AttendanceService';
import { useAuthStore } from '../../../store/store';

const PeriodAttendance = () => {
    console.log('⏰ PeriodAttendance component rendered');
    
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allowed, setAllowed] = useState([]);
    const [creating, setCreating] = useState(false);
    const [patchingId, setPatchingId] = useState(null);
    const [formData, setFormData] = useState({
        period: '',
        class_name: '',
        date: '',
        subject: '',
        teacher: ''
    });

    // Get auth state
    const { user, token } = useAuthStore();

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            console.log('🔍 Attempting to load period attendance...');
            console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
            console.log('👤 Current user:', user);
            console.log('🔑 Store token:', token);
            
            // Get allowed methods via OPTIONS
            try {
                const opt = await getPeriodAttendance(true);
                const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
                setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
            } catch (e) {}
            
            const data = await getPeriodAttendance();
            console.log('✅ Period attendance loaded successfully:', data);
            setAttendanceList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error loading period attendance:', error);
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
            console.log('🧪 Testing API connection to /api/attendance/period-attendance/');
            const response = await fetch('http://ptskumba-backend.onrender.com/api/attendance/period-attendance/', {
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
            console.log('🧪 Testing PATCH endpoint for period attendance:', attendance.id);
            const patchData = {
                notes: `Updated via PATCH at ${new Date().toLocaleString()}`
            };
            
            await patchPeriodAttendance(attendance.id, patchData);
            alert(`✅ PATCH Test Successful!\nUpdated period attendance: ${attendance.student}\nNew notes: ${patchData.notes}`);
            
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
        if (!formData.period || !formData.date) return;
        
        setCreating(true);
        try {
            await createPeriodAttendance(formData);
            // Reload attendance list after creation
            await loadAttendance();
            // Reset form
            setFormData({
                period: '',
                class_name: '',
                date: '',
                subject: '',
                teacher: ''
            });
        } catch (error) {
            setError(error?.response?.data || error?.message);
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
                                    <p><strong>Period Attendance:</strong> {attendanceList.length}</p>
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
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Period Attendance</h4>
                            {allowed.length > 0 && (
                                <span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
                            )}
                        </div>
                        <div className="card-body">
                            {/* CREATE FORM - POST functionality */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6>Create New Period Attendance</h6>
                                    <form onSubmit={handleSubmit} className="row g-3">
                                        <div className="col-md-2">
                                            <label className="form-label">Period *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="period"
                                                value={formData.period}
                                                onChange={handleInputChange}
                                                placeholder="Period number"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Class</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="class_name"
                                                value={formData.class_name}
                                                onChange={handleInputChange}
                                                placeholder="Class name"
                                            />
                                        </div>
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
                                            <label className="form-label">Subject</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="Subject name"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Teacher</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="teacher"
                                                value={formData.teacher}
                                                onChange={handleInputChange}
                                                placeholder="Teacher name"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">&nbsp;</label>
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={creating || !formData.period || !formData.date}
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
                                <div className="alert alert-danger">
                                    <strong>Error:</strong> {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                                </div>
                            )}
                            {!loading && !error && (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Student</th>
                                                <th>Period</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Reason for Absence</th>
                                                <th>Notes</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceList.map((attendance) => (
                                                <tr key={attendance.id}>
                                                    <td>{attendance.id}</td>
                                                    <td>{attendance.student || '—'}</td>
                                                    <td>{attendance.period || '—'}</td>
                                                    <td>{attendance.date || '—'}</td>
                                                    <td>{attendance.status || '—'}</td>
                                                    <td>{attendance.reason_for_absence || '—'}</td>
                                                    <td>{attendance.notes || '—'}</td>
                                                    <td>
                                                        <div className="d-flex gap-1">
                                                            <Link 
                                                                to={`/attendance/period-attendance/${attendance.id}`} 
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
                                                <tr><td colSpan={8} className="text-center text-muted">No period attendance records found</td></tr>
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

export default PeriodAttendance; 