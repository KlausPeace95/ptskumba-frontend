import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  getPayments,
  createPayment,
  updatePayment,
  patchPayment,
  deletePayment
} from '../../../services/FinanceService';
import { useAuthStore } from '../../../store/store';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowed, setAllowed] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    paid_to: '',
    paid_by_id: '',
    paid_for_id: '',
    amount: '',
    paid_through: 'CASH',
    status: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Get authentication state
  const { user, token } = useAuthStore();

  // Check if user is authenticated
  if (!token || !user) {
    console.log('❌ Payments: No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to finance (admin or accountant)
  if (!user.isAdmin && !user.isAccountant) {
    console.log('❌ Payments: User does not have finance access');
    return <Navigate to="/dashboard" replace />;
  }

  // Debug functions
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing Payments API connection...');
      const data = await getPayments();
      console.log('✅ Payments API connection successful:', data);
      alert('✅ Payments API connection successful!');
    } catch (error) {
      console.error('❌ Payments API connection failed:', error);
      alert('❌ Payments API connection failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testCreatePayment = async () => {
    try {
      console.log('🧪 Testing Payment creation...');
      const testData = {
        paid_to: 'Test Recipient',
        user: '1', // Assuming user ID 1 exists
        paid_for: '1', // Assuming allocation ID 1 exists
        amount: '1000',
        paid_through: 'CASH',
        status: 'PENDING'
      };
      
      const result = await createPayment(testData);
      console.log('✅ Test payment created successfully:', result);
      alert('✅ Test payment created successfully! Check console for details.');
      
      // Reload payments to show the new test payment
      await loadPayments();
    } catch (error) {
      console.error('❌ Test payment creation failed:', error);
      alert('❌ Test payment creation failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testUpdatePayment = async () => {
    try {
      console.log('🧪 Testing Payment update...');
      if (payments.length === 0) {
        alert('❌ No payments available to test update. Create a payment first.');
        return;
      }
      
      const firstPayment = payments[0];
      const updateData = {
        ...firstPayment,
        status: 'COMPLETED'
      };
      
      const result = await updatePayment(firstPayment.id, updateData);
      console.log('✅ Test payment update successful:', result);
      alert('✅ Test payment update successful! Check console for details.');
      
      // Reload payments to show the updated payment
      await loadPayments();
    } catch (error) {
      console.error('❌ Test payment update failed:', error);
      alert('❌ Test payment update failed: ' + (error?.response?.data || error?.message));
    }
  };

  useEffect(() => {
    loadPayments();
    loadAllowedMethods();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading payments:', err);
      const errorDetail = err?.response?.data?.detail;
      let errorMessage = 'Failed to load payments';
      
      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (typeof errorDetail === 'object' && errorDetail !== null) {
        errorMessage = JSON.stringify(errorDetail, null, 2);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadAllowedMethods = async () => {
    try {
      const response = await getPayments(true);
      const allowHeader = response?.headers?.allow || 'GET, POST, HEAD, OPTIONS';
      setAllowed(allowHeader.split(', ').map(method => method.trim()));
    } catch (err) {
      setAllowed(['GET', 'POST', 'HEAD', 'OPTIONS']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload with correct field names and data types
      const payload = {
        paid_to: formData.paid_to,
        paid_for_id: parseInt(formData.paid_for_id),
        amount: formData.amount,
        paid_by_id: parseInt(formData.paid_by_id),
        paid_through: formData.paid_through,
        // Don't send status if it's empty (backend will set default)
        ...(formData.status && { status: formData.status })
      };
      
      if (editingId) {
        await updatePayment(editingId, payload);
        setSuccessMessage('Payment updated successfully!');
      } else {
        await createPayment(payload);
        setSuccessMessage('Payment created successfully!');
      }
      setFormData({
        paid_to: '',
        paid_by_id: '',
        paid_for_id: '',
        amount: '',
        paid_through: 'CASH',
        status: ''
      });
      setEditingId(null);
      setCreating(false);
      loadPayments();
    } catch (err) {
      // Handle error message properly
      const errorDetail = err?.response?.data?.detail;
      let errorMessage = 'Operation failed';
      
      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (typeof errorDetail === 'object' && errorDetail !== null) {
        // Convert object to readable string
        errorMessage = JSON.stringify(errorDetail, null, 2);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment.id);
    setFormData({
      paid_to: payment.paid_to || '',
      paid_by_id: payment.paid_by_id || '',
      paid_for_id: payment.paid_for_id || '',
      amount: payment.amount || '',
      paid_through: payment.paid_through || 'CASH',
      status: payment.status || ''
    });
    setCreating(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        setDeletingId(id);
        await deletePayment(id);
        setSuccessMessage('Payment deleted successfully!');
        loadPayments();
      } catch (err) {
        const errorDetail = err?.response?.data?.detail;
        let errorMessage = 'Delete failed';
        
        if (typeof errorDetail === 'string') {
          errorMessage = errorDetail;
        } else if (typeof errorDetail === 'object' && errorDetail !== null) {
          errorMessage = JSON.stringify(errorDetail, null, 2);
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setCreating(false);
    setFormData({
      paid_to: '',
      paid_by_id: '',
      paid_for_id: '',
      amount: '',
      paid_through: 'CASH',
      status: ''
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
                <p className="mt-2">Loading payments...</p>
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
              <h4 className="heading mb-0">Payments Management</h4>
              <button className="btn btn-primary" onClick={() => setCreating(true)}>
                <i className="fas fa-plus me-2"></i>Add Payment
              </button>
            </div>
            <div className="card-body">
              {/* Debug Information Section - COMMENTED OUT */}
              {/* <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">🔍 Payments Debug Information</h6>
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
                          <button className="btn btn-success btn-sm me-2 mb-2" onClick={testCreatePayment}>
                            Test Create Payment
                          </button>
                          <button className="btn btn-warning btn-sm mb-2" onClick={testUpdatePayment}>
                            Test Update Payment
                          </button>
                        </div>
                        <div className="col-md-3">
                          <h6>Data Status</h6>
                          <p><strong>Payments Count:</strong> {payments.length}</p>
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
                          <button className="btn btn-secondary btn-sm me-2 mb-2" onClick={loadPayments}>
                            🔄 Reload Data
                          </button>
                          <button className="btn btn-warning btn-sm mb-2" onClick={loadAllowedMethods}>
                            🔄 Reload Methods
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h6>Debug Data (First 2 payments):</h6>
                        <pre className="bg-light p-2 rounded">{JSON.stringify(payments.slice(0, 2), null, 2)}</pre>
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
                    <h5>{editingId ? 'Edit Payment' : 'Create New Payment'}</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label">Paid To</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.paid_to}
                              onChange={(e) => setFormData({...formData, paid_to: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label">Paid By (User ID)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.paid_by_id}
                              onChange={(e) => setFormData({...formData, paid_by_id: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label">Paid For (Allocation ID)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.paid_for_id}
                              onChange={(e) => setFormData({...formData, paid_for_id: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label">Amount</label>
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
                          <div className="form-group mb-3">
                            <label className="form-label">Payment Method</label>
                            <select
                              className="form-control"
                              value={formData.paid_through}
                              onChange={(e) => setFormData({...formData, paid_through: e.target.value})}
                            >
                              <option value="CASH">CASH</option>
                              <option value="CRDB">CRDB</option>
                              <option value="NMB">NMB</option>
                              <option value="NBC">NBC</option>
                              <option value="HATI MALIPO">HATI MALIPO</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </div>
                        </div>


                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-primary me-2">
                          {editingId ? 'Update Payment' : 'Create Payment'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Payments Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Payment #</th>
                      <th>Date</th>
                      <th>Paid To</th>
                      <th>User</th>
                      <th>Paid For</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">No payments found</td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.payment_number || payment.id}</td>
                          <td>{payment.date || 'N/A'}</td>
                          <td>{payment.paid_to || 'N/A'}</td>
                          <td>
                            {typeof payment.user_details === 'object' && payment.user_details !== null
                              ? (payment.user_details.username || payment.user_details.email || 'N/A')
                              : (typeof payment.user === 'object' && payment.user !== null
                                  ? (payment.user.username || payment.user.email || 'N/A')
                                  : (payment.user || 'N/A'))}
                          </td>
                          <td>
                            {typeof payment.paid_for_details === 'object' && payment.paid_for_details !== null
                              ? (payment.paid_for_details.name || payment.paid_for_details.abbr || 'N/A')
                              : (typeof payment.paid_for === 'object' && payment.paid_for !== null
                                  ? (payment.paid_for.name || payment.paid_for.abbr || 'N/A')
                                  : (payment.paid_for || 'N/A'))}
                          </td>
                          <td>${payment.amount || '0.00'}</td>
                          <td>
                            <span className={`badge bg-${payment.status === 'COMPLETED' ? 'success' : payment.status === 'PENDING' ? 'warning' : 'danger'}`}>
                              {payment.status || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link to={`/finance/payments/${payment.id}`} className="btn btn-sm btn-info">
                                View
                              </Link>
                              {allowed.includes('PUT') && (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleEdit(payment)}
                                  disabled={deletingId === payment.id}
                                >
                                  Edit
                                </button>
                              )}
                              {allowed.includes('DELETE') && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(payment.id)}
                                  disabled={deletingId === payment.id}
                                >
                                  {deletingId === payment.id ? 'Deleting...' : 'Delete'}
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

export default Payments;
