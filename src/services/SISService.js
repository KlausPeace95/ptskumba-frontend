import axiosInstance from './AxiosInstance';

// ===== STUDENT MANAGEMENT =====

// Test API Connection
export const testSISConnection = async () => {
  try {
    console.log('🔍 Testing SIS API connection...');
    const response = await axiosInstance.get('/sis/students/', {
      params: { page: 1, page_size: 1 }
    });
    console.log('✅ SIS API connection successful:', response.status);
    return { status: 'working', message: 'SIS API is responsive' };
  } catch (error) {
    console.error('❌ SIS API connection failed:', error);
    return { 
      status: 'failed', 
      message: error.response?.data?.message || error.message || 'Connection failed' 
    };
  }
};

// Test Create Student Endpoint
export const testCreateStudentEndpoint = async () => {
  try {
    console.log('🔍 Testing create student endpoint...');
    const testStudentData = {
      first_name: 'Test',
      middle_name: 'API',
      last_name: 'Student',
      admission_number: `TEST-${Date.now()}`, // Generate unique timestamp-based number
      parent_contact: '+237123456789',
      religion: 'Christian',
      class_level: 'Form 1', // This should match an existing class level
      class_of_year: '2024', // Add required field
      gender: 'Male', // Use valid gender choice
      date_of_birth: '2005-01-01',
      region: 'Test Region',
      city: 'Test City',
      street: 'Test Street'
    };
    
    // Debug: Log the test data being sent
    console.log('🔍 Test student data being sent:', testStudentData);
    console.log('🔍 Test gender value:', testStudentData.gender);
    console.log('🔍 Test class_of_year value:', testStudentData.class_of_year);
    console.log('🔍 Test admission_number:', testStudentData.admission_number);
    
    const response = await axiosInstance.post('/sis/students/', testStudentData);
    console.log('✅ Test student created successfully:', response.data);
    
    // Clean up test student
    if (response.data.id) {
      try {
        await axiosInstance.delete(`/sis/students/${response.data.id}/`);
        console.log('✅ Test student cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up test student:', cleanupError);
      }
    }
    
    return { status: 'working', message: 'Create student endpoint is working' };
  } catch (error) {
    console.error('❌ Create student endpoint test failed:', error);
    return { 
      status: 'failed', 
      message: error.response?.data?.error || error.response?.data?.message || error.message || 'Create endpoint failed' 
    };
  }
};

// Get all students with optional filters
export const getAllStudents = async (filters = {}) => {
  try {
    console.log('🔍 Fetching students with filters:', filters);
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axiosInstance.get(`/sis/students/?${params.toString()}`);
    console.log('✅ Students fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    throw error;
  }
};

// Get single student by ID
export const getStudentById = async (id) => {
  try {
    console.log('🔍 Fetching student with ID:', id);
    const response = await axiosInstance.get(`/sis/students/${id}/`);
    console.log('✅ Student fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching student:', error);
    throw error;
  }
};

// Create new student
export const createStudent = async (studentData) => {
  try {
    console.log('🔍 Creating new student:', studentData);
    const response = await axiosInstance.post('/sis/students/', studentData);
    console.log('✅ Student created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating student:', error);
    throw error;
  }
};

// Update student
export const updateStudent = async (id, studentData) => {
  try {
    console.log('🔍 Updating student with ID:', id, studentData);
    const response = await axiosInstance.put(`/sis/students/${id}/`, studentData);
    console.log('✅ Student updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating student:', error);
    throw error;
  }
};

// Delete student
export const deleteStudent = async (id) => {
  try {
    console.log('🔍 Deleting student with ID:', id);
    await axiosInstance.delete(`/sis/students/${id}/`);
    console.log('✅ Student deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting student:', error);
    throw error;
  }
};

// ===== BULK UPLOAD =====

// Bulk upload students from Excel file
export const bulkUploadStudents = async (file) => {
  try {
    console.log('🔍 Starting bulk upload for file:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/sis/students/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Bulk upload completed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error during bulk upload:', error);
    throw error;
  }
};

// ===== STUDENT STATISTICS =====

// Get student statistics
export const getStudentStats = async () => {
  try {
    console.log('🔍 Fetching student statistics');
    const students = await getAllStudents();
    
    const stats = {
      total: students.length,
      byGender: {},
      byClassLevel: {},
      byReligion: {},
      byRegion: {},
      withParents: 0,
      withoutParents: 0,
      withSiblings: 0,
      withoutSiblings: 0
    };
    
    students.forEach(student => {
      // Gender distribution
      const gender = student.gender || 'Unknown';
      stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
      
      // Class level distribution
      const classLevel = student.class_level_display || 'Unknown';
      stats.byClassLevel[classLevel] = (stats.byClassLevel[classLevel] || 0) + 1;
      
      // Religion distribution
      const religion = student.religion || 'Unknown';
      stats.byReligion[religion] = (stats.byReligion[religion] || 0) + 1;
      
      // Region distribution
      const region = student.region || 'Unknown';
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
      
      // Parent status
      if (student.parent_guardian_display) {
        stats.withParents++;
      } else {
        stats.withoutParents++;
      }
      
      // Sibling status
      if (student.siblings && student.siblings.length > 0) {
        stats.withSiblings++;
      } else {
        stats.withoutSiblings++;
      }
    });
    
    console.log('✅ Student statistics calculated:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error calculating student statistics:', error);
    return {
      total: 0,
      byGender: {},
      byClassLevel: {},
      byReligion: {},
      byRegion: {},
      withParents: 0,
      withoutParents: 0,
      withSiblings: 0,
      withoutSiblings: 0
    };
  }
};

// ===== STUDENT SEARCH & FILTERS =====

// Search students by name
export const searchStudentsByName = async (searchTerm) => {
  try {
    console.log('🔍 Searching students by name:', searchTerm);
    const filters = {
      first_name: searchTerm,
      last_name: searchTerm
    };
    
    const response = await getAllStudents(filters);
    console.log('✅ Student search completed:', response);
    return response;
  } catch (error) {
    console.error('❌ Error searching students:', error);
    throw error;
  }
};

// Get students by class level
export const getStudentsByClassLevel = async (classLevel) => {
  try {
    console.log('🔍 Fetching students by class level:', classLevel);
    const filters = { class_level: classLevel };
    
    const response = await getAllStudents(filters);
    console.log('✅ Students by class level fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching students by class level:', error);
    throw error;
  }
};

// Get students by region
export const getStudentsByRegion = async (region) => {
  try {
    console.log('🔍 Fetching students by region:', region);
    // Note: This would need to be implemented on the backend
    // For now, we'll filter on the frontend
    const allStudents = await getAllStudents();
    const filteredStudents = allStudents.filter(student => 
      student.region && student.region.toLowerCase().includes(region.toLowerCase())
    );
    
    console.log('✅ Students by region fetched:', filteredStudents);
    return filteredStudents;
  } catch (error) {
    console.error('❌ Error fetching students by region:', error);
    throw error;
  }
};

// ===== EXPORT FUNCTIONS =====

// Export students data
export const exportStudentsData = async (format = 'json') => {
  try {
    console.log('🔍 Exporting students data in format:', format);
    const students = await getAllStudents();
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(students, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Students data exported as JSON');
      return { success: true, message: 'Students data exported successfully' };
    }
    
    // Add support for other formats (CSV, Excel) in the future
    throw new Error(`Export format '${format}' not supported yet`);
  } catch (error) {
    console.error('❌ Error exporting students data:', error);
    throw error;
  }
};
