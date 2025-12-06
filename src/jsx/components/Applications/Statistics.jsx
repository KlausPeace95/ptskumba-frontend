import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getApplicationStatistics } from '../../../services/ApplicationService';
import { useAuthStore } from '../../../store/store';

export default function Statistics() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);
	const { user, token } = useAuthStore();

	useEffect(() => {
		loadStatistics();
	}, []);

	const loadStatistics = async () => {
		try {
			console.log('🔍 Statistics: Loading data...');
			console.log('🔍 User:', user);
			console.log('🔍 Token:', token ? 'Present' : 'Missing');
			
			// Get allowed methods via OPTIONS
			try {
				const opt = await getApplicationStatistics(true);
				const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
				setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
			} catch (e) {}
			
			const response = await getApplicationStatistics();
			console.log('🔍 Statistics response:', response);
			setData(response);
		} catch (error) {
			console.error('❌ Error loading statistics:', error);
			// Handle different error formats
			let errorMessage = 'Unknown error occurred';
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

	// Check if user is authenticated
	if (!token || !user) {
		console.log('❌ Statistics: No token or user, redirecting to login');
		return <Navigate to="/login" replace />;
	}

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

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">Application Statistics</h4>
							{allowed.length > 0 && (
								<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
							)}
						</div>
						<div className="card-body">
							{data && (
								<div className="row">
									<div className="col-md-3 mb-3">
										<div className="card bg-primary text-white">
											<div className="card-body text-center">
												<h3 className="mb-0">{data.total_applications || 0}</h3>
												<p className="mb-0">Total Applications</p>
											</div>
										</div>
									</div>
									<div className="col-md-3 mb-3">
										<div className="card bg-warning text-white">
											<div className="card-body text-center">
												<h3 className="mb-0">{data.submitted_applications || 0}</h3>
												<p className="mb-0">Submitted</p>
											</div>
										</div>
									</div>
									<div className="col-md-3 mb-3">
										<div className="card bg-success text-white">
											<div className="card-body text-center">
												<h3 className="mb-0">{data.approved || 0}</h3>
												<p className="mb-0">Approved</p>
											</div>
										</div>
									</div>
									<div className="col-md-3 mb-3">
										<div className="card bg-danger text-white">
											<div className="card-body text-center">
												<h3 className="mb-0">{data.rejected_applications || 0}</h3>
												<p className="mb-0">Rejected</p>
											</div>
										</div>
									</div>
								</div>
							)}
							
							{data && (
								<div className="row mt-4">
									<div className="col-md-6">
										<div className="card">
											<div className="card-header">
												<h6 className="mb-0">Application Status Breakdown</h6>
											</div>
											<div className="card-body">
												<p><strong>Draft:</strong> {data.draft_applications || 0}</p>
												<p><strong>Under Review:</strong> {data.under_review || 0}</p>
												<p><strong>Waitlisted:</strong> {data.waitlisted || 0}</p>
												<p><strong>Success Rate:</strong> {data.success_rate || 'N/A'}</p>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="card">
											<div className="card-header">
												<h6 className="mb-0">Raw Data</h6>
											</div>
											<div className="card-body">
												<pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

