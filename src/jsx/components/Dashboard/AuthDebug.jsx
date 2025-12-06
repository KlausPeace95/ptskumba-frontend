import React, { useState, useEffect } from 'react';
import { 
    getAdminApplications, 
    getPrograms 
} from '../../../services/ApplicationService';
import { getUserRole, getProfile } from '../../../services/UsersService';
import { AcademicService } from '../../../services/AcademicService';

const AuthDebug = () => {
    const [authStatus, setAuthStatus] = useState({
        isAuthenticated: false,
        token: null,
        userRole: null,
        lastLogin: null,
        tokenExpiry: null
    });
    const [apiStatus, setApiStatus] = useState({
        applications: 'unknown',
        users: 'unknown',
        academic: 'unknown'
    });
    const [testResults, setTestResults] = useState({});
    const [localStorageData, setLocalStorageData] = useState({});
    const [consoleLogs, setConsoleLogs] = useState([]);

    // Check authentication status
    const checkAuthStatus = () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        
        let tokenExpiry = null;
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                tokenExpiry = new Date(payload.exp * 1000);
            } catch (e) {
                tokenExpiry = 'Invalid token format';
            }
        }
        
        setAuthStatus({
            isAuthenticated: !!token,
            token: token,
            userRole: user ? getUserRole() : null,
            lastLogin: user?.lastLogin || 'Unknown',
            tokenExpiry: tokenExpiry
        });
    };

    // Check localStorage contents
    const checkLocalStorage = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const value = localStorage.getItem(key);
                data[key] = value;
            } catch (e) {
                data[key] = 'Error reading value';
            }
        }
        setLocalStorageData(data);
    };

    // Test API endpoints
    const testAPIEndpoints = async () => {
        setApiStatus({ applications: 'testing', users: 'testing', academic: 'testing' });
        setTestResults({});
        
        // Test Applications API
        try {
            const startTime = Date.now();
            const result = await getAdminApplications();
            const endTime = Date.now();
            
            setApiStatus(prev => ({ ...prev, applications: 'working' }));
            setTestResults(prev => ({
                ...prev,
                applications: {
                    status: 'success',
                    responseTime: endTime - startTime,
                    data: result,
                    timestamp: new Date().toISOString()
                }
            }));
            
            addConsoleLog('Applications API test successful', 'success', result);
        } catch (error) {
            setApiStatus(prev => ({ ...prev, applications: 'failed' }));
            setTestResults(prev => ({
                ...prev,
                applications: {
                    status: 'error',
                    error: error?.response?.data || error.message,
                    timestamp: new Date().toISOString()
                }
            }));
            
            addConsoleLog('Applications API test failed', 'error', error);
        }

        // Test Users API
        try {
            const startTime = Date.now();
            const result = await getProfile();
            const endTime = Date.now();
            
            setApiStatus(prev => ({ ...prev, users: 'working' }));
            setTestResults(prev => ({
                ...prev,
                users: {
                    status: 'success',
                    responseTime: endTime - startTime,
                    data: result,
                    timestamp: new Date().toISOString()
                }
            }));
            
            addConsoleLog('Users API test successful', 'success', result);
        } catch (error) {
            setApiStatus(prev => ({ ...prev, users: 'failed' }));
            setTestResults(prev => ({
                ...prev,
                users: {
                    status: 'error',
                    error: error?.response?.data || error.message,
                    timestamp: new Date().toISOString()
                }
            }));
            
            addConsoleLog('Users API test failed', 'error', error);
        }

        // Test Academic API
        try {
            const startTime = Date.now();
            const result = await AcademicService.getDepartments();
            const endTime = Date.now();
            
            setApiStatus(prev => ({ ...prev, academic: 'working' }));
            setTestResults(prev => ({
                ...prev,
                academic: {
                    status: 'success',
                    responseTime: endTime - startTime,
                    data: result,
                    timestamp: new Date().toISOString()
                }
            }));
            
            addConsoleLog('Academic API test successful', 'success', result);
        } catch (error) {
            setApiStatus(prev => ({ ...prev, academic: 'failed' }));
            setTestResults(prev => ({
                ...prev,
                academic: {
                    status: 'error',
                    error: error?.response?.data || error.message,
                    timestamp: new Date().toISOString()
                }
            }));
            
            addConsoleLog('Academic API test failed', 'error', error);
        }
    };

    // Add console log
    const addConsoleLog = (message, type = 'info', data = null) => {
        const log = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message,
            type,
            data
        };
        setConsoleLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 logs
    };

    // Clear console logs
    const clearConsoleLogs = () => {
        setConsoleLogs([]);
    };

    // Export debug data
    const exportDebugData = () => {
        const debugData = {
            timestamp: new Date().toISOString(),
            authStatus,
            apiStatus,
            testResults,
            localStorageData,
            consoleLogs
        };
        
        const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Test specific endpoint
    const testSpecificEndpoint = async (endpoint, service, method) => {
        try {
            const startTime = Date.now();
            let result;
            
            if (method === 'get') {
                result = await service[method]();
            } else {
                result = await service[method]({ test: true });
            }
            
            const endTime = Date.now();
            
            addConsoleLog(`${endpoint} test successful`, 'success', {
                responseTime: endTime - startTime,
                data: result
            });
            
            return result;
        } catch (error) {
            addConsoleLog(`${endpoint} test failed`, 'error', error);
            throw error;
        }
    };

    useEffect(() => {
        checkAuthStatus();
        checkLocalStorage();
        
        const interval = setInterval(() => {
            checkAuthStatus();
        }, 30000); // Check every 30 seconds
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                            <h4 className="heading mb-0">🔍 Authentication & API Debug Console</h4>
                            <p className="text-muted mb-0">Comprehensive debugging and testing for all endpoints</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Authentication Status */}
            <div className="row">
                <div className="col-xl-6">
                    <div className="card border-info">
                        <div className="card-header bg-info text-white">
                            <h5 className="heading mb-0">🔐 Authentication Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Status:</strong> 
                                        <span className={`badge ${authStatus.isAuthenticated ? 'bg-success' : 'bg-danger'} ms-2`}>
                                            {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                                        </span>
                                    </p>
                                    <p><strong>User Role:</strong> {authStatus.userRole || 'Unknown'}</p>
                                    <p><strong>Token Present:</strong> {authStatus.token ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Last Login:</strong> {authStatus.lastLogin}</p>
                                    <p><strong>Token Expiry:</strong> {authStatus.tokenExpiry}</p>
                                    <p><strong>Token Valid:</strong> 
                                        <span className={`badge ${authStatus.tokenExpiry && authStatus.tokenExpiry > new Date() ? 'bg-success' : 'bg-danger'} ms-2`}>
                                            {authStatus.tokenExpiry && authStatus.tokenExpiry > new Date() ? 'Valid' : 'Expired/Invalid'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-6">
                    <div className="card border-warning">
                        <div className="card-header bg-warning text-white">
                            <h5 className="heading mb-0">🌐 API Endpoints Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <p><strong>Applications:</strong> 
                                        <span className={`badge ${apiStatus.applications === 'working' ? 'bg-success' : apiStatus.applications === 'failed' ? 'bg-danger' : 'bg-warning'} ms-2`}>
                                            {apiStatus.applications}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <p><strong>Users:</strong> 
                                        <span className={`badge ${apiStatus.users === 'working' ? 'bg-success' : apiStatus.users === 'failed' ? 'bg-danger' : 'bg-warning'} ms-2`}>
                                            {apiStatus.users}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <p><strong>Academic:</strong> 
                                        <span className={`badge ${apiStatus.academic === 'working' ? 'bg-success' : apiStatus.academic === 'failed' ? 'bg-danger' : 'bg-warning'} ms-2`}>
                                            {apiStatus.academic}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-primary btn-sm me-2" onClick={testAPIEndpoints}>
                                    <i className="fas fa-sync me-2"></i>Test All APIs
                                </button>
                                <button className="btn btn-success btn-sm" onClick={exportDebugData}>
                                    <i className="fas fa-download me-2"></i>Export Debug Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* API Testing */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card border-success">
                        <div className="card-header bg-success text-white">
                            <h5 className="heading mb-0">🧪 API Testing</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>Applications API</h6>
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => testSpecificEndpoint('getPrograms', ApplicationService, 'getPrograms')}
                                        >
                                            Test Get Programs
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => testSpecificEndpoint('getAdminApplications', ApplicationService, 'getAdminApplications')}
                                        >
                                            Test Get Admin Applications
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h6>Users API</h6>
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => testSpecificEndpoint('getProfile', UsersService, 'getProfile')}
                                        >
                                            Test Get Profile
                                        </button>
                                        <button 
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => testSpecificEndpoint('getAllUsers', UsersService, 'getAllUsers')}
                                        >
                                            Test Get All Users
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h6>Academic API</h6>
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-outline-info btn-sm"
                                            onClick={() => testSpecificEndpoint('getDepartments', AcademicService, 'getDepartments')}
                                        >
                                            Test Get Departments
                                        </button>
                                        <button 
                                            className="btn btn-outline-info btn-sm"
                                            onClick={() => testSpecificEndpoint('getSubjects', AcademicService, 'getSubjects')}
                                        >
                                            Test Get Subjects
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card border-secondary">
                            <div className="card-header bg-secondary text-white">
                                <h5 className="heading mb-0">📊 Test Results</h5>
                            </div>
                            <div className="card-body">
                                {Object.entries(testResults).map(([endpoint, result]) => (
                                    <div key={endpoint} className="mb-3">
                                        <h6>{endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}</h6>
                                        <div className={`alert ${result.status === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                            <strong>Status:</strong> {result.status}
                                            {result.responseTime && <span className="ms-3"><strong>Response Time:</strong> {result.responseTime}ms</span>}
                                            <span className="ms-3"><strong>Timestamp:</strong> {result.timestamp}</span>
                                            {result.error && <div className="mt-2"><strong>Error:</strong> {JSON.stringify(result.error, null, 2)}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Console Logs */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card border-dark">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h5 className="heading mb-0">📝 Console Logs</h5>
                            <button className="btn btn-outline-light btn-sm" onClick={clearConsoleLogs}>
                                <i className="fas fa-trash me-2"></i>Clear Logs
                            </button>
                        </div>
                        <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {consoleLogs.length === 0 ? (
                                <p className="text-muted text-center">No logs yet. Run some tests to see results.</p>
                            ) : (
                                consoleLogs.map((log) => (
                                    <div key={log.id} className={`alert alert-sm ${log.type === 'success' ? 'alert-success' : log.type === 'error' ? 'alert-danger' : 'alert-info'} mb-2`}>
                                        <div className="d-flex justify-content-between">
                                            <span><strong>{log.timestamp}:</strong> {log.message}</span>
                                            <span className="badge bg-secondary">{log.type}</span>
                                        </div>
                                        {log.data && (
                                            <details className="mt-2">
                                                <summary>View Data</summary>
                                                <pre className="mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                                                    {JSON.stringify(log.data, null, 2)}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Local Storage Contents */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card border-warning">
                        <div className="card-header bg-warning text-white">
                            <h5 className="heading mb-0">💾 Local Storage Contents</h5>
                        </div>
                        <div className="card-body">
                            <button className="btn btn-warning btn-sm mb-3" onClick={checkLocalStorage}>
                                <i className="fas fa-sync me-2"></i>Refresh Local Storage
                            </button>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(localStorageData).map(([key, value]) => (
                                            <tr key={key}>
                                                <td><strong>{key}</strong></td>
                                                <td>
                                                    <details>
                                                        <summary>View Value</summary>
                                                        <pre className="mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                                                            {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                                                        </pre>
                                                    </details>
                                                </td>
                                            </tr>
                                        ))}
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

export default AuthDebug;
