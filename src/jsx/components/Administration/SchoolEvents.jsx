import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
	getSchoolEvents, 
	createSchoolEvent, 
	updateSchoolEvent, 
	patchSchoolEvent,
	deleteSchoolEvent,
	bulkUploadSchoolEvents,
	downloadSchoolEventsTemplate
} from '../../../services/AdministrationService';
import { useAuthStore } from '../../../store/store';

export default function SchoolEvents() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);
	const [creating, setCreating] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	const [patchingId, setPatchingId] = useState(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		event_date: '',
		start_time: '',
		end_time: '',
		location: '',
		event_type: ''
	});

	// Get auth state
	const { user, token } = useAuthStore();

	useEffect(() => {
		loadEvents();
	}, []);

	const loadEvents = async () => {
		try {
			console.log('🔍 Attempting to load school events...');
			console.log('🔑 Token in localStorage:', localStorage.getItem('userToken'));
			console.log('👤 Current user:', user);
			console.log('🔑 Store token:', token);
			
			// Get allowed methods via OPTIONS
			try {
				const opt = await getSchoolEvents(true);
				const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
				setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
			} catch (e) {}
			
			const data = await getSchoolEvents();
			console.log('✅ School events loaded successfully:', data);
			setEvents(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error('❌ Error loading school events:', error);
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
			console.log('🧪 Testing API connection to /api/administration/school-events/');
			const response = await fetch('http://ptskumba-backend.onrender.com/api/administration/school-events/', {
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

	// Test bulk upload endpoint
	const testBulkUploadEndpoint = async () => {
		try {
			console.log('🧪 Testing bulk upload endpoint to /api/administration/school-events/bulk-upload/');
			const response = await fetch('http://ptskumba-backend.onrender.com/api/administration/school-events/bulk-upload/', {
				method: 'OPTIONS',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
					'Content-Type': 'application/json'
				}
			});
			console.log('🧪 Bulk Upload OPTIONS Response Status:', response.status);
			console.log('🧪 Bulk Upload OPTIONS Response Headers:', response.headers);
			
			if (response.ok) {
				const allow = response.headers.get('allow') || 'No allow header';
				alert(`✅ Bulk Upload Endpoint Available!\nStatus: ${response.status}\nAllowed Methods: ${allow}`);
			} else {
				const errorData = await response.text();
				console.error('🧪 Bulk Upload Endpoint Error Response:', errorData);
				alert(`❌ Bulk Upload Endpoint Failed!\nStatus: ${response.status}\nError: ${errorData}`);
			}
		} catch (err) {
			console.error('🧪 Bulk Upload Endpoint Test Error:', err);
			alert(`❌ Bulk Upload Endpoint Test Error: ${err.message}`);
		}
	};

	// Test PATCH endpoint
	const testPatchEndpoint = async (event) => {
		try {
			console.log('🧪 Testing PATCH endpoint for school event:', event.id);
			const patchData = {
				description: `Updated via PATCH at ${new Date().toLocaleString()}`
			};
			
			await patchSchoolEvent(event.id, patchData);
			alert(`✅ PATCH Test Successful!\nUpdated event: ${event.title}\nNew description: ${patchData.description}`);
			
			// Reload data to show the change
			await loadEvents();
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
		if (!formData.title || !formData.event_date) return;
		
		setCreating(true);
		try {
			await createSchoolEvent(formData);
			// Reload events after creation
			await loadEvents();
			// Reset form
			setFormData({
				title: '',
				description: '',
				event_date: '',
				start_time: '',
				end_time: '',
				location: '',
				event_type: ''
			});
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setCreating(false);
		}
	};

	const handleEdit = (event) => {
		setEditingId(event.id);
		setFormData({
			title: event.title || '',
			description: event.description || '',
			event_date: event.event_date || '',
			start_time: event.start_time || '',
			end_time: event.end_time || '',
			location: event.location || '',
			event_type: event.event_type || ''
		});
	};

	const handleUpdate = async (e) => {
        e.preventDefault();
		if (!editingId) return;
		
		setCreating(true);
		try {
			await updateSchoolEvent(editingId, formData);
			// Reload events after update
			await loadEvents();
			// Reset form and editing state
			setFormData({
				title: '',
				description: '',
				event_date: '',
				start_time: '',
				end_time: '',
				location: '',
				event_type: ''
			});
			setEditingId(null);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setCreating(false);
		}
	};

	const handleDelete = async (eventId) => {
		if (!confirm('Are you sure you want to delete this event?')) return;
		
		setDeletingId(eventId);
		try {
			await deleteSchoolEvent(eventId);
			// Reload events after deletion
			await loadEvents();
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setDeletingId(null);
		}
	};

	const handleBulkUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		
            const formData = new FormData();
		formData.append('file', file);
		
		try {
            await bulkUploadSchoolEvents(formData);
			// Reload events after bulk upload
			await loadEvents();
        } catch (error) {
			setError(error?.response?.data || error?.message);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await downloadSchoolEventsTemplate();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'school_events_template.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
			setError(error?.response?.data || error?.message);
		}
	};

	const cancelEdit = () => {
		setEditingId(null);
		setFormData({
			title: '',
			description: '',
			event_date: '',
			start_time: '',
			end_time: '',
			location: '',
			event_type: ''
		});
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
										className="btn btn-primary btn-sm me-2 mb-2" 
										onClick={testAPIConnection}
									>
										Test API Connection
									</button>
									<button 
										className="btn btn-warning btn-sm me-2 mb-2" 
										onClick={testBulkUploadEndpoint}
									>
										Test Bulk Upload
									</button>
									<button 
										className="btn btn-success btn-sm mb-2" 
										onClick={loadEvents}
									>
										🔄 Reload Data
									</button>
								</div>
								<div className="col-md-4">
									<h6>Data Status</h6>
									<p><strong>School Events:</strong> {events.length}</p>
									<p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
									<p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
								</div>
							</div>
							{/* Debug Data Display */}
							<div className="mt-3">
								<h6>Debug Data (First 2 items):</h6>
								<pre className="bg-light p-2 rounded">
									{JSON.stringify(events.slice(0, 2), null, 2)}
								</pre>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">School Events</h4>
							{allowed.length > 0 && (
								<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
							)}
						</div>
						<div className="card-body">
							{/* BULK OPERATIONS */}
							<div className="row mb-4">
								<div className="col-12">
									<h6>Bulk Operations</h6>
									<div className="row g-3">
										<div className="col-md-4">
											<label className="form-label">Upload Events (CSV/Excel)</label>
											<input
												type="file"
												className="form-control"
												accept=".csv,.xlsx,.xls"
												onChange={handleBulkUpload}
											/>
										</div>
										<div className="col-md-4">
											<label className="form-label">&nbsp;</label>
											<button
												type="button"
												className="btn btn-secondary w-100"
												onClick={handleDownloadTemplate}
											>
												Download Template
											</button>
										</div>
									</div>
								</div>
							</div>

							{/* CREATE/EDIT FORM - POST/PUT functionality */}
							<div className="row mb-4">
								<div className="col-12">
									<h6>{editingId ? 'Edit Event' : 'Create New Event'}</h6>
									<form onSubmit={editingId ? handleUpdate : handleSubmit} className="row g-3">
										<div className="col-md-3">
											<label className="form-label">Title *</label>
											<input
												type="text"
												className="form-control"
												name="title"
												value={formData.title}
												onChange={handleInputChange}
												placeholder="Event title"
												required
											/>
										</div>
										<div className="col-md-3">
											<label className="form-label">Event Date *</label>
											<input
												type="date"
												className="form-control"
												name="event_date"
												value={formData.event_date}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className="col-md-2">
											<label className="form-label">Start Time</label>
											<input
												type="time"
												className="form-control"
												name="start_time"
												value={formData.start_time}
												onChange={handleInputChange}
											/>
										</div>
										<div className="col-md-2">
											<label className="form-label">End Time</label>
											<input
												type="time"
												className="form-control"
												name="end_time"
												value={formData.end_time}
												onChange={handleInputChange}
											/>
										</div>
										<div className="col-md-2">
											<label className="form-label">Location</label>
											<input
												type="text"
												className="form-control"
												name="location"
												value={formData.location}
												onChange={handleInputChange}
												placeholder="Event location"
											/>
										</div>
										<div className="col-md-3">
											<label className="form-label">Event Type</label>
											<input
												type="text"
												className="form-control"
												name="event_type"
												value={formData.event_type}
												onChange={handleInputChange}
												placeholder="e.g., Sports, Academic"
											/>
										</div>
										<div className="col-md-6">
											<label className="form-label">Description</label>
											<textarea
												className="form-control"
												name="description"
												value={formData.description}
												onChange={handleInputChange}
												placeholder="Event description"
												rows="2"
											/>
										</div>
										<div className="col-md-3">
											<label className="form-label">&nbsp;</label>
											<div className="d-flex gap-2">
												<button
													type="submit"
													className="btn btn-primary flex-fill"
													disabled={creating || !formData.title || !formData.event_date}
												>
													{creating ? 'Saving...' : (editingId ? 'Update' : 'Create')}
												</button>
												{editingId && (
													<button
														type="button"
														className="btn btn-secondary"
														onClick={cancelEdit}
													>
														Cancel
													</button>
												)}
											</div>
										</div>
									</form>
								</div>
							</div>

							{/* EVENTS LIST - GET functionality */}
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
												<th>Title</th>
												<th>Date</th>
												<th>Time</th>
												<th>Location</th>
												<th>Type</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{events.map((event) => (
												<tr key={event.id}>
													<td>{event.id}</td>
													<td>{event.title || '—'}</td>
													<td>{event.event_date || '—'}</td>
													<td>
														{event.start_time && event.end_time 
															? `${event.start_time} - ${event.end_time}`
															: event.start_time || '—'
														}
													</td>
													<td>{event.location || '—'}</td>
													<td>{event.event_type || '—'}</td>
													<td>
														<div className="d-flex gap-1">
															<Link 
																to={`/administration/school-events/${event.id}`} 
																className="btn btn-sm btn-primary"
															>
																View
															</Link>
															<button
																type="button"
																className="btn btn-sm btn-warning"
																onClick={() => handleEdit(event)}
															>
																Edit
															</button>
															<button
																type="button"
																className="btn btn-sm btn-info"
																onClick={() => testPatchEndpoint(event)}
																disabled={patchingId === event.id}
															>
																{patchingId === event.id ? '...' : 'PATCH'}
															</button>
															<button
																type="button"
																className="btn btn-sm btn-danger"
																onClick={() => handleDelete(event.id)}
																disabled={deletingId === event.id}
															>
																{deletingId === event.id ? '...' : 'Delete'}
															</button>
														</div>
													</td>
												</tr>
											))}
											{events.length === 0 && (
												<tr><td colSpan={7} className="text-center text-muted">No events found</td></tr>
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