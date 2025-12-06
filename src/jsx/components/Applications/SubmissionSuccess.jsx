import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function SubmissionSuccess() {
    const location = useLocation();
    const applicationData = location.state?.applicationData || {};

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg">
                        <div className="card-body text-center p-5">
                            {/* Success Icon */}
                            <div className="mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle" 
                                     style={{width: '80px', height: '80px'}}>
                                    <i className="material-symbols-outlined" style={{fontSize: '40px'}}>
                                        check_circle
                                    </i>
                                </div>
                            </div>

                            {/* Success Message */}
                            <h2 className="text-success mb-3">Application Submitted Successfully! 🎉</h2>
                            <p className="lead text-muted mb-4">
                                Your application has been submitted and is now under review by our admissions team.
                            </p>
                            
                            {/* Admin Notification */}
                            <div className="alert alert-warning">
                                <strong>📋 Admin Review Process:</strong>
                                <ul className="mb-0 mt-2">
                                    <li>Your application is now visible to administrators</li>
                                    <li>Admins will review your documents and information</li>
                                    <li>You'll receive status updates via email</li>
                                    <li>Check "My Applications" for current status</li>
                                </ul>
                            </div>

                            {/* Application Details */}
                            {applicationData.application_id && (
                                <div className="alert alert-info">
                                    <strong>Application ID:</strong> {applicationData.application_id}
                                    {applicationData.program_name && (
                                        <><br /><strong>Program:</strong> {applicationData.program_name}</>
                                    )}
                                    {applicationData.status && (
                                        <><br /><strong>Status:</strong> <span className="badge badge-primary">{applicationData.status.toUpperCase()}</span></>
                                    )}
                                    {applicationData.submitted_at && (
                                        <><br /><strong>Submitted:</strong> {applicationData.submitted_at}</>
                                    )}
                                </div>
                            )}

                            {/* Next Steps */}
                            <div className="card border-light mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">What Happens Next?</h5>
                                    <div className="row text-start">
                                        <div className="col-md-6">
                                            <ul className="list-unstyled">
                                                <li className="mb-2">
                                                    <i className="material-symbols-outlined text-primary me-2">schedule</i>
                                                    <strong>Review Process:</strong> 2-3 business days
                                                </li>
                                                <li className="mb-2">
                                                    <i className="material-symbols-outlined text-primary me-2">notifications</i>
                                                    <strong>Status Updates:</strong> Email notifications
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-unstyled">
                                                <li className="mb-2">
                                                    <i className="material-symbols-outlined text-primary me-2">school</i>
                                                    <strong>Interview:</strong> If shortlisted
                                                </li>
                                                <li className="mb-2">
                                                    <i className="material-symbols-outlined text-primary me-2">assignment_turned_in</i>
                                                    <strong>Final Decision:</strong> Within 1 week
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            							{/* Action Buttons */}
							<div className="d-flex justify-content-center gap-3">
								<Link to="/applications/my-applications" className="btn btn-outline-primary">
									<i className="material-symbols-outlined me-2">list</i>
									View My Applications
								</Link>
								<Link to="/applications/programs" className="btn btn-primary">
									<i className="material-symbols-outlined me-2">add</i>
									Apply to Another Program
								</Link>
								<Link to="/applications/statistics" className="btn btn-info">
									<i className="material-symbols-outlined me-2">analytics</i>
									View Statistics
								</Link>
							</div>

                            {/* Contact Information */}
                            <div className="mt-4 pt-4 border-top">
                                <p className="text-muted mb-2">
                                    <strong>Need Help?</strong> Contact our admissions team:
                                </p>
                                <p className="text-muted mb-0">
                                    📧 <a href="mailto:admissions@ptskumba.edu" className="text-decoration-none">admissions@ptskumba.edu</a> | 
                                    📞 <a href="tel:+237674386511" className="text-decoration-none">+237 674 386 511</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
