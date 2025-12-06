import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTerms, createTerm, patchTerm } from '../../../services/AdministrationService';
import { useAuthStore } from '../../../store/store';

export default function Terms() {
	const [terms, setTerms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);
	const [creating, setCreating] = useState(false);
	const [patchingId, setPatchingId] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		start_date: '',
		end_date: '',
		description: ''
	});

	// Get auth state
	const { user, token } = useAuthStore();

	useEffect(() => {
		loadTerms();
	}, []);

	const loadTerms = async () => {
		try {
			console.log('🔍 Attempting to load terms...');
			console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
			console.log('👤 Current user:', user);
			console.log('🔑 Store token:', token);
			
			// Get allowed methods via OPTIONS
			try {
				const opt = await getTerms(true);
				const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
				setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
			} catch (e) {}
			
			const data = await getTerms();
			console.log('✅ Terms loaded successfully:', data);
			setTerms(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error('❌ Error loading terms:', error);
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
			console.log('🧪 Testing API connection to /api/administration/terms/');
			const response = await fetch('http://ptskumba-backend.onrender.com/api/administration/terms/', {
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
	const testPatchEndpoint = async (term) => {
		try {
			console.log('🧪 Testing PATCH endpoint for term:', term.id);
			const patchData = {
				description: `Updated via PATCH at ${new Date().toLocaleString()}`
			};
			
			await patchTerm(term.id, patchData);
			alert(`✅ PATCH Test Successful!\nUpdated term: ${term.name}\nNew description: ${patchData.description}`);
			
			// Reload data to show the change
			await loadTerms();
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
		if (!formData.name || !formData.start_date) return;
		
		setCreating(true);
		try {
			await createTerm(formData);
			// Reload terms after creation
			await loadTerms();
			// Reset form
			setFormData({
				name: '',
				start_date: '',
				end_date: '',
				description: ''
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
										onClick={loadTerms}
									>
										🔄 Reload Data
									</button>
								</div>
								<div className="col-md-4">
									<h6>Data Status</h6>
									<p><strong>Terms:</strong> {terms.length}</p>
									<p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
									<p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
								</div>
							</div>
							{/* Debug Data Display */}
							<div className="mt-3">
								<h6>Debug Data (First 2 items):</h6>
								<pre className="bg-light p-2 rounded">
									{JSON.stringify(terms.slice(0, 2), null, 2)}
								</pre>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">Terms</h4>
							{allowed.length > 0 && (
								<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
							)}
						</div>
						<div className="card-body">
							{/* CREATE FORM - POST functionality */}
							<div className="row mb-4">
								<div className="col-12">
									<h6>Create New Term</h6>
									<form onSubmit={handleSubmit} className="row g-3">
										<div className="col-md-3">
											<label className="form-label">Name *</label>
											<input
												type="text"
												className="form-control"
												name="name"
												value={formData.name}
												onChange={handleInputChange}
												placeholder="e.g., First Term"
												required
											/>
										</div>
										<div className="col-md-3">
											<label className="form-label">Start Date *</label>
											<input
												type="date"
												className="form-control"
												name="start_date"
												value={formData.start_date}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className="col-md-3">
											<label className="form-label">End Date</label>
											<input
												type="date"
												className="form-control"
												name="end_date"
												value={formData.end_date}
												onChange={handleInputChange}
											/>
										</div>
										<div className="col-md-2">
											<label className="form-label">Description</label>
											<input
												type="text"
												className="form-control"
												name="description"
												value={formData.description}
												onChange={handleInputChange}
												placeholder="Optional description"
											/>
										</div>
										<div className="col-md-1">
											<label className="form-label">&nbsp;</label>
											<button
												type="submit"
												className="btn btn-primary w-100"
												disabled={creating || !formData.name || !formData.start_date}
											>
												{creating ? '...' : '+'}
											</button>
										</div>
									</form>
								</div>
							</div>

							{/* TERMS LIST - GET functionality */}
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
												<th>Name</th>
												<th>Start Date</th>
												<th>End Date</th>
												<th>Description</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{terms.map((term) => (
												<tr key={term.id}>
													<td>{term.id}</td>
													<td>{term.name || '—'}</td>
													<td>{term.start_date || '—'}</td>
													<td>{term.end_date || '—'}</td>
													<td>{term.description || '—'}</td>
													<td>
														<div className="d-flex gap-1">
															<Link 
																to={`/administration/terms/${term.id}`} 
																className="btn btn-sm btn-primary"
															>
																View
															</Link>
															<button
																type="button"
																className="btn btn-sm btn-info"
																onClick={() => testPatchEndpoint(term)}
																disabled={patchingId === term.id}
															>
																{patchingId === term.id ? '...' : 'PATCH'}
															</button>
														</div>
													</td>
												</tr>
											))}
											{terms.length === 0 && (
												<tr><td colSpan={6} className="text-center text-muted">No terms found</td></tr>
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