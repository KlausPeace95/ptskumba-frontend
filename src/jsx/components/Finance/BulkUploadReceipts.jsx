import React, { useState } from 'react';
import {
  bulkUploadReceipts,
  downloadReceiptTemplate
} from '../../../services/FinanceService';

const BulkUploadReceipts = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
        'application/csv'
      ];
      
      if (allowedTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls') || 
          selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccessMessage('');
      setUploadResult(null);

      const formData = new FormData();
      formData.append('file', file);

      const result = await bulkUploadReceipts(formData);
      setUploadResult(result);
      setSuccessMessage('File uploaded successfully!');
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err?.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setDownloading(true);
      setError(null);
      
      const blob = await downloadReceiptTemplate();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'receipt_upload_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage('Template downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      setError(err?.response?.data?.detail || err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Bulk Upload Receipts</h4>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-success"
                  onClick={handleDownloadTemplate}
                  disabled={downloading}
                >
                  {downloading ? 'Downloading...' : 'Download Template'}
                </button>
              </div>
            </div>
            <div className="card-body">
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

              {/* Upload Instructions */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Upload Instructions</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Required Columns:</h6>
                      <ul>
                        <li><strong>payer</strong> - Who is paying (optional, defaults to student's parent)</li>
                        <li><strong>first_name</strong> - Student's first name (required)</li>
                        <li><strong>middle_name</strong> - Student's middle name (optional)</li>
                        <li><strong>last_name</strong> - Student's last name (required)</li>
                        <li><strong>paid_for</strong> - Receipt allocation name (e.g., "Tuition Fee")</li>
                        <li><strong>paid_through</strong> - Payment method (e.g., "HATI MALIPO", "BANK")</li>
                        <li><strong>payment_date</strong> - Date of payment (YYYY-MM-DD format)</li>
                        <li><strong>term</strong> - Term in format "Term 1-2024"</li>
                        <li><strong>amount</strong> - Payment amount (numeric)</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>File Requirements:</h6>
                      <ul>
                        <li>Excel (.xlsx, .xls) or CSV format</li>
                        <li>First row should contain column headers</li>
                        <li>Data should start from row 2</li>
                        <li>Dates should be in YYYY-MM-DD format</li>
                        <li>Amounts should be numeric values</li>
                      </ul>
                      <h6>Example Data:</h6>
                      <div className="bg-light p-2 rounded">
                        <small>
                          payer, first_name, middle_name, last_name, paid_for, paid_through, payment_date, term, amount<br/>
                          "Zainab Mwinami", "Zainab", "Ali", "Mwinami", "Tuition Fee", "HATI MALIPO", "2025-07-07", "Term 1-2024", 150000
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Form */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Upload File</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpload}>
                    <div className="mb-3">
                      <label htmlFor="file" className="form-label">Select File</label>
                      <input
                        type="file"
                        className="form-control"
                        id="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        required
                      />
                      <div className="form-text">
                        Supported formats: Excel (.xlsx, .xls) or CSV (.csv)
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!file || uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Receipts'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Upload Results */}
              {uploadResult && (
                <div className="card">
                  <div className="card-header">
                    <h5>Upload Results</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-success">{uploadResult.message}</h4>
                        </div>
                      </div>
                      <div className="col-md-9">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="card bg-success text-white">
                              <div className="card-body text-center">
                                <h5>Created</h5>
                                <h3>{uploadResult.created?.length || 0}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="card bg-warning text-dark">
                              <div className="card-body text-center">
                                <h5>Skipped</h5>
                                <h3>{uploadResult.skipped?.length || 0}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="card bg-danger text-white">
                              <div className="card-body text-center">
                                <h5>Failed</h5>
                                <h3>{uploadResult.not_created?.length || 0}</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    {uploadResult.not_created && uploadResult.not_created.length > 0 && (
                      <div className="mt-3">
                        <h6>Failed Records:</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>Row</th>
                                <th>Data</th>
                                <th>Error</th>
                              </tr>
                            </thead>
                            <tbody>
                              {uploadResult.not_created.map((record, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <small>
                                      {Object.entries(record)
                                        .filter(([key]) => key !== 'error')
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')}
                                    </small>
                                  </td>
                                  <td className="text-danger">
                                    <small>{record.error}</small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {uploadResult.skipped && uploadResult.skipped.length > 0 && (
                      <div className="mt-3">
                        <h6>Skipped Records (Duplicates):</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>Receipt #</th>
                                <th>Payer</th>
                                <th>Reason</th>
                              </tr>
                            </thead>
                            <tbody>
                              {uploadResult.skipped.map((record, index) => (
                                <tr key={index}>
                                  <td>{record.receipt_number}</td>
                                  <td>{record.payer}</td>
                                  <td className="text-warning">
                                    <small>{record.reason}</small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
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

export default BulkUploadReceipts;
