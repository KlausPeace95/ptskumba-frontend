import React, { useState } from 'react';
import { getStudentDebtOverview } from '../../../services/FinanceService';

const StudentDebtOverview = () => {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStudentData(null);

      const data = await getStudentDebtOverview(studentId);
      setStudentData(data);
    } catch (err) {
      console.error('Error fetching student debt overview:', err);
      setError(err?.response?.data?.detail || err.message || 'Failed to fetch student debt overview');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Student Debt Overview</h4>
            </div>
            <div className="card-body">
              {/* Search Form */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Search Student</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSearch} className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="studentId" className="form-label">Student ID</label>
                        <input
                          type="text"
                          className="form-control"
                          id="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter student ID"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !studentId.trim()}
                      >
                        {loading ? 'Searching...' : 'Search Student'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Loading student debt overview...</p>
                </div>
              )}

              {/* Student Debt Overview */}
              {studentData && (
                <div className="row">
                  {/* Student Information */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h5>Student Information</h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td><strong>Student ID:</strong></td>
                              <td>{studentData.id}</td>
                            </tr>
                            <tr>
                              <td><strong>Admission Number:</strong></td>
                              <td>{studentData.admission_number}</td>
                            </tr>
                            <tr>
                              <td><strong>Full Name:</strong></td>
                              <td>{studentData.full_name}</td>
                            </tr>
                            <tr>
                              <td><strong>Class Level:</strong></td>
                              <td>{studentData.class_level?.name || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Class Year:</strong></td>
                              <td>{studentData.class_of_year?.name || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Total Debt Summary */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h5>Total Debt Summary</h5>
                      </div>
                      <div className="card-body text-center">
                        <h2 className={`text-${studentData.debt > 0 ? 'danger' : 'success'}`}>
                          {formatCurrency(studentData.debt)}
                        </h2>
                        <p className="text-muted">
                          {studentData.debt > 0 ? 'Total Outstanding Debt' : 'No Outstanding Debt'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unpaid Debts */}
                  <div className="col-md-12 mt-4">
                    <div className="card">
                      <div className="card-header">
                        <h5>Unpaid Debts by Term</h5>
                      </div>
                      <div className="card-body">
                        {studentData.unpaid_debts && studentData.unpaid_debts.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Term</th>
                                  <th>Amount Added</th>
                                  <th>Amount Paid</th>
                                  <th>Balance</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {studentData.unpaid_debts.map((debt) => (
                                  <tr key={debt.id}>
                                    <td>{debt.term?.name || 'N/A'}</td>
                                    <td>{formatCurrency(debt.amount_added)}</td>
                                    <td>{formatCurrency(debt.amount_paid)}</td>
                                    <td className="text-danger">
                                      <strong>{formatCurrency(debt.balance)}</strong>
                                    </td>
                                    <td>
                                      <span className={`badge bg-${debt.is_reversed ? 'danger' : 'warning'}`}>
                                        {debt.is_reversed ? 'Reversed' : 'Unpaid'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center text-muted">
                            <p>No unpaid debts found for this student.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="col-md-12 mt-4">
                    <div className="card">
                      <div className="card-header">
                        <h5>Recent Payment History</h5>
                      </div>
                      <div className="card-body">
                        {studentData.payments && studentData.payments.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Method</th>
                                  <th>Reference</th>
                                  <th>Term</th>
                                  <th>Note</th>
                                </tr>
                              </thead>
                              <tbody>
                                {studentData.payments.map((payment) => (
                                  <tr key={payment.id}>
                                    <td>{new Date(payment.paid_on).toLocaleDateString()}</td>
                                    <td className="text-success">
                                      <strong>{formatCurrency(payment.amount)}</strong>
                                    </td>
                                    <td>{payment.method || 'N/A'}</td>
                                    <td>{payment.reference || 'N/A'}</td>
                                    <td>{payment.term_name || 'N/A'}</td>
                                    <td>{payment.note || 'N/A'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center text-muted">
                            <p>No payment history found for this student.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Debt Analysis */}
                  <div className="col-md-12 mt-4">
                    <div className="card">
                      <div className="card-header">
                        <h5>Debt Analysis</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="text-center">
                              <h4 className="text-info">
                                {studentData.unpaid_debts?.length || 0}
                              </h4>
                              <p className="text-muted">Terms with Outstanding Debt</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="text-center">
                              <h4 className="text-success">
                                {studentData.payments?.length || 0}
                              </h4>
                              <p className="text-muted">Total Payments Made</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="text-center">
                              <h4 className="text-warning">
                                {studentData.unpaid_debts?.filter(d => !d.is_reversed).length || 0}
                              </h4>
                              <p className="text-muted">Active Unpaid Terms</p>
                            </div>
                          </div>
                        </div>
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
};

export default StudentDebtOverview;
