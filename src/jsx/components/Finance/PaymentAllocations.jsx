import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  getPaymentAllocations,
  createPaymentAllocation,
  updatePaymentAllocation,
  patchPaymentAllocation,
  deletePaymentAllocation
} from '../../../services/FinanceService';
import { useAuthStore } from '../../../store/store';

const PaymentAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowed, setAllowed] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    abbr: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Get authentication state
  const { user, token } = useAuthStore();

  // Check if user is authenticated
  if (!token || !user) {
    console.log('❌ PaymentAllocations: No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to finance (admin or accountant)
  if (!user.isAdmin && !user.isAccountant) {
    console.log('❌ PaymentAllocations: User does not have finance access');
    return <Navigate to="/dashboard" replace />;
  }

  // Debug functions
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing Payment Allocations API connection...');
      const data = await getPaymentAllocations();
      console.log('✅ Payment Allocations API connection successful:', data);
      alert('✅ Payment Allocations API connection successful!');
    } catch (error) {
      console.error('❌ Payment Allocations API connection failed:', error);
      alert('❌ Payment Allocations API connection failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testCreateAllocation = async () => {
    try {
      console.log('🧪 Testing Payment Allocation creation...');
      const testData = {
        name: 'Test Payment Allocation',
        abbr: 'TPA'
      };
      
      const result = await createPaymentAllocation(testData);
      console.log('✅ Test payment allocation created successfully:', result);
      alert('✅ Test payment allocation created successfully! Check console for details.');
      
      // Reload allocations to show the new test allocation
      await loadAllocations();
    } catch (error) {
      console.error('❌ Test payment allocation creation failed:', error);
      alert('❌ Test payment allocation creation failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testUpdateAllocation = async () => {
    try {
      console.log('🧪 Testing Payment Allocation update...');
      if (allocations.length === 0) {
        alert('❌ No allocations available to test update. Create an allocation first.');
        return;
      }
      
      const firstAllocation = allocations[0];
      const updateData = {
        ...firstAllocation,
        name: firstAllocation.name + ' (Updated)'
      };
      
      const result = await updatePaymentAllocation(firstAllocation.id, updateData);
      console.log('✅ Test payment allocation update successful:', result);
      alert('✅ Test payment allocation update successful! Check console for details.');
      
      // Reload allocations to show the updated allocation
      await loadAllocations();
    } catch (error) {
      console.error('❌ Test payment allocation update failed:', error);
      alert('❌ Test payment allocation update failed: ' + (error?.response?.data || error?.message));
    }
  };

  useEffect(() => {
    loadAllocations();
    loadAllowedMethods();
  }, []);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      const data = await getPaymentAllocations();
      setAllocations(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading payment allocations:', err);
      setError(err?.response?.data?.detail || err.message || 'Failed to load payment allocations');
    } finally {
      setLoading(false);
    }
  };

  const loadAllowedMethods = async () => {
    try {
      const response = await getPaymentAllocations(true);
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
        await updatePaymentAllocation(editingId, formData);
        setSuccessMessage('Payment allocation updated successfully!');
      } else {
        await createPaymentAllocation(formData);
        setSuccessMessage('Payment allocation created successfully!');
      }
      setFormData({
        name: '',
        abbr: ''
      });
      setEditingId(null);
      setCreating(false);
      loadAllocations();
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Operation failed');
    }
  };

  const handleEdit = (allocation) => {
    setEditingId(allocation.id);
    setFormData({
      name: allocation.name || '',
      abbr: allocation.abbr || ''
    });
    setCreating(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment allocation?')) {
      try {
        setDeletingId(id);
        await deletePaymentAllocation(id);
        setSuccessMessage('Payment allocation deleted successfully!');
        loadAllocations();
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Delete failed');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setCreating(false);
    setFormData({
      name: '',
      abbr: ''
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
                <p className="mt-2">Loading payment allocations...</p>
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
              <h4 className="card-title">Payment Allocations Management</h4>
              <div className="d-flex align-items-center">
                <span className="badge bg-info me-2">Allowed Methods: {allowed.join(', ')}</span>
                {allowed.includes('POST') && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCreating(true)}
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : 'Create New Payment Allocation'}
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {/* Debug Information Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">🔍 Payment Allocations Debug Information</h6>
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
                          <button className="btn btn-success btn-sm me-2 mb-2" onClick={testCreateAllocation}>
                            Test Create
                          </button>
                          <button className="btn btn-warning btn-sm mb-2" onClick={testUpdateAllocation}>
                            Test Update
                          </button>
                        </div>
                        <div className="col-md-3">
                          <h6>Data Status</h6>
                          <p><strong>Allocations Count:</strong> {allocations.length}</p>
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
                          <button className="btn btn-secondary btn-sm me-2 mb-2" onClick={loadAllocations}>
                            🔄 Reload Data
                          </button>
                          <button className="btn btn-warning btn-sm mb-2" onClick={loadAllowedMethods}>
                            🔄 Reload Methods
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h6>Debug Data (First 2 allocations):</h6>
                        <pre className="bg-light p-2 rounded">{JSON.stringify(allocations.slice(0, 2), null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                    <h5>{editingId ? 'Edit Payment Allocation' : 'Create New Payment Allocation'}</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                              placeholder="e.g., Salary, Utilities, Supplies"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label">Abbreviation</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.abbr}
                              onChange={(e) => setFormData({...formData, abbr: e.target.value})}
                              placeholder="e.g., SAL, UTIL, SUP"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-primary me-2">
                          {editingId ? 'Update Payment Allocation' : 'Create Payment Allocation'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Allocations Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Abbreviation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">No payment allocations found</td>
                      </tr>
                    ) : (
                      allocations.map((allocation) => (
                        <tr key={allocation.id}>
                          <td>{allocation.id}</td>
                          <td>{allocation.name}</td>
                          <td>{allocation.abbr || '-'}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link to={`/finance/payment-allocations/${allocation.id}`} className="btn btn-sm btn-info">
                                View
                              </Link>
                              {allowed.includes('PUT') && (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleEdit(allocation)}
                                  disabled={deletingId === allocation.id}
                                >
                                  Edit
                                </button>
                              )}
                              {allowed.includes('DELETE') && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(allocation.id)}
                                  disabled={deletingId === allocation.id}
                                >
                                  {deletingId === allocation.id ? 'Deleting...' : 'Delete'}
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

export default PaymentAllocations;
