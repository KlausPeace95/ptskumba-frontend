import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  getReceipts,
  createReceipt,
  updateReceipt,
  patchReceipt,
  deleteReceipt
} from '../../../services/FinanceService';
import { useAuthStore } from '../../../store/store';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowed, setAllowed] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    payer: '',
    student: '',
    paid_for: '',
    amount: '',
    paid_through: 'HATI MALIPO',
    term: '',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'PENDING'
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Normalize backend error shapes to a safe string
  const toErrorMessage = (err) => {
    const detail = err?.response?.data?.detail ?? err?.response?.data;
    if (typeof detail === 'string') return detail;
    if (detail && typeof detail === 'object') return JSON.stringify(detail, null, 2);
    return err?.message || 'Request failed';
  };

  // Get authentication state
  const { user, token } = useAuthStore();

  // Check if user is authenticated
  if (!token || !user) {
    console.log('❌ Receipts: No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to finance (admin or accountant)
  if (!user.isAdmin && !user.isAccountant) {
    console.log('❌ Receipts: User does not have finance access');
    return <Navigate to="/dashboard" replace />;
  }

  // Debug functions
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing Receipts API connection...');
      const data = await getReceipts();
      console.log('✅ Receipts API connection successful:', data);
      alert('✅ Receipts API connection successful!');
    } catch (error) {
      console.error('❌ Receipts API connection failed:', error);
      alert('❌ Receipts API connection failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testCreateReceipt = async () => {
    try {
      console.log('🧪 Testing Receipt creation...');
      const testData = {
        payer: 'Test Payer',
        student: '1', // Assuming student ID 1 exists
        paid_for: '1', // Assuming allocation ID 1 exists
        amount: '1000',
        paid_through: 'HATI MALIPO',
        term: '1', // Assuming term ID 1 exists
        payment_date: new Date().toISOString().split('T')[0],
        status: 'PENDING'
      };
      
      const result = await createReceipt(testData);
      console.log('✅ Test receipt created successfully:', result);
      alert('✅ Test receipt created successfully! Check console for details.');
      
      // Reload receipts to show the new test receipt
      await loadReceipts();
    } catch (error) {
      console.error('❌ Test receipt creation failed:', error);
      alert('❌ Test receipt creation failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testBulkUpload = async () => {
    try {
      console.log('🧪 Testing Receipt bulk upload...');
      alert('🧪 Bulk upload testing requires a file. Please use the actual bulk upload feature.');
    } catch (error) {
      console.error('❌ Bulk upload test failed:', error);
      alert('❌ Bulk upload test failed: ' + (error?.response?.data || error?.message));
    }
  };

  useEffect(() => {
    loadReceipts();
    loadAllowedMethods();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const data = await getReceipts();
      setReceipts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading receipts:', err);
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadAllowedMethods = async () => {
    try {
      const response = await getReceipts(true);
      const allowHeader = response?.headers?.allow || 'GET, POST, HEAD, OPTIONS';
      setAllowed(allowHeader.split(', ').map(method => method.trim()));
    } catch (err) {
      setAllowed(['GET', 'POST', 'HEAD', 'OPTIONS']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateReceipt(editingId, formData);
        setSuccessMessage('Receipt updated successfully!');
      } else {
        await createReceipt(formData);
        setSuccessMessage('Receipt created successfully!');
      }
      setFormData({
        payer: '',
        student: '',
        paid_for: '',
        amount: '',
        paid_through: 'HATI MALIPO',
        term: '',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'PENDING'
      });
      setEditingId(null);
      setCreating(false);
      loadReceipts();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const handleEdit = (receipt) => {
    setEditingId(receipt.id);
    setFormData({
      payer: receipt.payer || '',
      student: receipt.student || '',
      paid_for: receipt.paid_for || '',
      amount: receipt.amount || '',
      paid_through: receipt.paid_through || 'HATI MALIPO',
      term: receipt.term || '',
      payment_date: receipt.payment_date || new Date().toISOString().split('T')[0],
      status: receipt.status || 'PENDING'
    });
    setCreating(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        setDeletingId(id);
        await deleteReceipt(id);
        setSuccessMessage('Receipt deleted successfully!');
        loadReceipts();
      } catch (err) {
        setError(toErrorMessage(err));
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setCreating(false);
    setFormData({
      payer: '',
      student: '',
      paid_for: '',
      amount: '',
      paid_through: 'HATI MALIPO',
      term: '',
      payment_date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    });
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
                <p className="mt-2">Loading receipts...</p>
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
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="heading mb-0">Receipts Management</h4>
              <div>
                <button className="btn btn-success me-2" onClick={() => setCreating(true)}>
                  <i className="fas fa-plus me-2"></i>Add Receipt
                </button>
                <Link to="/finance/receipts/bulk-upload" className="btn btn-info">
                  <i className="fas fa-upload me-2"></i>Bulk Upload
                </Link>
              </div>
            </div>
            <div className="card-body">
              {/* Debug Information Section - COMMENTED OUT */}
              {/* <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">🔍 Receipts Debug Information</h6>
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
                          <button className="btn btn-success btn-sm me-2 mb-2" onClick={testCreateReceipt}>
                            Test Create Receipt
                          </button>
                          <button className="btn btn-info btn-sm mb-2" onClick={testBulkUpload}>
                            Test Bulk Upload
                          </button>
                        </div>
                        <div className="col-md-3">
                          <h6>Data Status</h6>
                          <p><strong>Receipts Count:</strong> {receipts.length}</p>
                          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                          <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
                          <p><strong>Creating:</strong> {creating ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="col-md-3">
                          <h6>Form Status</h6>
                          <p><strong>Editing ID:</strong> {editingId || 'None'}</p>
                          <p><strong>Deleting ID:</strong> {deletingId || 'None'}</p>
                          <p><strong>Success Message:</strong> {successMessage ? 'Yes' : 'No'}</p>
                          <p><strong>Allowed Methods:</strong> {allowed.join(', ')}</p>
                        </div>
                        <div className="col-md-3">
                          <h6>Quick Actions</h6>
                          <button className="btn btn-secondary btn-sm me-2 mb-2" onClick={loadReceipts}>
                            🔄 Reload Data
                          </button>
                          <button className="btn btn-warning btn-sm mb-2" onClick={loadAllowedMethods}>
                            🔄 Reload Methods
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h6>Debug Data (First 2 receipts):</h6>
                        <pre className="bg-light p-2 rounded">{JSON.stringify(receipts.slice(0, 2), null, 2)}</pre>
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

              {/* Create/Edit Form */}
              {creating && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h5>{editingId ? 'Edit Receipt' : 'Create New Receipt'}</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Payer</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.payer}
                              onChange={(e) => setFormData({...formData, payer: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Student ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.student}
                              onChange={(e) => setFormData({...formData, student: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Paid For (Receipt Allocation ID)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.paid_for}
                              onChange={(e) => setFormData({...formData, paid_for: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={formData.amount}
                              onChange={(e) => setFormData({...formData, amount: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Payment Method</label>
                            <select
                              className="form-control"
                              value={formData.paid_through}
                              onChange={(e) => setFormData({...formData, paid_through: e.target.value})}
                            >
                              <option value="HATI MALIPO">HATI MALIPO</option>
                              <option value="CRDB">CRDB</option>
                              <option value="NMB">NMB</option>
                              <option value="NBC">NBC</option>
                              <option value="CASH">CASH</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Term ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.term}
                              onChange={(e) => setFormData({...formData, term: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Payment Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={formData.payment_date}
                              onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Status</label>
                            <select
                              className="form-control"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-primary me-2">
                          {editingId ? 'Update Receipt' : 'Create Receipt'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Receipts Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Receipt #</th>
                      <th>Date</th>
                      <th>Payer</th>
                      <th>Student</th>
                      <th>Paid For</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">No receipts found</td>
                      </tr>
                    ) : (
                      receipts.map((receipt) => (
                        <tr key={receipt.id}>
                          <td>{receipt.receipt_number}</td>
                          <td>{receipt.date}</td>
                          <td>{receipt.payer}</td>
                          <td>{receipt.student_details?.full_name || receipt.student}</td>
                          <td>{receipt.paid_for_details?.name || receipt.paid_for}</td>
                          <td>${receipt.amount}</td>
                          <td>
                            <span className={`badge bg-${receipt.status === 'COMPLETED' ? 'success' : receipt.status === 'PENDING' ? 'warning' : 'danger'}`}>
                              {receipt.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link to={`/finance/receipts/${receipt.id}`} className="btn btn-sm btn-info">
                                View
                              </Link>
                              {allowed.includes('PUT') && (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleEdit(receipt)}
                                  disabled={deletingId === receipt.id}
                                >
                                  Edit
                                </button>
                              )}
                              {allowed.includes('DELETE') && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(receipt.id)}
                                  disabled={deletingId === receipt.id}
                                >
                                  {deletingId === receipt.id ? 'Deleting...' : 'Delete'}
                                </button>
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

export default Receipts;
