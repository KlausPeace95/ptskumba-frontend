import React, { useState, useEffect } from 'react';
import { getAssignments, deleteAssignment } from '../../../services/AssignmentsService';

const AssignmentsList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const data = await getAssignments();
            setAssignments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading assignments...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">My Assignments</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Subject</th>
                                            <th>Class</th>
                                            <th>Due Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id}>
                                                <td>{assignment.title || 'N/A'}</td>
                                                <td>{assignment.subject || 'N/A'}</td>
                                                <td>{assignment.class || 'N/A'}</td>
                                                <td>{assignment.due_date || 'N/A'}</td>
                                                <td>
                                                    <a 
                                                        href={`#/teacher-dashboard/assignments/${assignment.id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentsList; 