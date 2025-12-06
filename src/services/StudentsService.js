import axios from 'axios';

const API_BASE_URL = 'http://https://ptskumba-backend.onrender.com';

// Create axios instance for students API
const studentsApi = axios.create({
  baseURL: `${API_BASE_URL}/api/sis/students/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token
studentsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const StudentsService = {
  // Get all students with filtering
  getStudents: async (filters = {}) => {
    try {
      console.log('🔍 Fetching students with filters:', filters);
      const response = await studentsApi.get('', { params: filters });
      console.log('✅ Students fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      throw error;
    }
  },

  // Get single student by ID
  getStudent: async (id) => {
    try {
      console.log('🔍 Fetching student with ID:', id);
      const response = await studentsApi.get(`${id}/`);
      console.log('✅ Student fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching student:', error);
      throw error;
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      console.log('🔍 Creating student with data:', studentData);
      const response = await studentsApi.post('', studentData);
      console.log('✅ Student created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating student:', error);
      throw error;
    }
  },

  // Update existing student
  updateStudent: async (id, studentData) => {
    try {
      console.log('🔍 Updating student with ID:', id, 'data:', studentData);
      const response = await studentsApi.put(`${id}/`, studentData);
      console.log('✅ Student updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating student:', error);
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      console.log('🔍 Deleting student with ID:', id);
      const response = await studentsApi.delete(`${id}/`);
      console.log('✅ Student deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting student:', error);
      throw error;
    }
  },

  // Bulk upload students from Excel file
  bulkUploadStudents: async (file) => {
    try {
      console.log('🔍 Bulk uploading students from file:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await studentsApi.post('bulk-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Bulk upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error in bulk upload:', error);
      throw error;
    }
  },

  // Get class levels for dropdowns
  getClassLevels: async () => {
    try {
      console.log('🔍 Fetching class levels');
      const response = await axios.get(`${API_BASE_URL}/api/sis/class-levels/`);
      console.log('✅ Class levels fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching class levels:', error);
      throw error;
    }
  },

  // Get class years for dropdowns
  getClassYears: async () => {
    try {
      console.log('🔍 Fetching class years');
      const response = await axios.get(`${API_BASE_URL}/api/sis/class-years/`);
      console.log('✅ Class years fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching class years:', error);
      throw error;
    }
  },

  // Get students count for dashboard
  getStudentsCount: async () => {
    try {
      console.log('🔍 Fetching students count');
      const response = await studentsApi.get('', { params: { page_size: 1 } });
      console.log('✅ Students count fetched successfully:', response.data.count);
      return response.data.count || 0;
    } catch (error) {
      console.error('❌ Error fetching students count:', error);
      return 0;
    }
  },

  // Get students for unpaid fees table (with pagination)
  getStudentsForFeesTable: async (page = 1, pageSize = 10) => {
    try {
      console.log('🔍 Fetching students for fees table, page:', page);
      const response = await studentsApi.get('', { 
        params: { 
          page: page,
          page_size: pageSize
        } 
      });
      console.log('✅ Students for fees table fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching students for fees table:', error);
      throw error;
    }
  },
};

export default StudentsService;
