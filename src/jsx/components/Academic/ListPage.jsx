import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ListPage = ({ 
	title, 
	fetchFn, 
	columns = [], 
	headerActions = null, 
	basePath = 'academic',
	createFn = null,
	updateFn = null,
	deleteFn = null,
	formFields = []
}) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);
	const [creating, setCreating] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	const [formData, setFormData] = useState({});
	const [successMessage, setSuccessMessage] = useState('');
	
	// Ensure columns is always an array and has the right structure
	const safeColumns = Array.isArray(columns) ? columns : [];

	// Initialize form data based on formFields
	useEffect(() => {
		const initialFormData = {};
		formFields.forEach(field => {
			initialFormData[field.name] = field.defaultValue || '';
		});
		setFormData(initialFormData);
	}, [formFields]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				console.log(`[${title}] Fetching data...`);
				
				// Get allowed methods via OPTIONS if fetchFn supports it
				if (fetchFn.length > 0) {
					try {
						const opt = await fetchFn(true);
						const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
						setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
					} catch (e) {}
				}
				
				const payload = await fetchFn();
				if (!mounted) return;
				console.log(`[${title}] Raw payload:`, payload);
				console.log(`[${title}] Payload type:`, typeof payload);
				console.log(`[${title}] Is array:`, Array.isArray(payload));
				
				const processedData = Array.isArray(payload) ? payload : [];
				setData(processedData);
				console.log(`[${title}] Processed data:`, processedData);
			} catch (e) {
				console.error(`[${title}] Error:`, e);
				setError(e?.response?.data || e?.message || 'Request failed');
			} finally {
				setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [fetchFn, title]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!createFn) return;
		
		setCreating(true);
		try {
			await createFn(formData);
			// Reload data after creation
			const payload = await fetchFn();
			setData(Array.isArray(payload) ? payload : []);
			// Reset form
			const initialFormData = {};
			formFields.forEach(field => {
				initialFormData[field.name] = field.defaultValue || '';
			});
			setFormData(initialFormData);
			setSuccessMessage(`${title} created successfully!`);
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setCreating(false);
		}
	};

	const handleEdit = (item) => {
		setEditingId(item.id);
		setFormData({ ...item });
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		if (!editingId || !updateFn) return;
		
		setCreating(true);
		try {
			await updateFn(editingId, formData);
			// Reload data after update
			const payload = await fetchFn();
			setData(Array.isArray(payload) ? payload : []);
			// Reset form and editing state
			const initialFormData = {};
			formFields.forEach(field => {
				initialFormData[field.name] = field.defaultValue || '';
			});
			setFormData(initialFormData);
			setEditingId(null);
			setSuccessMessage(`${title} updated successfully!`);
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setCreating(false);
		}
	};

	const handleDelete = async (itemId) => {
		if (!deleteFn || !confirm('Are you sure you want to delete this item?')) return;
		
		setDeletingId(itemId);
		try {
			await deleteFn(itemId);
			// Reload data after deletion
			const payload = await fetchFn();
			setData(Array.isArray(payload) ? payload : []);
			setSuccessMessage(`${title} deleted successfully!`);
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setDeletingId(null);
		}
	};

	const cancelEdit = () => {
		setEditingId(null);
		const initialFormData = {};
		formFields.forEach(field => {
			initialFormData[field.name] = field.defaultValue || '';
		});
		setFormData(initialFormData);
	};

	// Debug logging
	console.log(`[${title}] Rendering with:`, { 
		columns: safeColumns, 
		dataLength: data.length, 
		loading, 
		error,
		basePath,
		createFn: !!createFn,
		updateFn: !!updateFn,
		deleteFn: !!deleteFn
	});

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header pb-0 border-0 d-flex justify-content-between align-items-center">
							<h4 className="mb-0">{title}</h4>
							<div className="d-flex align-items-center gap-2">
								{allowed.length > 0 && (
									<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
								)}
								{headerActions}
								<span className="badge bg-primary">{data.length}</span>
							</div>
						</div>
						<div className="card-body">
							{/* Success Message */}
							{successMessage && (
								<div className="alert alert-success alert-dismissible fade show" role="alert">
									{successMessage}
									<button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
								</div>
							)}

							{/* CREATE/EDIT FORM - POST/PUT functionality */}
							{(createFn || updateFn) && formFields.length > 0 && (
								<div className="row mb-4">
									<div className="col-12">
										<h6>{editingId ? `Edit ${title}` : `Create New ${title}`}</h6>
										<form onSubmit={editingId ? handleUpdate : handleSubmit} className="row g-3">
											{formFields.map((field, index) => (
												<div key={field.name} className={`col-md-${field.colSize || 3}`}>
													<label className="form-label">{field.label} {field.required && '*'}</label>
													{field.type === 'textarea' ? (
														<textarea
															className="form-control"
															name={field.name}
															value={formData[field.name] || ''}
															onChange={handleInputChange}
															placeholder={field.placeholder}
															required={field.required}
															rows={field.rows || 2}
														/>
													) : (
														<input
															type={field.type || 'text'}
															className="form-control"
															name={field.name}
															value={formData[field.name] || ''}
															onChange={handleInputChange}
															placeholder={field.placeholder}
															required={field.required}
														/>
													)}
												</div>
											))}
											<div className="col-md-3">
												<label className="form-label">&nbsp;</label>
												<div className="d-flex gap-2">
													<button
														type="submit"
														className="btn btn-primary flex-fill"
														disabled={creating}
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
							)}

							{/* DATA LIST - GET functionality */}
							{loading && <div>Loading...</div>}
							{error && (
								<div className="alert alert-danger">
									{typeof error === 'string' ? error : JSON.stringify(error)}
								</div>
							)}
							{!loading && !error && (
								<div className="table-responsive">
									{(() => {
										try {
											return (
												<table className="table table-striped">
													<thead>
														<tr>
															{safeColumns.length ? (
																safeColumns.map((c) => <th key={c.key || c}>{c.title || c.label || c}</th>)
															) : (
																<>
																	<th>ID</th>
																	<th>Name</th>
																	<th>Details</th>
																</>
															)}
															{(updateFn || deleteFn) && <th>Actions</th>}
														</tr>
													</thead>
													<tbody>
														{data.length === 0 ? (
															<tr>
																<td colSpan={(safeColumns.length || 3) + (updateFn || deleteFn ? 1 : 0)} className="text-center text-muted">
																	No data available
																</td>
															</tr>
														) : (
															data.map((row, idx) => (
																<tr key={row.id || idx}>
																	{safeColumns.length ? (
																		safeColumns.map((c) => (
																			<td key={c.key || c}>{String(row[c.key || c] ?? '')}</td>
																		))
																	) : (
																		<>
																			<td>{row.id}</td>
																			<td>{row.name || 'N/A'}</td>
																			<td>
																				{row.id && (
																					<Link 
																						to={`/${basePath}/${title.toLowerCase().replace(/\s+/g, '-')}/${row.id}`}
																						className="btn btn-sm btn-outline-primary"
																					>
																						View Details
																					</Link>
																				)}
																			</td>
																		</>
																	)}
																	{(updateFn || deleteFn) && (
																		<td>
																			<div className="d-flex gap-1">
																				{updateFn && (
																					<button
																						type="button"
																						className="btn btn-sm btn-warning"
																						onClick={() => handleEdit(row)}
																					>
																						Edit
																					</button>
																				)}
																				{deleteFn && (
																					<button
																						type="button"
																						className="btn btn-sm btn-danger"
																						onClick={() => handleDelete(row.id)}
																						disabled={deletingId === row.id}
																					>
																						{deletingId === row.id ? '...' : 'Delete'}
																					</button>
																				)}
																			</div>
																		</td>
																	)}
																</tr>
															))
														)}
													</tbody>
												</table>
											);
										} catch (renderError) {
											console.error(`[${title}] Table render error:`, renderError);
											return (
												<div className="alert alert-danger">
													Error rendering table: {renderError.message}
												</div>
											);
										}
									})()}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListPage; 