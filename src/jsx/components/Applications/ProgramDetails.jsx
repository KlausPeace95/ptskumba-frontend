import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgramById } from '../../../services/ApplicationService';

export default function ProgramDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [program, setProgram] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [allowed, setAllowed] = useState([]);

	useEffect(() => {
		loadProgram();
	}, [id]);

	const loadProgram = async () => {
		try {
			// Get allowed methods via OPTIONS
			try {
				const opt = await getProgramById(id, true);
				const allow = opt?.headers?.allow || opt?.headers?.Allow || '';
				setAllowed(allow.split(',').map((m) => m.trim()).filter(Boolean));
			} catch (e) {}
			
			const data = await getProgramById(id);
			setProgram(data);
		} catch (error) {
			setError(error?.response?.data || error?.message);
		} finally {
			setLoading(false);
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
	if (!program) return <div className="card"><div className="card-body">Program not found</div></div>;

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header d-flex justify-content-between align-items-center">
							<h4 className="mb-0">Program Details #{program.id}</h4>
							{allowed.length > 0 && (
								<span className="badge badge-outline-primary">Allow: {allowed.join(', ')}</span>
							)}
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-6">
									<h6>Program Information</h6>
									<table className="table table-borderless">
										<tbody>
											<tr><td><strong>ID:</strong></td><td>{program.id}</td></tr>
											<tr><td><strong>Name:</strong></td><td>{program.name || 'N/A'}</td></tr>
											<tr><td><strong>Description:</strong></td><td>{program.description || 'N/A'}</td></tr>
											<tr><td><strong>Duration:</strong></td><td>{program.duration || 'N/A'}</td></tr>
											<tr><td><strong>Credits:</strong></td><td>{program.credits || 'N/A'}</td></tr>
											<tr><td><strong>Created At:</strong></td><td>{program.created_at || 'N/A'}</td></tr>
										</tbody>
									</table>
								</div>
								<div className="col-md-6">
									<h6>Actions</h6>
									<div className="mb-3">
										<button 
											className="btn btn-secondary" 
											onClick={() => navigate('/applications/programs')}
										>
											Back to Programs
										</button>
									</div>
								</div>
							</div>
							
							<div className="mt-4">
								<h6>Raw Data</h6>
								<pre className="bg-light p-3 border small">{JSON.stringify(program, null, 2)}</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

