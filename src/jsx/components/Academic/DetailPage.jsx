import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailPage = ({ 
	title, 
	fetchById, 
	updateFn = null, 
	patchFn = null, 
	deleteFn = null,
	formFields = []
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [formData, setFormData] = useState({});
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				
				// Get allowed methods via OPTIONS if fetchById supports it
				if (fetchById.length > 1) {
					try {
						const opt = await fetchById(id, true);
						const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
						setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
					} catch (e) {}
				}
				
				const payload = await fetchById(id);
				if (!mounted) return;
				setData(payload);
				setFormData(payload);
				console.log(`[${title}] detail payload`, payload);
			} catch (e) {
				setError(e?.response?.data || e?.message || 'Request failed');
			} finally {
				setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [id, fetchById, title]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		if (!updateFn) return;
		
		setSaving(true);
		try {
			const updatedData = await updateFn(id, formData);
			setData(updatedData);
			setFormData(updatedData);
			setEditing(false);
			setSuccessMessage(`${title} updated successfully!`);
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setSaving(false);
		}
	};

	const handlePatch = async (e) => {
		e.preventDefault();
		if (!patchFn) return;
		
		setSaving(true);
		try {
			const updatedData = await patchFn(id, formData);
			setData(updatedData);
			setFormData(updatedData);
			setEditing(false);
			setSuccessMessage(`${title} patched successfully!`);
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!deleteFn || !confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;
		
		setDeleting(true);
		try {
			await deleteFn(id);
			setSuccessMessage(`${title} deleted successfully!`);
			setTimeout(() => {
				// Navigate back to list
				const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
				navigate(basePath);
			}, 1500);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setDeleting(false);
		}
	};

	const startEdit = () => {
		setEditing(true);
		setFormData(data);
	};

	const cancelEdit = () => {
		setEditing(false);
		setFormData(data);
		setError(null);
	};

	const renderDataField = (key, value) => {
		if (value === null || value === undefined) return 'N/A';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header pb-0 border-0 d-flex justify-content-between align-items-center">
							<h4 className="mb-0">{title} Details</h4>
							<div className="d-flex align-items-center gap-2">
								{allowed.length > 0 && (
									<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
								)}
								<span className="badge bg-info">ID: {id}</span>
								<button
									type="button"
									className="btn btn-secondary btn-sm"
									onClick={() => navigate(-1)}
								>
									← Back
								</button>
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

							{loading && <div>Loading...</div>}
							{error && (
								<div className="alert alert-danger">
									{typeof error === 'string' ? error : JSON.stringify(error)}
								</div>
							)}
							
							{!loading && !error && data && (
								<>
									{/* Action Buttons */}
									<div className="row mb-4">
										<div className="col-12">
											<div className="d-flex gap-2">
												{(updateFn || patchFn) && (
													<button
														type="button"
														className="btn btn-warning"
														onClick={startEdit}
														disabled={editing}
													>
														{editing ? 'Editing...' : 'Edit'}
													</button>
												)}
												{deleteFn && (
													<button
														type="button"
														className="btn btn-danger"
														onClick={handleDelete}
														disabled={deleting}
													>
														{deleting ? 'Deleting...' : 'Delete'}
													</button>
												)}
											</div>
										</div>
									</div>

									{/* EDIT FORM - PUT/PATCH functionality */}
									{editing && (updateFn || patchFn) && (
										<div className="row mb-4">
											<div className="col-12">
												<h6>Edit {title}</h6>
												<form onSubmit={updateFn ? handleUpdate : handlePatch} className="row g-3">
													{formFields.length > 0 ? (
														formFields.map((field) => (
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
														))
													) : (
														// Auto-generate form fields from data
														Object.entries(data).map(([key, value]) => {
															if (key === 'id') return null; // Skip ID field
															return (
																<div key={key} className="col-md-3">
																	<label className="form-label">{key.replace(/_/g, ' ')}</label>
																	<input
																		type="text"
																		className="form-control"
																		name={key}
																		value={formData[key] || ''}
																		onChange={handleInputChange}
																		placeholder={key}
																	/>
																</div>
															);
														})
													)}
													<div className="col-12">
														<div className="d-flex gap-2">
															<button
																type="submit"
																className="btn btn-primary"
																disabled={saving}
															>
																{saving ? 'Saving...' : 'Save Changes'}
															</button>
															<button
																type="button"
																className="btn btn-secondary"
																onClick={cancelEdit}
															>
																Cancel
															</button>
														</div>
													</div>
												</form>
											</div>
										</div>
									)}

									{/* DATA DISPLAY - GET functionality */}
									<div className="row">
										<div className="col-md-8">
											<table className="table table-striped">
												<tbody>
													{Object.entries(data).map(([key, value]) => (
														<tr key={key}>
															<th className="text-capitalize" style={{width: '30%'}}>
																{key.replace(/_/g, ' ')}
															</th>
															<td>{renderDataField(key, value)}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</>
							)}
							
							{!loading && !error && !data && (
								<div className="alert alert-info">No data found for this {title.toLowerCase()}.</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailPage; 