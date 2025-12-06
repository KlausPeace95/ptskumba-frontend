import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getReceiptById,
  updateReceipt,
  patchReceipt,
  deleteReceipt
} from '../../../services/FinanceService';

const ReceiptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowed, setAllowed] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadReceipt();
    loadAllowedMethods();
  }, [id]);

  const loadReceipt = async () => {
    try {
      setLoading(true);
      const data = await getReceiptById(id);
      setReceipt(data);
      setFormData({
        payer: data.payer || '',
        student: data.student || '',
        paid_for: data.paid_for || '',
        amount: data.amount || '',
        paid_through: data.paid_through || 'HATI MALIPO',
        term: data.term || '',
        payment_date: data.payment_date || new Date().toISOString().split('T')[0],
        status: data.status || 'PENDING'
      });
      setError(null);
    } catch (err) {
      console.error(`Error loading receipt ${id}:`, err);
      setError(err?.response?.data?.detail || err.message || 'Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const loadAllowedMethods = async () => {
    try {
      const response = await getReceiptById(id, true);
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
      await updateReceipt(id, formData);
      setSuccessMessage('Receipt updated successfully!');
      setEditing(false);
      loadReceipt();
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        setDeleting(true);
        await deleteReceipt(id);
        navigate('/finance/receipts');
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Delete failed');
        setDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      payer: receipt?.payer || '',
      student: receipt?.student || '',
      paid_for: receipt?.paid_for || '',
      amount: receipt?.amount || '',
      paid_through: receipt?.paid_through || 'HATI MALIPO',
      term: receipt?.term || '',
      payment_date: receipt?.payment_date || new Date().toISOString().split('T')[0],
      status: receipt?.status || 'PENDING'
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
                <p className="mt-2">Loading receipt...</p>
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
                <button className="btn btn-secondary" onClick={() => navigate('/finance/receipts')}>
                  Back to Receipts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-warning" role="alert">
                  Receipt not found
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/finance/receipts')}>
                  Back to Receipts
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
                <h4 className="card-title">Receipt Details</h4>
                <div className="d-flex align-items-center">
                  <span className="badge bg-info me-2">Allowed Methods: {allowed.join(', ')}</span>
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => navigate('/finance/receipts')}
                  >
                    Back to Receipts
                  </button>
                  {allowed.includes('PUT') && (
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => setEditing(!editing)}
                      disabled={saving}
                    >
                      {editing ? 'Cancel Edit' : 'Edit Receipt'}
                    </button>
                  )}
                  {allowed.includes('DELETE') && (
                    <button
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete Receipt'}
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
                        <label className="form-label">Payer</label>
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
                      <div className="form-group mb-3">
                        <label className="form-label">Student ID</label>
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
                      <div className="form-group mb-3">
                        <label className="form-label">Paid For (Receipt Allocation ID)</label>
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
                      <div className="form-group mb-3">
                        <label className="form-label">Term ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.term}
                          onChange={(e) => setFormData({...formData, term: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Payment Date</label>
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
                    <h5>Receipt Information</h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Receipt Number:</strong></td>
                          <td>{receipt.receipt_number}</td>
                        </tr>
                        <tr>
                          <td><strong>Date:</strong></td>
                          <td>{receipt.date}</td>
                        </tr>
                        <tr>
                          <td><strong>Payer:</strong></td>
                          <td>{receipt.payer}</td>
                        </tr>
                        <tr>
                          <td><strong>Student:</strong></td>
                          <td>{receipt.student_details?.full_name || receipt.student}</td>
                        </tr>
                        <tr>
                          <td><strong>Paid For:</strong></td>
                          <td>{receipt.paid_for_details?.name || receipt.paid_for}</td>
                        </tr>
                        <tr>
                          <td><strong>Amount:</strong></td>
                          <td>${receipt.amount}</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Method:</strong></td>
                          <td>{receipt.paid_through}</td>
                        </tr>
                        <tr>
                          <td><strong>Term:</strong></td>
                          <td>{receipt.term_details?.name || receipt.term}</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Date:</strong></td>
                          <td>{receipt.payment_date}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <span className={`badge bg-${receipt.status === 'COMPLETED' ? 'success' : receipt.status === 'PENDING' ? 'warning' : 'danger'}`}>
                              {receipt.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Received By:</strong></td>
                          <td>{receipt.received_by_details?.full_name || receipt.received_by}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h5>Additional Details</h5>
                    <div className="card">
                      <div className="card-body">
                        <p><strong>Student Details:</strong></p>
                        {receipt.student_details && (
                          <ul className="list-unstyled">
                            <li>Admission Number: {receipt.student_details.admission_number}</li>
                            <li>Class Level: {receipt.student_details.class_level?.name}</li>
                            <li>Class Year: {receipt.student_details.class_of_year?.name}</li>
                          </ul>
                        )}
                        <p><strong>Receipt Allocation:</strong></p>
                        {receipt.paid_for_details && (
                          <ul className="list-unstyled">
                            <li>Name: {receipt.paid_for_details.name}</li>
                            <li>Abbreviation: {receipt.paid_for_details.abbr}</li>
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

export default ReceiptDetails;
