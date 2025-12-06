import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyApplicationById, submitMyApplication } from '../../../services/ApplicationService';

export default function ApplicationDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [application, setApplication] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		loadApplication();
	}, [id]);

	const loadApplication = async () => {
		try {
			// Get allowed methods via OPTIONS
			try {
				const opt = await getMyApplicationById(id, true);
				const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
				setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
			} catch (e) {}
			
			const data = await getMyApplicationById(id);
			setApplication(data);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		setSubmitting(true);
		setSuccessMessage('');
		try {
			await submitMyApplication(id);
			setSuccessMessage('Application submitted successfully!');
			// Reload application to show updated status
			await loadApplication();
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setSubmitting(false);
		}
	};

	const getStatusBadgeClass = (status) => {
		switch(status) {
			case 'Approved': return 'success';
			case 'Rejected': return 'danger';
			case 'Pending': return 'warning';
			default: return 'secondary';
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
	if (!application) return <div className="card"><div className="card-body">Application not found</div></div>;

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">Application Details #{application.id}</h4>
							{allowed.length > 0 && (
								<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
							)}
						</div>
						<div className="card-body">
							{successMessage && (
								<div className="alert alert-success alert-dismissible fade show" role="alert">
									{successMessage}
									<button type="button" className="close" onClick={() => setSuccessMessage('')}>
										<span>&times;</span>
									</button>
								</div>
							)}

							<div className="row">
								<div className="col-md-6">
									<h6>Application Information</h6>
									<table className="table table-borderless">
										<tbody>
											<tr><td><strong>ID:</strong></td><td>{application.id}</td></tr>
											<tr><td><strong>Program:</strong></td><td>{application.program_name || application.program?.name || application.program || application.program_id}</td></tr>
											<tr><td><strong>Status:</strong></td><td>
												<span className={`badge badge-${getStatusBadgeClass(application.status)}`}>
													{application.status || 'Pending'}
												</span>
											</td></tr>
											<tr><td><strong>Applicant:</strong></td><td>{application.applicant_name || application.applicant || '—'}</td></tr>
											<tr><td><strong>Created:</strong></td><td>{application.created_at || '—'}</td></tr>
											<tr><td><strong>Notes:</strong></td><td>{application.notes || '—'}</td></tr>
										</tbody>
									</table>
								</div>
								<div className="col-md-6">
									<h6>Actions</h6>
									<div className="mb-3">
										<button 
											className="btn btn-secondary" 
											onClick={() => navigate('/applications/my-applications')}
										>
											Back to My Applications
										</button>
									</div>
									{application.status === 'Pending' && (
										<div className="mb-3">
											<button 
												className="btn btn-success" 
												onClick={handleSubmit}
												disabled={submitting}
											>
												{submitting ? 'Submitting...' : 'Submit Application'}
											</button>
										</div>
									)}
								</div>
							</div>
							
							<div className="mt-4">
								<h6>Raw Data</h6>
								<pre className="bg-light p-3 border small">{JSON.stringify(application, null, 2)}</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

