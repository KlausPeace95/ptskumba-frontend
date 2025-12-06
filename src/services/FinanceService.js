import { api } from './AxiosInstance';

// ===== RECEIPTS =====
// GET, POST, HEAD, OPTIONS
export const getReceipts = async (optionsOnly = false) => {
  console.debug('[FinanceService] GET /finance/receipts/');
  if (optionsOnly) {
    try {
      const response = await api.options('/finance/receipts/');
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get('/finance/receipts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw error;
  }
};

export const getReceiptById = async (id, optionsOnly = false) => {
  console.debug(`[FinanceService] GET /finance/receipts/${id}/`);
  if (optionsOnly) {
    try {
      const response = await api.options(`/finance/receipts/${id}/`);
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get(`/finance/receipts/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching receipt ${id}:`, error);
    throw error;
  }
};

export const createReceipt = async (data) => {
  console.debug('[FinanceService] POST /finance/receipts/');
  try {
    const response = await api.post('/finance/receipts/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw error;
  }
};

export const updateReceipt = async (id, data) => {
  console.debug(`[FinanceService] PUT /finance/receipts/${id}/`);
  try {
    const response = await api.put(`/finance/receipts/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating receipt ${id}:`, error);
    throw error;
  }
};

export const patchReceipt = async (id, data) => {
  console.debug(`[FinanceService] PATCH /finance/receipts/${id}/`);
  try {
    const response = await api.patch(`/finance/receipts/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching receipt ${id}:`, error);
    throw error;
  }
};

export const deleteReceipt = async (id) => {
  console.debug(`[FinanceService] DELETE /finance/receipts/${id}/`);
  try {
    const response = await api.delete(`/finance/receipts/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting receipt ${id}:`, error);
    throw error;
  }
};

export const getStudentReceipts = async (studentId) => {
  console.debug(`[FinanceService] GET /finance/receipts/student/${studentId}/`);
  try {
    const response = await api.get(`/finance/receipts/student/${studentId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student receipts for ${studentId}:`, error);
    throw error;
  }
};

// ===== PAYMENTS =====
// GET, POST, HEAD, OPTIONS
export const getPayments = async (optionsOnly = false) => {
  console.debug('[FinanceService] GET /finance/payments/');
  if (optionsOnly) {
    try {
      const response = await api.options('/finance/payments/');
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get('/finance/payments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getPaymentById = async (id, optionsOnly = false) => {
  console.debug(`[FinanceService] GET /finance/payments/${id}/`);
  if (optionsOnly) {
    try {
      const response = await api.options(`/finance/payments/${id}/`);
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get(`/finance/payments/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment ${id}:`, error);
    throw error;
  }
};

export const createPayment = async (data) => {
  console.debug('[FinanceService] POST /finance/payments/');
  try {
    const response = await api.post('/finance/payments/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePayment = async (id, data) => {
  console.debug(`[FinanceService] PUT /finance/payments/${id}/`);
  try {
    const response = await api.put(`/finance/payments/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment ${id}:`, error);
    throw error;
  }
};

export const patchPayment = async (id, data) => {
  console.debug(`[FinanceService] PATCH /finance/payments/${id}/`);
  try {
    const response = await api.patch(`/finance/payments/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching payment ${id}:`, error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  console.debug(`[FinanceService] DELETE /finance/payments/${id}/`);
  try {
    const response = await api.delete(`/finance/payments/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting payment ${id}:`, error);
    throw error;
  }
};

// ===== PAYMENT RECORDS =====
// GET, HEAD, OPTIONS
export const getPaymentRecords = async (optionsOnly = false) => {
  console.debug('[FinanceService] GET /finance/payments/record/');
  if (optionsOnly) {
    try {
      const response = await api.options('/finance/payments/record/');
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get('/finance/payments/record/');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment records:', error);
    throw error;
  }
};

export const getPaymentRecordById = async (id) => {
  console.debug(`[FinanceService] GET /finance/payments/record/${id}/`);
  try {
    const response = await api.get(`/finance/payments/record/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment record ${id}:`, error);
    throw error;
  }
};

export const createPaymentRecord = async (data) => {
  console.debug('[FinanceService] POST /finance/payments/record/');
  try {
    const response = await api.post('/finance/payments/record/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment record:', error);
    throw error;
  }
};

export const updatePaymentRecord = async (id, data) => {
  console.debug(`[FinanceService] PUT /finance/payments/record/${id}/`);
  try {
    const response = await api.put(`/finance/payments/record/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment record ${id}:`, error);
    throw error;
  }
};

export const patchPaymentRecord = async (id, data) => {
  console.debug(`[FinanceService] PATCH /finance/payments/record/${id}/`);
  try {
    const response = await api.patch(`/finance/payments/record/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching payment record ${id}:`, error);
    throw error;
  }
};

export const deletePaymentRecord = async (id) => {
  console.debug(`[FinanceService] DELETE /finance/payments/record/${id}/`);
  try {
    const response = await api.delete(`/finance/payments/record/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting payment record ${id}:`, error);
    throw error;
  }
};

// ===== PAYMENT ALLOCATIONS =====
// GET, POST, HEAD, OPTIONS
export const getPaymentAllocations = async (optionsOnly = false) => {
  console.debug('[FinanceService] GET /finance/payment-allocations/');
  if (optionsOnly) {
    try {
      const response = await api.options('/finance/payment-allocations/');
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get('/finance/payment-allocations/');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment allocations:', error);
    throw error;
  }
};

export const getPaymentAllocationById = async (id, optionsOnly = false) => {
  console.debug(`[FinanceService] GET /finance/payment-allocations/${id}/`);
  if (optionsOnly) {
    try {
      const response = await api.options(`/finance/payment-allocations/${id}/`);
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get(`/finance/payment-allocations/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment allocation ${id}:`, error);
    throw error;
  }
};

export const createPaymentAllocation = async (data) => {
  console.debug('[FinanceService] POST /finance/payment-allocations/');
  try {
    const response = await api.post('/finance/payment-allocations/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment allocation:', error);
    throw error;
  }
};

export const updatePaymentAllocation = async (id, data) => {
  console.debug(`[FinanceService] PUT /finance/payment-allocations/${id}/`);
  try {
    const response = await api.put(`/finance/payment-allocations/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment allocation ${id}:`, error);
    throw error;
  }
};

export const patchPaymentAllocation = async (id, data) => {
  console.debug(`[FinanceService] PATCH /finance/payment-allocations/${id}/`);
  try {
    const response = await api.patch(`/finance/payment-allocations/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching payment allocation ${id}:`, error);
    throw error;
  }
};

export const deletePaymentAllocation = async (id) => {
  console.debug(`[FinanceService] DELETE /finance/payment-allocations/${id}/`);
  try {
    const response = await api.delete(`/finance/payment-allocations/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting payment allocation ${id}:`, error);
    throw error;
  }
};

// ===== RECEIPT ALLOCATIONS =====
// GET, POST, HEAD, OPTIONS
export const getReceiptAllocations = async (optionsOnly = false) => {
  console.debug('[FinanceService] GET /finance/receipt-allocations/');
  if (optionsOnly) {
    try {
      const response = await api.options('/finance/receipt-allocations/');
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get('/finance/receipt-allocations/');
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt allocations:', error);
    throw error;
  }
};

export const getReceiptAllocationById = async (id, optionsOnly = false) => {
  console.debug(`[FinanceService] GET /finance/receipt-allocations/${id}/`);
  if (optionsOnly) {
    try {
      const response = await api.options(`/finance/receipt-allocations/${id}/`);
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get(`/finance/receipt-allocations/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching receipt allocation ${id}:`, error);
    throw error;
  }
};

export const createReceiptAllocation = async (data) => {
  console.debug('[FinanceService] POST /finance/receipt-allocations/');
  try {
    const response = await api.post('/finance/receipt-allocations/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating receipt allocation:', error);
    throw error;
  }
};

export const updateReceiptAllocation = async (id, data) => {
  console.debug(`[FinanceService] PUT /finance/receipt-allocations/${id}/`);
  try {
    const response = await api.put(`/finance/receipt-allocations/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating receipt allocation ${id}:`, error);
    throw error;
  }
};

export const patchReceiptAllocation = async (id, data) => {
  console.debug(`[FinanceService] PATCH /finance/receipt-allocations/${id}/`);
  try {
    const response = await api.patch(`/finance/receipt-allocations/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching receipt allocation ${id}:`, error);
    throw error;
  }
};

export const deleteReceiptAllocation = async (id) => {
  console.debug(`[FinanceService] DELETE /finance/receipt-allocations/${id}/`);
  try {
    const response = await api.delete(`/finance/receipt-allocations/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting receipt allocation ${id}:`, error);
    throw error;
  }
};

// ===== DEBT RECORDS =====
// GET, HEAD, OPTIONS
export const getDebtRecords = async (optionsOnly = false) => {
  console.debug('[FinanceService] GET /finance/debts/');
  if (optionsOnly) {
    try {
      const response = await api.options('/finance/debts/');
      return response;
    } catch (error) {
      return { headers: { allow: 'GET, HEAD, OPTIONS' } };
    }
  }
  try {
    const response = await api.get('/finance/debts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching debt records:', error);
    throw error;
  }
};

export const getDebtRecordById = async (id) => {
  console.debug(`[FinanceService] GET /finance/debts/${id}/`);
  try {
    const response = await api.get(`/finance/debts/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching debt record ${id}:`, error);
    throw error;
  }
};

export const createDebtRecord = async (data) => {
  console.debug('[FinanceService] POST /finance/debts/');
  try {
    const response = await api.post('/finance/debts/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating debt record:', error);
    throw error;
  }
};

export const updateDebtRecord = async (id, data) => {
  console.debug(`[FinanceService] PUT /finance/debts/${id}/`);
  try {
    const response = await api.put(`/finance/debts/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating debt record ${id}:`, error);
    throw error;
  }
};

export const patchDebtRecord = async (id, data) => {
  console.debug(`[FinanceService] PATCH /finance/debts/${id}/`);
  try {
    const response = await api.patch(`/finance/debts/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching debt record ${id}:`, error);
    throw error;
  }
};

export const deleteDebtRecord = async (id) => {
  console.debug(`[FinanceService] DELETE /finance/debts/${id}/`);
  try {
    const response = await api.delete(`/finance/debts/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting debt record ${id}:`, error);
    throw error;
  }
};

// ===== DEBT MANAGEMENT OPERATIONS =====
// POST operations for debt management
export const updateStudentDebt = async () => {
  console.debug('[FinanceService] POST /finance/debts/update-current/');
  try {
    const response = await api.post('/finance/debts/update-current/');
    return response.data;
  } catch (error) {
    console.error('Error updating student debt:', error);
    throw error;
  }
};

export const updateAllUnrecordedDebts = async () => {
  console.debug('[FinanceService] POST /finance/debts/update-all-missing/');
  try {
    const response = await api.post('/finance/debts/update-all-missing/');
    return response.data;
  } catch (error) {
    console.error('Error updating all unrecorded debts:', error);
    throw error;
  }
};

export const updatePastDebts = async (termIds) => {
  console.debug('[FinanceService] POST /finance/debts/update-past/');
  try {
    const response = await api.post('/finance/debts/update-past/', { term_ids: termIds });
    return response.data;
  } catch (error) {
    console.error('Error updating past debts:', error);
    throw error;
  }
};

export const reverseStudentDebt = async (termId) => {
  console.debug('[FinanceService] POST /finance/debts/reverse/');
  try {
    const response = await api.post('/finance/debts/reverse/', { term_id: termId });
    return response.data;
  } catch (error) {
    console.error('Error reversing student debt:', error);
    throw error;
  }
};

// ===== STUDENT DEBT OVERVIEW =====
export const getStudentDebtOverview = async (studentId) => {
  console.debug(`[FinanceService] GET /finance/students/${studentId}/debt-overview/`);
  try {
    const response = await api.get(`/finance/students/${studentId}/debt-overview/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student debt overview for ${studentId}:`, error);
    throw error;
  }
};

// ===== BULK OPERATIONS =====
// Receipt Bulk Upload - POST, OPTIONS
export const bulkUploadReceipts = async (formData) => {
  console.debug('[FinanceService] POST /finance/receipts/bulk-upload/');
  try {
    const response = await api.post('/finance/receipts/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk uploading receipts:', error);
    throw error;
  }
};

// Download Receipt Template - GET
export const downloadReceiptTemplate = async () => {
  console.debug('[FinanceService] GET /finance/receipts/template/');
  try {
    const response = await api.get('/finance/receipts/template/', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading receipt template:', error);
    throw error;
  }
};

export default {
  // Receipts
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  patchReceipt,
  deleteReceipt,
  getStudentReceipts,
  
  // Payments
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  patchPayment,
  deletePayment,
  
  // Payment Records
  getPaymentRecords,
  getPaymentRecordById,
  createPaymentRecord,
  updatePaymentRecord,
  patchPaymentRecord,
  deletePaymentRecord,
  
  // Payment Allocations
  getPaymentAllocations,
  getPaymentAllocationById,
  createPaymentAllocation,
  updatePaymentAllocation,
  patchPaymentAllocation,
  deletePaymentAllocation,
  
  // Receipt Allocations
  getReceiptAllocations,
  getReceiptAllocationById,
  createReceiptAllocation,
  updateReceiptAllocation,
  patchReceiptAllocation,
  deleteReceiptAllocation,
  
  // Debt Records
  getDebtRecords,
  getDebtRecordById,
  createDebtRecord,
  updateDebtRecord,
  patchDebtRecord,
  deleteDebtRecord,
  
  // Debt Management
  updateStudentDebt,
  updateAllUnrecordedDebts,
  updatePastDebts,
  reverseStudentDebt,
  
  // Student Debt Overview
  getStudentDebtOverview,
  
  // Bulk Operations
  bulkUploadReceipts,
  downloadReceiptTemplate,
};
