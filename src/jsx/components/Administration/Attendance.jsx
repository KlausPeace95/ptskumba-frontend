import React from 'react';

const Attendance = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">
                                <i className="material-symbols-outlined me-2">checklist</i>
                                Attendance Management
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-info">
                                <h5>
                                    <i className="material-symbols-outlined me-2">construction</i>
                                    Coming Soon
                                </h5>
                                <p className="mb-0">
                                    Attendance management features will be available when attendance endpoints are integrated. 
                                    This section will include:
                                </p>
                                <ul className="mt-2 mb-0">
                                    <li>Student attendance tracking</li>
                                    <li>Staff attendance management</li>
                                    <li>Attendance reports and analytics</li>
                                    <li>Absence management</li>
                                </ul>
                            </div>
                            
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <i className="material-symbols-outlined text-primary" style={{fontSize: '3rem'}}>
                                                school
                                            </i>
                                            <h5 className="mt-2">Student Attendance</h5>
                                            <p className="text-muted">Track daily student attendance</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <i className="material-symbols-outlined text-success" style={{fontSize: '3rem'}}>
                                                person
                                            </i>
                                            <h5 className="mt-2">Staff Attendance</h5>
                                            <p className="text-muted">Monitor staff attendance records</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <i className="material-symbols-outlined text-warning" style={{fontSize: '3rem'}}>
                                                assessment
                                            </i>
                                            <h5 className="mt-2">Reports</h5>
                                            <p className="text-muted">Generate attendance reports</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;