import axios from 'axios';

// Create a separate axios instance for applications (without /api prefix)
const applicationsApi = axios.create({
    baseURL: 'http://https://ptskumba-backend.onrender.com',
});

// Add auth interceptor for applications API
applicationsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 ApplicationService: Token added to request:', token.substring(0, 20) + '...');
    } else {
        console.warn('⚠️ ApplicationService: No token found in localStorage');
    }
    return config;
});

// Add response interceptor for better error handling
applicationsApi.interceptors.response.use(
    (response) => {
        console.log('✅ ApplicationService: Request successful:', response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ ApplicationService: Request failed:', error.config?.url, error.response?.status, error.response?.data);
        
        // Handle authentication errors
        if (error.response?.status === 401) {
            console.error('🔐 ApplicationService: Authentication failed - token may be expired or invalid');
            // Optionally redirect to login or refresh token
            localStorage.removeItem('access_token');
            localStorage.removeItem('userToken');
        }
        
        return Promise.reject(error);
    }
);

// 1. Academic Program List - GET /applications/programs/
export async function getPrograms(optionsOnly = false) {
    const url = '/applications/programs/';
    console.log('🔍 ApplicationService.getPrograms called with URL:', url);
    console.log('🔍 Using baseURL:', applicationsApi.defaults.baseURL);
    
    if (optionsOnly) {
        try {
            return await applicationsApi.options(url);
        } catch (error) {
            return { headers: { allow: 'GET, HEAD, OPTIONS' } };
        }
    }
    try {
        console.log('🔍 Making GET request to:', applicationsApi.defaults.baseURL + url);
        const response = await applicationsApi.get(url);
        console.log('🔍 Response received:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching programs:', error);
        throw error;
    }
}

// 2. Program Detail - GET /applications/programs/<int:pk>/
export async function getProgramById(programId, optionsOnly = false) {
    const url = `/applications/programs/${programId}/`;
    if (optionsOnly) {
        try {
            return await applicationsApi.options(url);
        } catch (error) {
            return { headers: { allow: 'GET, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await applicationsApi.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching program ${programId}:`, error);
        throw error;
    }
}

// 3. Student Application List/Create - GET/POST /applications/my-applications/
export async function getMyApplications(optionsOnly = false) {
    const url = '/applications/my-applications/';
    if (optionsOnly) {
        try {
            return await applicationsApi.options(url);
        } catch (error) {
            return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await applicationsApi.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching my applications:', error);
        throw error;
    }
}

export async function createMyApplication(payload) {
    try {
        const response = await applicationsApi.post('/applications/my-applications/', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating application:', error);
        throw error;
    }
}

// 4. Application Detail - GET /applications/my-applications/<int:pk>/
export async function getMyApplicationById(applicationId, optionsOnly = false) {
    const url = `/applications/my-applications/${applicationId}/`;
    if (optionsOnly) {
        try {
            return await applicationsApi.options(url);
        } catch (error) {
            return { headers: { allow: 'GET, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await applicationsApi.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching application ${applicationId}:`, error);
        throw error;
    }
}

// 5. Submit Application - POST /applications/my-applications/<int:pk>/submit/
export async function submitMyApplication(applicationId) {
    const url = `/applications/my-applications/${applicationId}/submit/`;
    console.log('🔍 ApplicationService.submitMyApplication called with URL:', url);
    console.log('🔍 Using baseURL:', applicationsApi.defaults.baseURL);
    
    try {
        console.log('🔍 Making POST request to:', applicationsApi.defaults.baseURL + url);
        const response = await applicationsApi.post(url, {});
        console.log('🔍 Submit response received:', response);
        return response.data;
    } catch (error) {
        console.error(`❌ Error submitting application ${applicationId}:`, error);
        throw error;
    }
}

// 6. Application Statistics - GET /applications/statistics/
export async function getApplicationStatistics(optionsOnly = false) {
    const url = '/applications/statistics/';
    if (optionsOnly) {
        try {
            return await applicationsApi.options(url);
        } catch (error) {
            return { headers: { allow: 'GET, OPTIONS' } };
        }
    }
    try {
        const response = await applicationsApi.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
}

// 7. Admin Application List - GET /applications/admin/applications/
export async function getAdminApplications(optionsOnly = false) {
    const url = '/applications/admin/applications/';
    console.log('🔍 getAdminApplications called with URL:', url);
    console.log('🔍 Using baseURL:', applicationsApi.defaults.baseURL);
    
    if (optionsOnly) {
        try {
            return await applicationsApi.options(url);
        } catch (error) {
            return { headers: { allow: 'GET, HEAD, OPTIONS' } };
        }
    }
    try {
        console.log('🔍 Making GET request to:', applicationsApi.defaults.baseURL + url);
        const response = await applicationsApi.get(url);
        console.log('🔍 Admin applications response:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching admin applications:', error);
        throw error;
    }
}

// 8. Update My Application - PATCH /applications/my-applications/<int:pk>/
export async function updateMyApplication(applicationId, payload) {
    try {
        const response = await applicationsApi.patch(`/applications/my-applications/${applicationId}/`, payload);
        return response.data;
    } catch (error) {
        console.error(`Error updating application ${applicationId}:`, error);
        throw error;
    }
}

// 9. Delete My Application - DELETE /applications/my-applications/<int:pk>/
export async function deleteMyApplication(applicationId) {
    try {
        const response = await applicationsApi.delete(`/applications/my-applications/${applicationId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting application ${applicationId}:`, error);
        throw error;
    }
}

// 10. Update Application Status (Admin) - PATCH /applications/admin/applications/<int:pk>/status/
export async function updateApplicationStatus(applicationId, payload) {
    try {
        const response = await applicationsApi.patch(`/applications/admin/applications/${applicationId}/status/`, payload);
        return response.data;
    } catch (error) {
        console.error(`Error updating application status ${applicationId}:`, error);
        throw error;
    }
}

// Helper function to check authentication status
export function checkAuthStatus() {
    const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
    if (!token) {
        console.warn('⚠️ ApplicationService: No authentication token found');
        return false;
    }
    
    try {
        // Basic token validation
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
            console.warn('⚠️ ApplicationService: Token is expired');
            localStorage.removeItem('access_token');
            localStorage.removeItem('userToken');
            return false;
        }
        
        console.log('✅ ApplicationService: Token is valid');
        return true;
    } catch (error) {
        console.error('❌ ApplicationService: Invalid token format:', error);
        return false;
    }
}

// Helper function to get current token
export function getCurrentToken() {
    return localStorage.getItem('access_token') || localStorage.getItem('userToken');
}

export default {
    getPrograms,
    getProgramById,
    getMyApplications,
    createMyApplication,
    getMyApplicationById,
    updateMyApplication,
    deleteMyApplication,
    submitMyApplication,
    getApplicationStatistics,
    getAdminApplications,
    updateApplicationStatus,
    checkAuthStatus,
    getCurrentToken,
};

