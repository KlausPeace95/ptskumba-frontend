import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://https://ptskumba-backend.onrender.com/api';

// Create axios instance with auth interceptor
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Check if user is already authenticated
export function isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
}

// Get stored token
export function getStoredToken() {
    return localStorage.getItem('access_token');
}

// Login user
export async function loginUser(email, password) {
    const response = await axios.post(`${API_BASE_URL}/users/login/`, { email, password });
    // Store token for future requests
    localStorage.setItem('access_token', response.data.access);
    return response;
}

// Get user profile
export async function getUserProfile() {
    return apiClient.get('/users/profile/');
}

// Get all users
export async function getAllUsers() {
    return apiClient.get('/users/users/');
}

// Get accountants
export async function getAccountants() {
    return apiClient.get('/users/accountants/');
}

// Get teachers
export async function getTeachers() {
    return apiClient.get('/users/teachers/');
}

// Get parents
export async function getParents() {
    return apiClient.get('/users/parents/');
}

// Logout (clear token)
export function logout() {
    localStorage.removeItem('access_token');
}
