import React, { useState, useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

//Import Finance Services - USE REAL ENDPOINTS ONLY
import { ThemeContext } from "../../../context/ThemeContext";
import {
  getReceipts,
  getPayments,
  getPaymentAllocations,
  getReceiptAllocations,
  getDebtRecords
} from '../../../services/FinanceService';
import { useAuthStore } from '../../../store/store';

const FinanceDashboard = () => {
  const { changeBackground } = useContext(ThemeContext);
  
  // Get authentication state
  const { user, token } = useAuthStore();
  
  // Real Finance data from endpoints - NO MOCKUP
  const [receiptsData, setReceiptsData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [debtsData, setDebtsData] = useState([]);
  const [paymentAllocations, setPaymentAllocations] = useState([]);
  const [receiptAllocations, setReceiptAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  if (!token || !user) {
    console.log('❌ FinanceDashboard: No token or user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to finance (admin or accountant)
  if (!user.isAdmin && !user.isAccountant) {
    console.log('❌ FinanceDashboard: User does not have finance access');
    return <Navigate to="/dashboard" replace />;
  }



  // Debug functions
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing Finance API connection...');
      const data = await getReceipts();
      console.log('✅ Finance API connection successful:', data);
      alert('✅ Finance API connection successful!');
    } catch (error) {
      console.error('❌ Finance API connection failed:', error);
      alert('❌ Finance API connection failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testReceiptsAPI = async () => {
    try {
      console.log('🧪 Testing Receipts API...');
      const data = await getReceipts();
      console.log('✅ Receipts API successful:', data);
      alert('✅ Receipts API successful! Check console for details.');
    } catch (error) {
      console.error('❌ Receipts API failed:', error);
      alert('❌ Receipts API failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testPaymentsAPI = async () => {
    try {
      console.log('🧪 Testing Payments API...');
      const data = await getPayments();
      console.log('✅ Payments API successful:', data);
      alert('✅ Payments API successful! Check console for details.');
    } catch (error) {
      console.error('❌ Payments API failed:', error);
      alert('❌ Payments API failed: ' + (error?.response?.data || error?.message));
    }
  };

  const testDebtsAPI = async () => {
    try {
      console.log('🧪 Testing Debts API...');
      const data = await getDebtRecords();
      console.log('✅ Debts API successful:', data);
      alert('✅ Debts API successful! Check console for details.');
    } catch (error) {
      console.error('❌ Debts API failed:', error);
      alert('❌ Debts API failed: ' + (error?.response?.data || error?.message));
    }
  };

  // Load REAL finance data from all endpoints
  const loadRealFinanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading REAL Finance data from endpoints...');
      
      // Call ALL real Finance endpoints
      const [
        receipts,
        payments, 
        debts,
        paymentAllocs,
        receiptAllocs
      ] = await Promise.all([
        getReceipts().catch((e) => { console.debug('Receipts error:', e?.response?.data || e.message); return []; }),
        getPayments().catch((e) => { console.debug('Payments error:', e?.response?.data || e.message); return []; }),
        getDebtRecords().catch((e) => { console.debug('Debts error:', e?.response?.data || e.message); return []; }),
        getPaymentAllocations().catch((e) => { console.debug('Payment Allocations error:', e?.response?.data || e.message); return []; }),
        getReceiptAllocations().catch((e) => { console.debug('Receipt Allocations error:', e?.response?.data || e.message); return []; })
      ]);

      console.log('REAL Finance data loaded:', {
        receipts: receipts?.length || 0,
        payments: payments?.length || 0, 
        debts: debts?.length || 0,
        paymentAllocs: paymentAllocs?.length || 0,
        receiptAllocs: receiptAllocs?.length || 0
      });

      // Set REAL data - NO MOCKUP
      setReceiptsData(Array.isArray(receipts) ? receipts : []);
      setPaymentsData(Array.isArray(payments) ? payments : []);
      setDebtsData(Array.isArray(debts) ? debts : []);
      setPaymentAllocations(Array.isArray(paymentAllocs) ? paymentAllocs : []);
      setReceiptAllocations(Array.isArray(receiptAllocs) ? receiptAllocs : []);

    } catch (err) {
      console.error('Finance dashboard load error:', err?.response?.data || err?.message);
      setError('Failed to load finance data: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const reloadAllData = async () => {
    try {
      console.log('🔄 Reloading all Finance data...');
      setLoading(true);
      await loadRealFinanceData();
      console.log('✅ All Finance data reloaded successfully');
      alert('✅ All Finance data reloaded successfully!');
    } catch (error) {
      console.error('❌ Error reloading Finance data:', error);
      alert('❌ Error reloading Finance data: ' + (error?.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    loadRealFinanceData();
  }, []);

  // Calculate real totals from actual data
  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
  };

  const calculatePendingItems = () => {
    const pendingReceipts = receiptsData.filter(r => r.status === 'PENDING' || r.status === 'pending');
    const pendingPayments = paymentsData.filter(p => p.status === 'PENDING' || p.status === 'pending');
    return pendingReceipts.length + pendingPayments.length;
  };

  // Real Finance cards using actual endpoint data
  const financeCards = [
    {
      title: 'Total Receipts', 
      number: String(receiptsData.length),
      amount: `$${calculateTotalAmount(receiptsData).toLocaleString()}`, 
      change: 'receipt-data bg-success'
    },
    {
      title: 'Total Payments', 
      number: String(paymentsData.length),
      amount: `$${calculateTotalAmount(paymentsData).toLocaleString()}`, 
      change: 'payment-data bg-primary'
    },
    {
      title: 'Pending Items', 
      number: String(calculatePendingItems()),
      amount: `${paymentAllocations.length + receiptAllocations.length} Allocation Types`, 
      change: 'pending-data bg-warning'
    },
    {
      title: 'Outstanding Debts', 
      number: String(debtsData.length),
      amount: `$${calculateTotalAmount(debtsData).toLocaleString()}`, 
      change: 'debt-data bg-danger'
    },
  ];

  // Handle loading and error states
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading Finance Dashboard...</span>
                </div>
                <p className="mt-3">Loading Real Finance Data from Endpoints...</p>
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
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">Finance Data Load Error</h4>
                  <p>{error}</p>
                  <hr />
                  <p className="mb-0">Check console for detailed error information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body pb-xl-4 pb-sm-3 pb-0">	
              <div className="row">
                {financeCards.map((item, ind) => (
                  <div className="col-xl-3 col-6" key={ind}>
                    <div className="content-box">
                      <div className={`icon-box icon-box-xl ${item.change}`}>
                        <i className="material-symbols-outlined">
                          {item.title.includes('Receipt') ? 'receipt' : 
                           item.title.includes('Payment') ? 'payments' :
                           item.title.includes('Pending') ? 'schedule' : 'warning'}
                        </i>
                      </div>
                      <div className="chart-num">
                        <p>{item.title}</p>
                        <h2 className="font-w700 mb-0">{item.number}</h2>
                        <small className="text-muted">{item.amount}</small>
                      </div>
                    </div>
                  </div>
                ))}								
              </div>	
            </div>
          </div>
        </div>
      </div>	

      {/* Debug Information Section - COMMENTED OUT */}
      {/* <div className="row">
        <div className="col-xl-12">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h4 className="heading mb-0">🔍 Finance Debug Information</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <h6>Authentication Status</h6>
                  <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</p>
                  <p><strong>Role:</strong> {user?.role || 'Unknown'}</p>
                  <p><strong>LocalStorage Token:</strong> {token ? 'Present' : 'Missing'}</p>
                </div>
                <div className="col-md-3">
                  <h6>🧪 API Testing</h6>
                  <button className="btn btn-primary btn-sm me-2 mb-2" onClick={testAPIConnection}>
                    Test API Connection
                  </button>
                  <button className="btn btn-success btn-sm me-2 mb-2" onClick={testReceiptsAPI}>
                    Test Receipts API
                  </button>
                  <button className="btn btn-info btn-sm me-2 mb-2" onClick={testPaymentsAPI}>
                    Test Payments API
                  </button>
                  <button className="btn btn-warning btn-sm mb-2" onClick={testDebtsAPI}>
                    Test Debts API
                  </button>
                </div>
                <div className="col-md-3">
                  <h6>Data Status</h6>
                  <p><strong>Receipts:</strong> {receiptsData.length}</p>
                  <p><strong>Payments:</strong> {paymentsData.length}</p>
                  <p><strong>Debts:</strong> {debtsData.length}</p>
                  <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                  <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-md-3">
                  <h6>Allocation Status</h6>
                  <p><strong>Payment Allocations:</strong> {paymentAllocations.length}</p>
                  <p><strong>Receipt Allocations:</strong> {receiptAllocations.length}</p>
                  <p><strong>Total Allocations:</strong> {paymentAllocations.length + receiptAllocations.length}</p>
                  <button className="btn btn-secondary btn-sm mt-2" onClick={reloadAllData}>
                    🔄 Reload All Data
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <h6>Debug Data (First 2 items from each category):</h6>
                <div className="row">
                  <div className="col-md-4">
                    <h6>Receipts:</h6>
                    <pre className="bg-light p-2 rounded small">{JSON.stringify(receiptsData.slice(0, 2), null, 2)}</pre>
                  </div>
                  <div className="col-md-4">
                    <h6>Payments:</h6>
                    <pre className="bg-light p-2 rounded small">{JSON.stringify(paymentsData.slice(0, 2), null, 2)}</pre>
                  </div>
                  <div className="col-md-4">
                    <h6>Debts:</h6>
                    <pre className="bg-light p-2 rounded small">{JSON.stringify(debtsData.slice(0, 2), null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header pb-0 border-0 flex-wrap">
              <div className="mb-2 mb-sm-0">
                <div className="chart-title mb-3">
                  <h2 className="heading">Finance Quick Actions</h2>	
                </div>
              </div>
            </div>
            <div className="card-body pt-2">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/finance-dashboard/receipts" className="btn btn-success btn-block">
                    <i className="material-symbols-outlined me-2">receipt</i>
                    Manage Receipts
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/finance-dashboard/payments" className="btn btn-primary btn-block">
                    <i className="material-symbols-outlined me-2">payments</i>
                    Manage Payments
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/finance-dashboard/debts" className="btn btn-danger btn-block">
                    <i className="material-symbols-outlined me-2">account_balance</i>
                    View Debts
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/finance-dashboard/student-debt-overview" className="btn btn-warning btn-block">
                    <i className="material-symbols-outlined me-2">assessment</i>
                    Debt Overview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header py-3 border-0 px-3">
              <h4 className="heading m-0">Recent Payments</h4>
            </div>
            <div className="card-body">
              {paymentsData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsData.slice(0, 5).map((payment, index) => (
                        <tr key={payment.id || index}>
                          <td>#{payment.id || 'N/A'}</td>
                          <td className="text-success font-w600">${parseFloat(payment.amount || 0).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${payment.status === 'COMPLETED' ? 'badge-success' : 
                              payment.status === 'PENDING' ? 'badge-warning' : 'badge-secondary'}`}>
                              {payment.status || 'Unknown'}
                            </span>
                          </td>
                          <td>{payment.date || payment.created_at || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No payment data available from Finance API</p>
                  <Link to="/finance-dashboard/payments" className="btn btn-primary btn-sm">
                    <i className="material-symbols-outlined me-1">payments</i>
                    Manage Payments
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header border-0 p-3">
              <h4 className="heading mb-0">Recent Receipts</h4>
            </div>
            <div className="card-body">
              {receiptsData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptsData.slice(0, 5).map((receipt, index) => (
                        <tr key={receipt.id || index}>
                          <td>#{receipt.id || 'N/A'}</td>
                          <td className="text-success font-w600">${parseFloat(receipt.amount || 0).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${receipt.status === 'COMPLETED' ? 'badge-success' : 
                              receipt.status === 'PENDING' ? 'badge-warning' : 'badge-secondary'}`}>
                              {receipt.status || 'Unknown'}
                            </span>
                          </td>
                          <td>{receipt.date || receipt.created_at || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No receipt data available from Finance API</p>
                  <Link to="/finance-dashboard/receipts" className="btn btn-success btn-sm">
                    <i className="material-symbols-outlined me-1">receipt</i>
                    Manage Receipts
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header border-0 p-3">
              <h4 className="heading mb-0">Outstanding Debts</h4>
            </div>
            <div className="card-body">
              {debtsData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debtsData.slice(0, 4).map((debt, index) => (
                        <tr key={debt.id || index}>
                          <td>#{debt.id || 'N/A'}</td>
                          <td className="text-danger font-w600">${parseFloat(debt.amount || 0).toLocaleString()}</td>
                          <td>
                            <span className="badge badge-danger">
                              {debt.status || 'Outstanding'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No debt records from Finance API</p>
                  <Link to="/finance-dashboard/debts" className="btn btn-danger btn-sm">
                    <i className="material-symbols-outlined me-1">warning</i>
                    View Debts
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header border-0 p-3">
              <h4 className="heading mb-0">Payment Allocations</h4>
            </div>
            <div className="card-body">
              {paymentAllocations.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentAllocations.slice(0, 4).map((alloc, index) => (
                        <tr key={alloc.id || index}>
                          <td>{alloc.name || alloc.type || 'N/A'}</td>
                          <td><span className="badge badge-primary">{alloc.count || '1'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No payment allocations from API</p>
                  <Link to="/finance-dashboard/payment-allocations" className="btn btn-info btn-sm">
                    <i className="material-symbols-outlined me-1">category</i>
                    View Allocations
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header border-0 p-3">
              <h4 className="heading mb-0">Receipt Allocations</h4>
            </div>
            <div className="card-body">
              {receiptAllocations.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptAllocations.slice(0, 4).map((alloc, index) => (
                        <tr key={alloc.id || index}>
                          <td>{alloc.name || alloc.type || 'N/A'}</td>
                          <td><span className="badge badge-success">{alloc.count || '1'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No receipt allocations from API</p>
                  <Link to="/finance-dashboard/receipt-allocations" className="btn btn-info btn-sm">
                    <i className="material-symbols-outlined me-1">category</i>
                    View Allocations
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceDashboard;
