import axiosInstance from './AxiosInstance';

// ===== TEACHER MANAGEMENT =====

// Test API Connection
export const testTeachersConnection = async () => {
  try {
    console.log('🔍 Testing Teachers API connection...');
    const response = await axiosInstance.get('/users/teachers/', {
      params: { page: 1, page_size: 1 }
    });
    console.log('✅ Teachers API connection successful:', response.status);
    return { status: 'working', message: 'Teachers API is responsive' };
  } catch (error) {
    console.error('❌ Teachers API connection failed:', error);
    return { 
      status: 'failed', 
      message: error.response?.data?.message || error.message || 'Connection failed' 
    };
  }
};

// Test Create Teacher Endpoint
export const testCreateTeacherEndpoint = async () => {
  try {
    console.log('🔍 Testing create teacher endpoint...');
    const testTeacherData = {
      first_name: 'Test',
      middle_name: 'API',
      last_name: 'Teacher',
      email: `test.teacher.${Date.now()}@hayatul.com`, // Generate unique email
      phone_number: `+237${Date.now().toString().slice(-8)}`, // Generate unique phone
      empId: `EMP${Date.now().toString().slice(-5)}`, // Generate unique employment ID (max 8 chars)
      short_name: 'TT',
      subject_specialization: ['Mathematics'], // Default subject
      address: 'Test Address',
      gender: 'Male',
      date_of_birth: '1985-01-01',
      salary: 500000
    };
    
    // Debug: Log the test data being sent
    console.log('🔍 Test teacher data being sent:', testTeacherData);
    console.log('🔍 Test email:', testTeacherData.email);
    console.log('🔍 Test phone:', testTeacherData.phone_number);
    console.log('🔍 Test empId:', testTeacherData.empId);
    
    const response = await axiosInstance.post('/users/teachers/', testTeacherData);
    console.log('✅ Test teacher created successfully:', response.data);
    
    // Clean up test teacher
    if (response.data.id) {
      try {
        await axiosInstance.delete(`/users/teachers/${response.data.id}/`);
        console.log('✅ Test teacher cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up test teacher:', cleanupError);
      }
    }
    
    return { 
      status: 'working', 
      message: 'Teacher creation endpoint is working' 
    };
  } catch (error) {
    console.error('❌ Teacher creation test failed:', error);
    return { 
      status: 'failed', 
      message: error.response?.data?.error || error.response?.data?.message || error.message || 'Create endpoint failed' 
    };
  }
};

// Get all teachers with optional filters
export const getAllTeachers = async (filters = {}) => {
  try {
    console.log('🔍 Fetching teachers with filters:', filters);
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axiosInstance.get(`/users/teachers/?${params.toString()}`);
    console.log('✅ Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching teachers:', error);
    throw error;
  }
};

// Get single teacher by ID
export const getTeacherById = async (id) => {
  try {
    console.log('🔍 Fetching teacher with ID:', id);
    const response = await axiosInstance.get(`/users/teachers/${id}/`);
    console.log('✅ Teacher fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching teacher:', error);
    throw error;
  }
};

// Create new teacher
export const createTeacher = async (teacherData) => {
  try {
    console.log('🔍 Creating new teacher:', teacherData);
    const response = await axiosInstance.post('/users/teachers/', teacherData);
    console.log('✅ Teacher created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating teacher:', error);
    throw error;
  }
};

// Update teacher
export const updateTeacher = async (id, teacherData) => {
  try {
    console.log('🔍 Updating teacher with ID:', id, teacherData);
    const response = await axiosInstance.put(`/users/teachers/${id}/`, teacherData);
    console.log('✅ Teacher updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating teacher:', error);
    throw error;
  }
};

// Delete teacher
export const deleteTeacher = async (id) => {
  try {
    console.log('🔍 Deleting teacher with ID:', id);
    await axiosInstance.delete(`/users/teachers/${id}/`);
    console.log('✅ Teacher deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting teacher:', error);
    throw error;
  }
};

// ===== BULK UPLOAD =====

// Bulk upload teachers from Excel file
export const bulkUploadTeachers = async (file) => {
  try {
    console.log('🔍 Starting bulk upload for file:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/users/teachers/bulk-upload/', formData, {
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

// ===== TEACHER STATISTICS =====

// Get teacher statistics
export const getTeacherStats = async () => {
  try {
    console.log('🔍 Fetching teacher statistics');
    const teachers = await getAllTeachers();
    
    const stats = {
      total: teachers.length,
      byGender: {},
      bySubject: {},
      bySalary: {
        total: 0,
        average: 0,
        highest: 0,
        lowest: Infinity
      },
      withSubjects: 0,
      withoutSubjects: 0
    };
    
    teachers.forEach(teacher => {
      // Gender distribution
      const gender = teacher.gender || 'Unknown';
      stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
      
      // Subject specialization
      if (teacher.subject_specialization_display && teacher.subject_specialization_display.length > 0) {
        stats.withSubjects++;
        teacher.subject_specialization_display.forEach(subject => {
          stats.bySubject[subject] = (stats.bySubject[subject] || 0) + 1;
        });
      } else {
        stats.withoutSubjects++;
      }
      
      // Salary statistics
      if (teacher.salary) {
        stats.bySalary.total += teacher.salary;
        stats.bySalary.highest = Math.max(stats.bySalary.highest, teacher.salary);
        stats.bySalary.lowest = Math.min(stats.bySalary.lowest, teacher.salary);
      }
    });
    
    // Calculate average salary
    if (teachers.length > 0) {
      stats.bySalary.average = Math.round(stats.bySalary.total / teachers.length);
    }
    
    // Handle case where no teachers have salary
    if (stats.bySalary.lowest === Infinity) {
      stats.bySalary.lowest = 0;
    }
    
    console.log('✅ Teacher statistics calculated:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error calculating teacher statistics:', error);
    return {
      total: 0,
      byGender: {},
      bySubject: {},
      bySalary: {
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0
      },
      withSubjects: 0,
      withoutSubjects: 0
    };
  }
};

// ===== TEACHER SEARCH & FILTERS =====

// Search teachers by name
export const searchTeachersByName = async (searchTerm) => {
  try {
    console.log('🔍 Searching teachers by name:', searchTerm);
    const filters = {
      first_name: searchTerm,
      last_name: searchTerm
    };
    
    const response = await getAllTeachers(filters);
    console.log('✅ Teacher search completed:', response);
    return response;
  } catch (error) {
    console.error('❌ Error searching teachers:', error);
    throw error;
  }
};

// Get teachers by subject specialization
export const getTeachersBySubject = async (subjectName) => {
  try {
    console.log('🔍 Fetching teachers by subject:', subjectName);
    const allTeachers = await getAllTeachers();
    const filteredTeachers = allTeachers.filter(teacher => 
      teacher.subject_specialization_display && 
      teacher.subject_specialization_display.some(subject => 
        subject.toLowerCase().includes(subjectName.toLowerCase())
      )
    );
    
    console.log('✅ Teachers by subject fetched:', filteredTeachers);
    return filteredTeachers;
  } catch (error) {
    console.error('❌ Error fetching teachers by subject:', error);
    throw error;
  }
};

// ===== EXPORT FUNCTIONS =====

// Export teachers data
export const exportTeachersData = async (format = 'json') => {
  try {
    console.log('🔍 Exporting teachers data in format:', format);
    const teachers = await getAllTeachers();
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(teachers, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teachers-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert to CSV format
      const headers = [
        'ID', 'First Name', 'Middle Name', 'Last Name', 'Email', 'Phone Number',
        'Employment ID', 'Short Name', 'Subjects', 'Address', 'Gender', 
        'Date of Birth', 'Salary'
      ];
      
      const csvContent = [
        headers.join(','),
        ...teachers.map(teacher => [
          teacher.id,
          teacher.first_name,
          teacher.middle_name || '',
          teacher.last_name,
          teacher.email,
          teacher.phone_number,
          teacher.empId,
          teacher.short_name,
          teacher.subject_specialization_display ? teacher.subject_specialization_display.join(';') : '',
          teacher.address,
          teacher.gender,
          teacher.date_of_birth,
          teacher.salary
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    
    console.log('✅ Teachers data exported successfully');
    return { success: true, message: `Teachers data exported as ${format.toUpperCase()}` };
  } catch (error) {
    console.error('❌ Error exporting teachers data:', error);
    throw error;
  }
};
