import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPaymentById,
  updatePayment,
  patchPayment,
  deletePayment
} from '../../../services/FinanceService';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowed, setAllowed] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadPayment();
    loadAllowedMethods();
  }, [id]);

  const loadPayment = async () => {
    try {
      setLoading(true);
      const data = await getPaymentById(id);
      setPayment(data);
      setFormData({
        paid_to: data.paid_to || '',
        user: data.user || '',
        paid_for: data.paid_for || '',
        amount: data.amount || '',
        paid_through: data.paid_through || 'CASH',
        status: data.status || 'PENDING'
      });
      setError(null);
    } catch (err) {
      console.error(`Error loading payment ${id}:`, err);
      setError(err?.response?.data?.detail || err.message || 'Failed to load payment');
    } finally {
      setLoading(false);
    }
  };

  const loadAllowedMethods = async () => {
    try {
      const response = await getPaymentById(id, true);
      const allowHeader = response?.headers?.allow || 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS';
      setAllowed(allowHeader.split(', ').map(method => method.trim()));
    } catch (err) {
      setAllowed(['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updatePayment(id, formData);
      setSuccessMessage('Payment updated successfully!');
      setEditing(false);
      loadPayment();
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        setDeleting(true);
        await deletePayment(id);
        navigate('/finance/payments');
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Delete failed');
        setDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      paid_to: payment?.paid_to || '',
      user: payment?.user || '',
      paid_for: payment?.paid_for || '',
      amount: payment?.amount || '',
      paid_through: payment?.paid_through || 'CASH',
      status: payment?.status || 'PENDING'
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
                <p className="mt-2">Loading payment...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/finance/payments')}>
                  Back to Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-warning" role="alert">
                  Payment not found
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/finance/payments')}>
                  Back to Payments
                </button>
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
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title">Payment Details</h4>
                <div className="d-flex align-items-center">
                  <span className="badge bg-info me-2">Allowed Methods: {allowed.join(', ')}</span>
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => navigate('/finance/payments')}
                  >
                    Back to Payments
                  </button>
                  {allowed.includes('PUT') && (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => setEditing(!editing)}
                      disabled={saving}
                    >
                      {editing ? 'Cancel Edit' : 'Edit Payment'}
                    </button>
                  )}
                  {allowed.includes('DELETE') && (
                    <button
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete Payment'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body">
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {editing ? (
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
                        <label className="form-label">User ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.user}
                          onChange={(e) => setFormData({...formData, user: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Payment Allocation ID</label>
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
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Status</label>
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
                    <button type="submit" className="btn btn-primary me-2" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <h5>Payment Information</h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Payment Number:</strong></td>
                          <td>{payment.payment_number}</td>
                        </tr>
                        <tr>
                          <td><strong>Date:</strong></td>
                          <td>{payment.date}</td>
                        </tr>
                        <tr>
                          <td><strong>Paid To:</strong></td>
                          <td>{payment.paid_to}</td>
                        </tr>
                        <tr>
                          <td><strong>User:</strong></td>
                          <td>{payment.user_details?.username || payment.user}</td>
                        </tr>
                        <tr>
                          <td><strong>Paid For:</strong></td>
                          <td>{payment.paid_for_details?.name || payment.paid_for}</td>
                        </tr>
                        <tr>
                          <td><strong>Amount:</strong></td>
                          <td>${payment.amount}</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Method:</strong></td>
                          <td>{payment.paid_through}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <span className={`badge bg-${payment.status === 'COMPLETED' ? 'success' : payment.status === 'PENDING' ? 'warning' : 'danger'}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Paid By:</strong></td>
                          <td>{payment.paid_by_details?.full_name || payment.paid_by}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h5>Additional Details</h5>
                    <div className="card">
                      <div className="card-body">
                        <p><strong>User Details:</strong></p>
                        {payment.user_details && (
                          <ul className="list-unstyled">
                            <li>Username: {payment.user_details.username}</li>
                            <li>Email: {payment.user_details.email}</li>
                            <li>Full Name: {payment.user_details.full_name}</li>
                          </ul>
                        )}
                        <p><strong>Payment Allocation:</strong></p>
                        {payment.paid_for_details && (
                          <ul className="list-unstyled">
                            <li>Name: {payment.paid_for_details.name}</li>
                            <li>Abbreviation: {payment.paid_for_details.abbr}</li>
                          </ul>
                        )}
                        <p><strong>Accountant Details:</strong></p>
                        {payment.paid_by_details && (
                          <ul className="list-unstyled">
                            <li>Full Name: {payment.paid_by_details.full_name}</li>
                            <li>Email: {payment.paid_by_details.email}</li>
                          </ul>
                        )}
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

export default PaymentDetails;
