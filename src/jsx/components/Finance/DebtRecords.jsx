import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  getDebtRecords,
  updateStudentDebt,
  updateAllUnrecordedDebts,
  updatePastDebts,
  reverseStudentDebt
} from '../../../services/FinanceService';
import { useAuthStore } from '../../../store/store';

const DebtRecords = () => {
  const [debtRecords, setDebtRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowed, setAllowed] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [termIds, setTermIds] = useState('');
  const [selectedTermId, setSelectedTermId] = useState('');

  // Get authentication state
  const { user, token } = useAuthStore();

  // Check if user is authenticated
  if (!token || !user) {
    console.log('❌ DebtRecords: No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to finance (admin or accountant)
  if (!user.isAdmin && !user.isAccountant) {
    console.log('❌ DebtRecords: User does not have finance access');
    return <Navigate to="/dashboard" replace />;
  }

  // Debug functions
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing Debt Records API connection...');
      const data = await getDebtRecords();
      console.log('✅ Debt Records API connection successful:', data);
      alert('✅ Debt Records API connection successful!');
    } catch (error) {
      console.error('❌ Debt Records API connection failed:', error);
      alert('❌ Debt Records API connection failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testUpdateCurrentDebt = async () => {
    try {
      console.log('🧪 Testing Update Current Debt...');
      await updateStudentDebt();
      console.log('✅ Update Current Debt successful');
      alert('✅ Update Current Debt successful! Check console for details.');
      await loadDebtRecords();
    } catch (error) {
      console.error('❌ Update Current Debt failed:', error);
      alert('❌ Update Current Debt failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testUpdateAllMissingDebts = async () => {
    try {
      console.log('🧪 Testing Update All Missing Debts...');
      await updateAllUnrecordedDebts();
      console.log('✅ Update All Missing Debts successful');
      alert('✅ Update All Missing Debts successful! Check console for details.');
      await loadDebtRecords();
    } catch (error) {
      console.error('❌ Update All Missing Debts failed:', error);
      alert('❌ Update All Missing Debts failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testReverseStudentDebt = async () => {
    try {
      console.log('🧪 Testing Reverse Student Debt...');
      if (!selectedTermId) {
        alert('❌ Please select a term first');
        return;
      }
      await reverseStudentDebt(selectedTermId);
      console.log('✅ Reverse Student Debt successful');
      alert('✅ Reverse Student Debt successful! Check console for details.');
      await loadDebtRecords();
    } catch (error) {
      console.error('❌ Reverse Student Debt failed:', error);
      alert('❌ Reverse Student Debt failed: ' + (error?.response?.data || error?.message));
    }
  };

  useEffect(() => {
    loadDebtRecords();
    loadAllowedMethods();
  }, []);

  const loadDebtRecords = async () => {
    try {
      setLoading(true);
      const data = await getDebtRecords();
      setDebtRecords(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading debt records:', err);
      setError(err?.response?.data?.detail || err.message || 'Failed to load debt records');
    } finally {
      setLoading(false);
    }
  };

  const loadAllowedMethods = async () => {
    try {
      const response = await getDebtRecords(true);
      const allowHeader = response?.headers?.allow || 'GET, HEAD, OPTIONS';
      setAllowed(allowHeader.split(', ').map(method => method.trim()));
    } catch (err) {
      setAllowed(['GET', 'HEAD', 'OPTIONS']);
    }
  };

  const handleUpdateCurrentDebt = async () => {
    if (window.confirm('Are you sure you want to update current term debts for all students?')) {
      try {
        setProcessing(true);
        await updateStudentDebt();
        setSuccessMessage('Current term debts updated successfully!');
        loadDebtRecords();
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Update failed');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleUpdateAllMissingDebts = async () => {
    if (window.confirm('Are you sure you want to update all missing debts for all terms?')) {
      try {
        setProcessing(true);
        await updateAllUnrecordedDebts();
        setSuccessMessage('All missing debts updated successfully!');
        loadDebtRecords();
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Update failed');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleUpdatePastDebts = async () => {
    if (!termIds.trim()) {
      setError('Please enter term IDs separated by commas');
      return;
    }
    
    if (window.confirm('Are you sure you want to update debts for the specified terms?')) {
      try {
        setProcessing(true);
        const termIdArray = termIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        await updatePastDebts(termIdArray);
        setSuccessMessage('Past debts updated successfully!');
        setTermIds('');
        loadDebtRecords();
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Update failed');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleReverseStudentDebt = async () => {
    if (!selectedTermId) {
      setError('Please select a term to reverse');
      return;
    }
    
    if (window.confirm('Are you sure you want to reverse student debts for the selected term?')) {
      try {
        setProcessing(true);
        await reverseStudentDebt(parseInt(selectedTermId));
        setSuccessMessage('Student debts reversed successfully!');
        setSelectedTermId('');
        loadDebtRecords();
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Reversal failed');
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2">Loading debt records...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Debt Records Management</h4>
              <div className="d-flex align-items-center">
                <span className="badge bg-info me-2">Allowed Methods: {allowed.join(', ')}</span>
              </div>
            </div>
            <div className="card-body">
              {/* Debug Information Section - COMMENTED OUT */}
              {/* <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">🔍 Debt Records Debug Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <h6>Authentication Status</h6>
                          <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</p>
                          <p><strong>Role:</strong> {user?.role || 'Unknown'}</p>
                          <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
                        </div>
                        <div className="col-md-3">
                          <h6>🧪 API Testing</h6>
                          <button className="btn btn-primary btn-sm me-2 mb-2" onClick={testAPIConnection}>
                            Test API Connection
                          </button>
                          <button className="btn btn-success btn-sm me-2 mb-2" onClick={testUpdateCurrentDebt}>
                            Test Update Current
                          </button>
                          <button className="btn btn-warning btn-sm me-2 mb-2" onClick={testUpdateAllMissingDebts}>
                            Test Update All Missing
                          </button>
                          <button className="btn btn-danger btn-sm mb-2" onClick={testReverseStudentDebt}>
                            Test Reverse Debt
                          </button>
                        </div>
                        <div className="col-md-3">
                          <h6>Data Status</h6>
                          <p><strong>Debt Records Count:</strong> {debtRecords.length}</p>
                          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                          <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
                          <p><strong>Processing:</strong> {processing ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="col-md-3">
                          <h6>Form Status</h6>
                          <p><strong>Term IDs:</strong> {termIds || 'None'}</p>
                          <p><strong>Selected Term:</strong> {selectedTermId || 'None'}</p>
                          <p><strong>Success Message:</strong> {successMessage ? 'Yes' : 'No'}</p>
                          <p><strong>Allowed Methods:</strong> {allowed.join(', ')}</p>
                        </div>
                        <div className="col-md-3">
                          <h6>Quick Actions</h6>
                          <button className="btn btn-secondary btn-sm me-2 mb-2" onClick={loadDebtRecords}>
                            🔄 Reload Data
                          </button>
                          <button className="btn btn-warning btn-sm mb-2" onClick={loadAllowedMethods}>
                            🔄 Reload Methods
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h6>Debug Data (First 2 debt records):</h6>
                        <pre className="bg-light p-2 rounded">{JSON.stringify(debtRecords.slice(0, 2), null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {/* Debt Management Actions */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Debt Management Actions</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6>Update Current Term Debts</h6>
                          <p className="text-muted">Update student debts for the current active term</p>
                          <button
                            className="btn btn-primary"
                            onClick={handleUpdateCurrentDebt}
                            disabled={processing}
                          >
                            {processing ? 'Processing...' : 'Update Current Debts'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6>Update All Missing Debts</h6>
                          <p className="text-muted">Update student debts for all missing terms</p>
                          <button
                            className="btn btn-warning"
                            onClick={handleUpdateAllMissingDebts}
                            disabled={processing}
                          >
                            {processing ? 'Processing...' : 'Update All Missing'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6>Update Past Term Debts</h6>
                          <p className="text-muted">Update student debts for specific past terms</p>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter term IDs (e.g., 1,2,3)"
                              value={termIds}
                              onChange={(e) => setTermIds(e.target.value)}
                            />
                            <button
                              className="btn btn-info"
                              onClick={handleUpdatePastDebts}
                              disabled={processing || !termIds.trim()}
                            >
                              {processing ? 'Processing...' : 'Update Past Debts'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6>Reverse Student Debts</h6>
                          <p className="text-muted">Reverse student debts for a specific term</p>
                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter term ID"
                              value={selectedTermId}
                              onChange={(e) => setSelectedTermId(e.target.value)}
                            />
                            <button
                              className="btn btn-danger"
                              onClick={handleReverseStudentDebt}
                              disabled={processing || !selectedTermId}
                            >
                              {processing ? 'Processing...' : 'Reverse Debts'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debt Records Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Term</th>
                      <th>Amount Added</th>
                      <th>Amount Paid</th>
                      <th>Balance</th>
                      <th>Status</th>
                      <th>Date Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtRecords.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">No debt records found</td>
                      </tr>
                    ) : (
                      debtRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.id}</td>
                          <td>{record.student_name || record.student}</td>
                          <td>{record.term_name || record.term}</td>
                          <td>${record.amount_added}</td>
                          <td>${record.amount_paid}</td>
                          <td>${record.balance}</td>
                          <td>
                            <span className={`badge bg-${record.is_reversed ? 'danger' : 'success'}`}>
                              {record.is_reversed ? 'Reversed' : 'Active'}
                            </span>
                          </td>
                          <td>{record.date_updated}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link to={`/finance/debts/${record.id}`} className="btn btn-sm btn-info">
                                View
                              </Link>
                              {record.is_reversed && (
                                <span className="badge bg-secondary ms-2">Reversed on {record.reversed_on}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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

export default DebtRecords;
