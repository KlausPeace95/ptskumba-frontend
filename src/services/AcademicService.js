import axios from 'axios';

const API_BASE_URL = 'http://https://ptskumba-backend.onrender.com';

// Create axios instance for academic API
const academicApi = axios.create({
  baseURL: `${API_BASE_URL}/api/academic/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token
academicApi.interceptors.request.use(
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

export const AcademicService = {
  // ===== DEPARTMENTS =====
  
  // Get all departments
  getDepartments: async () => {
    try {
      console.log('🔍 Fetching departments');
      console.log('🔑 Token being sent:', localStorage.getItem('userToken'));
      console.log('🌐 API URL:', `${API_BASE_URL}/api/academic/departments/`);
      const response = await academicApi.get('departments/');
      console.log('✅ Departments fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching departments:', error);
      console.error('❌ Error config:', error.config);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
    throw error;
  }
  },

  // Get single department by ID
  getDepartmentById: async (id) => {
  try {
      console.log('🔍 Fetching department with ID:', id);
      const response = await academicApi.get(`departments/${id}/`);
      console.log('✅ Department fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching department:', error);
    throw error;
  }
  },

  // Create new department
  createDepartment: async (departmentData) => {
  try {
      console.log('🔍 Creating department with data:', departmentData);
      const response = await academicApi.post('departments/', departmentData);
      console.log('✅ Department created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating department:', error);
    throw error;
  }
  },

  // Update existing department
  updateDepartment: async (id, departmentData) => {
  try {
      console.log('🔍 Updating department with ID:', id, 'data:', departmentData);
      const response = await academicApi.put(`departments/${id}/`, departmentData);
      console.log('✅ Department updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating department:', error);
    throw error;
  }
  },

  // Delete department
  deleteDepartment: async (id) => {
    try {
      console.log('🔍 Deleting department with ID:', id);
      const response = await academicApi.delete(`departments/${id}/`);
      console.log('✅ Department deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting department:', error);
    throw error;
  }
  },

// ===== CLASS LEVELS =====
  
  // Get all class levels
  getClassLevels: async () => {
    try {
      console.log('🔍 Fetching class levels');
      const response = await academicApi.get('class-levels/');
      console.log('✅ Class levels fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching class levels:', error);
    throw error;
  }
  },

  // Get single class level by ID
  getClassLevelById: async (id) => {
  try {
      console.log('🔍 Fetching class level with ID:', id);
      const response = await academicApi.get(`class-levels/${id}/`);
      console.log('✅ Class level fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching class level:', error);
    throw error;
  }
  },

  // Create new class level
  createClassLevel: async (classLevelData) => {
  try {
      console.log('🔍 Creating class level with data:', classLevelData);
      const response = await academicApi.post('class-levels/', classLevelData);
      console.log('✅ Class level created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating class level:', error);
    throw error;
  }
  },

  // Update existing class level
  updateClassLevel: async (id, classLevelData) => {
  try {
      console.log('🔍 Updating class level with ID:', id, 'data:', classLevelData);
      const response = await academicApi.put(`class-levels/${id}/`, classLevelData);
      console.log('✅ Class level updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating class level:', error);
    throw error;
  }
  },

  // Delete class level
  deleteClassLevel: async (id) => {
  try {
      console.log('🔍 Deleting class level with ID:', id);
      const response = await academicApi.delete(`class-levels/${id}/`);
      console.log('✅ Class level deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting class level:', error);
    throw error;
  }
  },

// ===== GRADE LEVELS =====
  
  // Get all grade levels
  getGradeLevels: async () => {
    try {
      console.log('🔍 Fetching grade levels');
      const response = await academicApi.get('grade-levels/');
      console.log('✅ Grade levels fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching grade levels:', error);
    throw error;
  }
  },

  // Get single grade level by ID
  getGradeLevelById: async (id) => {
  try {
      console.log('🔍 Fetching grade level with ID:', id);
      const response = await academicApi.get(`grade-levels/${id}/`);
      console.log('✅ Grade level fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching grade level:', error);
    throw error;
  }
  },

  // Create new grade level
  createGradeLevel: async (gradeLevelData) => {
  try {
      console.log('🔍 Creating grade level with data:', gradeLevelData);
      const response = await academicApi.post('grade-levels/', gradeLevelData);
      console.log('✅ Grade level created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating grade level:', error);
    throw error;
  }
  },

  // Update existing grade level
  updateGradeLevel: async (id, gradeLevelData) => {
  try {
      console.log('🔍 Updating grade level with ID:', id, 'data:', gradeLevelData);
      const response = await academicApi.put(`grade-levels/${id}/`, gradeLevelData);
      console.log('✅ Grade level updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating grade level:', error);
    throw error;
  }
  },

  // Delete grade level
  deleteGradeLevel: async (id) => {
  try {
      console.log('🔍 Deleting grade level with ID:', id);
      const response = await academicApi.delete(`grade-levels/${id}/`);
      console.log('✅ Grade level deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting grade level:', error);
    throw error;
  }
  },

// ===== CLASS YEARS =====
  
  // Get all class years
  getClassYears: async () => {
    try {
      console.log('🔍 Fetching class years');
      const response = await academicApi.get('class-years/');
      console.log('✅ Class years fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching class years:', error);
    throw error;
  }
  },

  // Get single class year by ID
  getClassYearById: async (id) => {
  try {
      console.log('🔍 Fetching class year with ID:', id);
      const response = await academicApi.get(`class-years/${id}/`);
      console.log('✅ Class year fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching class year:', error);
    throw error;
  }
  },

  // Create new class year
  createClassYear: async (classYearData) => {
  try {
      console.log('🔍 Creating class year with data:', classYearData);
      const response = await academicApi.post('class-years/', classYearData);
      console.log('✅ Class year created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating class year:', error);
    throw error;
  }
  },

  // Update existing class year
  updateClassYear: async (id, classYearData) => {
  try {
      console.log('🔍 Updating class year with ID:', id, 'data:', classYearData);
      const response = await academicApi.put(`class-years/${id}/`, classYearData);
      console.log('✅ Class year updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating class year:', error);
    throw error;
  }
  },

  // Delete class year
  deleteClassYear: async (id) => {
  try {
      console.log('🔍 Deleting class year with ID:', id);
      const response = await academicApi.delete(`class-years/${id}/`);
      console.log('✅ Class year deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting class year:', error);
    throw error;
  }
  },

// ===== REASONS LEFT =====
  
  // Get all reasons left
  getReasonsLeft: async () => {
    try {
      console.log('🔍 Fetching reasons left');
      const response = await academicApi.get('reasons-left/');
      console.log('✅ Reasons left fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching reasons left:', error);
    throw error;
  }
  },

  // Get single reason left by ID
  getReasonLeftById: async (id) => {
  try {
      console.log('🔍 Fetching reason left with ID:', id);
      const response = await academicApi.get(`reasons-left/${id}/`);
      console.log('✅ Reason left fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching reason left:', error);
    throw error;
  }
  },

  // Create new reason left
  createReasonLeft: async (reasonLeftData) => {
  try {
      console.log('🔍 Creating reason left with data:', reasonLeftData);
      const response = await academicApi.post('reasons-left/', reasonLeftData);
      console.log('✅ Reason left created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating reason left:', error);
    throw error;
  }
  },

  // Update existing reason left
  updateReasonLeft: async (id, reasonLeftData) => {
  try {
      console.log('🔍 Updating reason left with ID:', id, 'data:', reasonLeftData);
      const response = await academicApi.put(`reasons-left/${id}/`, reasonLeftData);
      console.log('✅ Reason left updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating reason left:', error);
    throw error;
  }
  },

  // Delete reason left
  deleteReasonLeft: async (id) => {
  try {
      console.log('🔍 Deleting reason left with ID:', id);
      const response = await academicApi.delete(`reasons-left/${id}/`);
      console.log('✅ Reason left deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting reason left:', error);
    throw error;
  }
  },

// ===== STREAMS =====
  
  // Get all streams
  getStreams: async () => {
    try {
      console.log('🔍 Fetching streams');
      const response = await academicApi.get('streams/');
      console.log('✅ Streams fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching streams:', error);
    throw error;
  }
  },

  // Get single stream by ID
  getStreamById: async (id) => {
  try {
      console.log('🔍 Fetching stream with ID:', id);
      const response = await academicApi.get(`streams/${id}/`);
      console.log('✅ Stream fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching stream:', error);
    throw error;
  }
  },

  // Create new stream
  createStream: async (streamData) => {
  try {
      console.log('🔍 Creating stream with data:', streamData);
      const response = await academicApi.post('streams/', streamData);
      console.log('✅ Stream created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating stream:', error);
    throw error;
  }
  },

  // Update existing stream
  updateStream: async (id, streamData) => {
  try {
      console.log('🔍 Updating stream with ID:', id, 'data:', streamData);
      const response = await academicApi.put(`streams/${id}/`, streamData);
      console.log('✅ Stream updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating stream:', error);
    throw error;
  }
  },

  // Delete stream
  deleteStream: async (id) => {
  try {
      console.log('🔍 Deleting stream with ID:', id);
      const response = await academicApi.delete(`streams/${id}/`);
      console.log('✅ Stream deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting stream:', error);
    throw error;
  }
  },

// ===== SUBJECTS =====
  
  // Get all subjects
  getSubjects: async () => {
    try {
      console.log('🔍 Fetching subjects');
      const response = await academicApi.get('subjects/');
      console.log('✅ Subjects fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching subjects:', error);
    throw error;
  }
  },

  // Get single subject by ID
  getSubjectById: async (id) => {
    try {
      console.log('🔍 Fetching subject with ID:', id);
      const response = await academicApi.get(`subjects/${id}/`);
      console.log('✅ Subject fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching subject:', error);
    throw error;
  }
  },

  // Create new subject
  createSubject: async (subjectData) => {
  try {
      console.log('🔍 Creating subject with data:', subjectData);
      const response = await academicApi.post('subjects/', subjectData);
      console.log('✅ Subject created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating subject:', error);
    throw error;
  }
  },

  // Update existing subject
  updateSubject: async (id, subjectData) => {
  try {
      console.log('🔍 Updating subject with ID:', id, 'data:', subjectData);
      const response = await academicApi.put(`subjects/${id}/`, subjectData);
      console.log('✅ Subject updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating subject:', error);
    throw error;
  }
  },

  // Delete subject
  deleteSubject: async (id) => {
  try {
      console.log('🔍 Deleting subject with ID:', id);
      const response = await academicApi.delete(`subjects/${id}/`);
      console.log('✅ Subject deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting subject:', error);
    throw error;
  }
  },

  // ===== CLASSROOMS =====

  // Get all classrooms
  getClassrooms: async () => {
  try {
      console.log('🔍 Fetching classrooms');
      const response = await academicApi.get('classrooms/');
      console.log('✅ Classrooms fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error fetching classrooms:', error);
    throw error;
  }
  },

  // Create new classroom
  createClassroom: async (classroomData) => {
    try {
      console.log('🔍 Creating classroom with data:', classroomData);
      const response = await academicApi.post('classrooms/', classroomData);
      console.log('✅ Classroom created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating classroom:', error);
    throw error;
  }
  },

  // ===== STUDENT CLASSES =====
  
  // Get all student classes
  getStudentClasses: async () => {
    try {
      console.log('🔍 Fetching student classes');
      const response = await academicApi.get('student-classes/');
      console.log('✅ Student classes fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching student classes:', error);
    throw error;
  }
  },

  // Get single student class by ID
  getStudentClassById: async (id) => {
    try {
      console.log('🔍 Fetching student class with ID:', id);
      const response = await academicApi.get(`student-classes/${id}/`);
      console.log('✅ Student class fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching student class:', error);
    throw error;
  }
  },

  // Create new student class
  createStudentClass: async (studentClassData) => {
  try {
      console.log('🔍 Creating student class with data:', studentClassData);
      const response = await academicApi.post('student-classes/', studentClassData);
      console.log('✅ Student class created successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error creating student class:', error);
    throw error;
  }
  },

  // Update existing student class
  updateStudentClass: async (id, studentClassData) => {
  try {
      console.log('🔍 Updating student class with ID:', id, 'data:', studentClassData);
      const response = await academicApi.put(`student-classes/${id}/`, studentClassData);
      console.log('✅ Student class updated successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error updating student class:', error);
    throw error;
  }
  },

  // Delete student class
  deleteStudentClass: async (id) => {
  try {
      console.log('🔍 Deleting student class with ID:', id);
      const response = await academicApi.delete(`student-classes/${id}/`);
      console.log('✅ Student class deleted successfully');
    return response.data;
  } catch (error) {
      console.error('❌ Error deleting student class:', error);
    throw error;
  }
  },

  // ===== BULK UPLOAD =====
  
  // Bulk upload subjects
  bulkUploadSubjects: async (file) => {
    try {
      console.log('🔍 Bulk uploading subjects');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await academicApi.post('subjects/bulk-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Subjects bulk uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error bulk uploading subjects:', error);
    throw error;
  }
  },

  // Bulk upload classrooms
  bulkUploadClassrooms: async (file) => {
    try {
      console.log('🔍 Bulk uploading classrooms');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await academicApi.post('classrooms/bulk-upload/', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
      console.log('✅ Classrooms bulk uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('❌ Error bulk uploading classrooms:', error);
    throw error;
  }
  },

  // Bulk upload student classes
  bulkUploadStudentClasses: async (file) => {
    try {
      console.log('🔍 Bulk uploading student classes');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await academicApi.post('student-classes/bulk-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Student classes bulk uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk uploading student classes:', error);
    throw error;
  }
  },

  // ===== ALLOCATED SUBJECTS =====
  // NOTE: These endpoints don't exist on the Django backend yet
  // They will be implemented when the backend is ready
  
  // Get all allocated subjects (placeholder - returns empty array)
  getAllocatedSubjects: async () => {
    try {
      console.log('🔍 Allocated subjects endpoint not implemented yet - returning empty array');
      return [];
    } catch (error) {
      console.error('❌ Error with allocated subjects:', error);
      return [];
    }
  },

  // Get single allocated subject by ID (placeholder)
  getAllocatedSubjectById: async (id) => {
    try {
      console.log('🔍 Allocated subject endpoint not implemented yet - returning null');
      return null;
    } catch (error) {
      console.error('❌ Error with allocated subject:', error);
      return null;
    }
  },

  // Create new allocated subject (placeholder)
  createAllocatedSubject: async (allocatedSubjectData) => {
    try {
      console.log('🔍 Allocated subject creation not implemented yet - returning mock data');
      return { id: Date.now(), ...allocatedSubjectData, created: true };
    } catch (error) {
      console.error('❌ Error creating allocated subject:', error);
      throw new Error('Allocated subject creation not implemented yet');
    }
  },

  // Update existing allocated subject (placeholder)
  updateAllocatedSubject: async (id, allocatedSubjectData) => {
    try {
      console.log('🔍 Allocated subject update not implemented yet - returning mock data');
      return { id, ...allocatedSubjectData, updated: true };
    } catch (error) {
      console.error('❌ Error updating allocated subject:', error);
      throw new Error('Allocated subject update not implemented yet');
    }
  },

  // Delete allocated subject (placeholder)
  deleteAllocatedSubject: async (id) => {
    try {
      console.log('🔍 Allocated subject deletion not implemented yet - returning success');
      return { deleted: true, id };
    } catch (error) {
      console.error('❌ Error deleting allocated subject:', error);
      throw new Error('Allocated subject deletion not implemented yet');
    }
  },
};

export default AcademicService; 