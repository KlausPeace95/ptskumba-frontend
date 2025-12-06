import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPeriodAttendanceById } from '../../../services/AttendanceService';

const PeriodAttendanceDetails = () => {
    console.log('⏰ PeriodAttendanceDetails component rendered');
    
    const { id } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allowed, setAllowed] = useState([]);

    useEffect(() => {
        loadAttendance();
    }, [id]);

    const loadAttendance = async () => {
        try {
            // Get allowed methods via OPTIONS
            try {
                const opt = await getPeriodAttendanceById(id, true);
                const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
                setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
            } catch (e) {}
            
            const data = await getPeriodAttendanceById(id);
            setAttendance(data);
        } catch (error) {
            setError(error?.response?.data || error?.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="card"><div className="card-body">Loading...</div></div>;
    if (error) return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-danger">
                    <strong>Error:</strong> {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                </div>
            </div>
        </div>
    );
    if (!attendance) return <div className="card"><div className="card-body">Attendance record not found</div></div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Period Attendance Details #{attendance.id}</h4>
                            {allowed.length > 0 && (
                                <span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Attendance Information</h6>
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr><td><strong>ID:</strong></td><td>{attendance.id}</td></tr>
                                            <tr><td><strong>Period:</strong></td><td>{attendance.period || 'N/A'}</td></tr>
                                            <tr><td><strong>Class:</strong></td><td>{attendance.class || attendance.class_name || 'N/A'}</td></tr>
                                            <tr><td><strong>Date:</strong></td><td>{attendance.date || 'N/A'}</td></tr>
                                            <tr><td><strong>Subject:</strong></td><td>{attendance.subject || 'N/A'}</td></tr>
                                            <tr><td><strong>Teacher:</strong></td><td>{attendance.teacher || 'N/A'}</td></tr>
                                            <tr><td><strong>Created At:</strong></td><td>{attendance.created_at || 'N/A'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-6">
                                    <h6>Actions</h6>
                                    <div className="mb-3">
                                        <button 
                                            className="btn btn-secondary" 
                                            onClick={() => navigate('/attendance/period-attendance')}
                                        >
                                            Back to Period Attendance
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <h6>Raw Data</h6>
                                <pre className="bg-light p-3 border small">{JSON.stringify(attendance, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodAttendanceDetails; 