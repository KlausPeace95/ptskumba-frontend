// UsersService.js - Service to handle all users-related API calls

const BASE_URL = 'http://ptskumba-backend.onrender.com/api/users';

class UsersService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders(token = null) {
    const userToken = token || localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(userToken && { 'Authorization': `Bearer ${userToken}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Authentication
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email, password })
      });
      
      const data = await this.handleResponse(response);
      
      // Store tokens and user data
      if (data.access) {
        localStorage.setItem('userToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userData', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(userData) {
    try {
      const response = await fetch(`${this.baseURL}/signup/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      const data = await this.handleResponse(response);
      
      // Store tokens and user data after successful signup
      if (data.user && data.user.token) {
        localStorage.setItem('userToken', data.user.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }

  // Profile Management
  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/profile/`, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Users Management
  async getAllUsers(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${this.baseURL}/users/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${this.baseURL}/users/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUserDetails(userId) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/`, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get user details error:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      return response.status === 204;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Teachers Management
  async getAllTeachers(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${this.baseURL}/teachers/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get teachers error:', error);
      throw error;
    }
  }

  async createTeacher(teacherData) {
    try {
      const response = await fetch(`${this.baseURL}/teachers/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(teacherData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create teacher error:', error);
      throw error;
    }
  }

  async getTeacherDetails(teacherId) {
    try {
      const response = await fetch(`${this.baseURL}/teachers/${teacherId}/`, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get teacher details error:', error);
      throw error;
    }
  }

  async updateTeacher(teacherId, teacherData) {
    try {
      const response = await fetch(`${this.baseURL}/teachers/${teacherId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(teacherData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update teacher error:', error);
      throw error;
    }
  }

  async deleteTeacher(teacherId) {
    try {
      const response = await fetch(`${this.baseURL}/teachers/${teacherId}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      return response.status === 204;
    } catch (error) {
      console.error('Delete teacher error:', error);
      throw error;
    }
  }

  async bulkUploadTeachers(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseURL}/teachers/bulk-upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: formData
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Bulk upload teachers error:', error);
      throw error;
    }
  }

  // Accountants Management
  async getAllAccountants() {
    try {
      const response = await fetch(`${this.baseURL}/accountants/`, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get accountants error:', error);
      throw error;
    }
  }

  async createAccountant(accountantData) {
    try {
      const response = await fetch(`${this.baseURL}/accountants/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(accountantData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create accountant error:', error);
      throw error;
    }
  }

  async getAccountantDetails(accountantId) {
    try {
      const response = await fetch(`${this.baseURL}/accountants/${accountantId}/`, {
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get accountant details error:', error);
      throw error;
    }
  }

  async updateAccountant(accountantId, accountantData) {
    try {
      const response = await fetch(`${this.baseURL}/accountants/${accountantId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(accountantData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update accountant error:', error);
      throw error;
    }
  }

  async deleteAccountant(accountantId) {
    try {
      const response = await fetch(`${this.baseURL}/accountants/${accountantId}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      return response.status === 204;
    } catch (error) {
      console.error('Delete accountant error:', error);
      throw error;
    }
  }

  // Role Management Helpers
  async assignUserRole(userId, roleData) {
    // This would call the update user endpoint to assign roles
    return await this.updateUser(userId, roleData);
  }

  // Utility Methods
  isTokenValid() {
    const token = localStorage.getItem('userToken');
    if (!token) return false;
    
    try {
      // Basic token validation - you can enhance this
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  getUserRole() {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    if (user.isAdmin) return 'admin';
    if (user.isTeacher) return 'teacher';
    if (user.isAccountant) return 'accountant';
    if (user.isStudent) return 'student';
    
    return 'user'; // Default custom user
  }
}

// Export singleton instance
export default new UsersService();

// Named exports for individual methods if needed
export const {
  login,
  signup,
  logout,
  getProfile,
  getAllUsers,
  createUser,
  getUserDetails,
  updateUser,
  deleteUser,
  getAllTeachers,
  createTeacher,
  getTeacherDetails,
  updateTeacher,
  deleteTeacher,
  bulkUploadTeachers,
  getAllAccountants,
  createAccountant,
  getAccountantDetails,
  updateAccountant,
  deleteAccountant,
  isTokenValid,
  getCurrentUser
} = new UsersService();

// Standalone getUserRole function that doesn't depend on 'this'
export const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    if (!user) return null;
    
    if (user.isAdmin) return 'admin';
    if (user.isTeacher) return 'teacher';
    if (user.isAccountant) return 'accountant';
    if (user.isStudent) return 'student';
    
    return 'user'; // Default custom user
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};
