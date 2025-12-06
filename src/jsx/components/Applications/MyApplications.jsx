import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { getMyApplications, getApplicationStatistics, deleteMyApplication, submitMyApplication } from '../../../services/ApplicationService';
import { useAuthStore } from '../../../store/store';

export default function MyApplications() {
	const [applications, setApplications] = useState([]);
	const [statistics, setStatistics] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [actionLoading, setActionLoading] = useState({});
	const navigate = useNavigate();
	const { user, token } = useAuthStore();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			console.log('🔍 MyApplications: Loading data...');
			console.log('🔍 User:', user);
			console.log('🔍 Token:', token ? 'Present' : 'Missing');
			
			const [appsRes, statsRes] = await Promise.all([
				getMyApplications(),
				getApplicationStatistics()
			]);
			
			console.log('🔍 Applications response:', appsRes);
			console.log('🔍 Statistics response:', statsRes);
			
			// Handle different response formats
			setApplications(appsRes?.results || appsRes || []);
			setStatistics(statsRes || {});
		} catch (error) {
			console.error('❌ Error loading applications:', error);
			// Handle different error formats
			let errorMessage = 'Failed to load applications';
			if (error?.response?.data) {
				errorMessage = error.response.data;
			} else if (error?.message) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitApplication = async (applicationId) => {
		setActionLoading(prev => ({ ...prev, [`submit_${applicationId}`]: true }));
		try {
			await submitMyApplication(applicationId);
			await loadData(); // Reload data
			alert('Application submitted successfully!');
		} catch (error) {
			console.error('Error submitting application:', error);
			let errorMessage = 'Error submitting application. Please try again.';
			if (error?.response?.data) {
				errorMessage = `Error: ${JSON.stringify(error.response.data)}`;
			} else if (error?.message) {
				errorMessage = `Error: ${error.message}`;
			}
			alert(errorMessage);
		} finally {
			setActionLoading(prev => ({ ...prev, [`submit_${applicationId}`]: false }));
		}
	};

	const handleDeleteApplication = async (applicationId) => {
		if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
			return;
		}
		
		setActionLoading(prev => ({ ...prev, [`delete_${applicationId}`]: true }));
		try {
			await deleteMyApplication(applicationId);
			await loadData(); // Reload data
			alert('Application deleted successfully!');
		} catch (error) {
			console.error('Error deleting application:', error);
			let errorMessage = 'Error deleting application. Please try again.';
			if (error?.response?.data) {
				errorMessage = `Error: ${JSON.stringify(error.response.data)}`;
			} else if (error?.message) {
				errorMessage = `Error: ${error.message}`;
			}
			alert(errorMessage);
		} finally {
			setActionLoading(prev => ({ ...prev, [`delete_${applicationId}`]: false }));
		}
	};

	const getStatusBadgeClass = (status) => {
		switch(status?.toLowerCase()) {
			case 'approved': return 'success';
			case 'rejected': return 'danger';
			case 'under_review': return 'info';
			case 'waitlisted': return 'warning';
			case 'submitted': return 'primary';
			case 'draft': return 'secondary';
			default: return 'secondary';
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return '—';
		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	};

	// Check if user is authenticated
	if (!token || !user) {
		console.log('❌ MyApplications: No token or user, redirecting to login');
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="container-fluid">
			{/* Debug Info */}
			<div className="alert alert-info">
				<strong>Debug Info:</strong> User: {user?.email || 'Unknown'}, Token: {token ? 'Present' : 'Missing'}
			</div>
			
			{/* Statistics Cards */}
			{!loading && Object.keys(statistics).length > 0 && (
				<div className="row mb-4">
					<div className="col-xl-3 col-sm-6">
						<div className="card gradient-1 card-bx">
							<div className="card-body">
								<div className="media align-items-center">
									<div className="media-body text-white text-end">
										<span className="text-white">Total Applications</span>
										<h2 className="text-white">{statistics.total_applications || 0}</h2>
									</div>
									<div className="align-self-center">
										<i className="material-symbols-outlined text-white" style={{fontSize: '50px'}}>description</i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-sm-6">
						<div className="card gradient-2 card-bx">
							<div className="card-body">
								<div className="media align-items-center">
									<div className="media-body text-white text-end">
										<span className="text-white">Submitted</span>
										<h2 className="text-white">{statistics.submitted_applications || 0}</h2>
									</div>
									<div className="align-self-center">
										<i className="material-symbols-outlined text-white" style={{fontSize: '50px'}}>send</i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-sm-6">
						<div className="card gradient-3 card-bx">
							<div className="card-body">
								<div className="media align-items-center">
									<div className="media-body text-white text-end">
										<span className="text-white">Approved</span>
										<h2 className="text-white">{statistics.approved_applications || 0}</h2>
									</div>
									<div className="align-self-center">
										<i className="material-symbols-outlined text-white" style={{fontSize: '50px'}}>check_circle</i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-sm-6">
						<div className="card gradient-4 card-bx">
							<div className="card-body">
								<div className="media align-items-center">
									<div className="media-body text-white text-end">
										<span className="text-white">Draft</span>
										<h2 className="text-white">{statistics.draft_applications || 0}</h2>
									</div>
									<div className="align-self-center">
										<i className="material-symbols-outlined text-white" style={{fontSize: '50px'}}>edit</i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">My Applications</h4>
							<Link to="/student/application/new" className="btn btn-primary">
								<i className="material-symbols-outlined me-2">add</i>
								New Application
							</Link>
						</div>
						<div className="card-body">
							{loading && (
								<div className="text-center py-4">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
									<p className="mt-2">Loading applications...</p>
								</div>
							)}
							
							{error && (
								<div className="alert alert-danger">
									<strong>Error:</strong> {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
								</div>
							)}
							
							{!loading && !error && (
								<div className="table-responsive">
									<table className="table table-striped">
										<thead>
											<tr>
												<th>Application ID</th>
												<th>Program</th>
												<th>Status</th>
												<th>Submitted Date</th>
												<th>Created Date</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{applications.map((app) => (
												<tr key={app.id}>
													<td>
														<strong>{app.application_id || `APP-${app.id}`}</strong>
													</td>
													<td>
														<div>
															<strong>{app.program_name || 'Unknown Program'}</strong>
															{app.program_level && (
																<small className="d-block text-muted">{app.program_level}</small>
															)}
														</div>
													</td>
													<td>
														<span className={`badge badge-${getStatusBadgeClass(app.status)}`}>
															{app.status?.replace('_', ' ').toUpperCase() || 'DRAFT'}
														</span>
													</td>
													<td>{formatDate(app.submitted_at)}</td>
													<td>{formatDate(app.created_at)}</td>
													<td>
														<div className="btn-group">
															<Link 
																to={`/student/application/${app.id}`} 
																className="btn btn-sm btn-outline-primary"
																title="View Details"
															>
																<i className="material-symbols-outlined">visibility</i>
															</Link>
															
															{app.status === 'draft' && (
																<>
																	<Link 
																		to={`/student/application/${app.id}/edit`} 
																		className="btn btn-sm btn-outline-secondary"
																		title="Edit Application"
																	>
																		<i className="material-symbols-outlined">edit</i>
																	</Link>
																	
																	{app.can_submit && (
																		<button 
																			onClick={() => handleSubmitApplication(app.id)}
																			className="btn btn-sm btn-outline-success"
																			disabled={actionLoading[`submit_${app.id}`]}
																			title="Submit Application"
																		>
																			{actionLoading[`submit_${app.id}`] ? (
																				<span className="spinner-border spinner-border-sm" role="status"></span>
																			) : (
																				<i className="material-symbols-outlined">send</i>
																			)}
																		</button>
																	)}
																	
																	<button 
																		onClick={() => handleDeleteApplication(app.id)}
																		className="btn btn-sm btn-outline-danger"
																		disabled={actionLoading[`delete_${app.id}`]}
																		title="Delete Application"
																	>
																		{actionLoading[`delete_${app.id}`] ? (
																			<span className="spinner-border spinner-border-sm" role="status"></span>
																		) : (
																			<i className="material-symbols-outlined">delete</i>
																		)}
																	</button>
																</>
															)}
														</div>
													</td>
												</tr>
											))}
											{applications.length === 0 && (
												<tr>
													<td colSpan={6} className="text-center py-4">
														<div className="text-muted">
															<i className="material-symbols-outlined" style={{fontSize: '48px'}}>description</i>
															<p className="mt-2">No applications found</p>
															<Link to="/student/application/new" className="btn btn-primary">
																Create Your First Application
															</Link>
														</div>
													</td>
												</tr>
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
}

