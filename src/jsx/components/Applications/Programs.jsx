import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms } from '../../../services/ApplicationService';

export default function Programs() {
	const [programs, setPrograms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);

	useEffect(() => {
		loadPrograms();
	}, []);

	const loadPrograms = async () => {
		try {
			// Get allowed methods via OPTIONS
			try {
				const opt = await getPrograms(true);
				const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
				setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
			} catch (e) {}
			
			const data = await getPrograms();
			setPrograms(Array.isArray(data) ? data : []);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">Academic Programs</h4>
							{allowed.length > 0 && (
								<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
							)}
						</div>
						<div className="card-body">
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
												<th>Description</th>
												<th>Duration</th>
												<th>Credits</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{programs.map((program) => (
												<tr key={program.id}>
													<td>{program.id}</td>
													<td>{program.name || '—'}</td>
													<td>{program.description || '—'}</td>
													<td>{program.duration || '—'}</td>
													<td>{program.credits || '—'}</td>
													<td className="text-end">
														<Link 
															to={`/applications/programs/${program.id}`} 
															className="btn btn-sm btn-primary"
														>
															View Details
														</Link>
													</td>
												</tr>
											))}
											{programs.length === 0 && (
												<tr><td colSpan={6} className="text-center text-muted">No programs found</td></tr>
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

