import { api } from './AxiosInstance';

// Teacher Attendance
export const getTeacherAttendance = async (optionsOnly = false) => {
    console.log('📚 Fetching teacher attendance...');
    try {
        if (optionsOnly) {
            const response = await api.options('/attendance/teacher-attendance/');
            return response;
        }
        const response = await api.get('/attendance/teacher-attendance/');
        console.log('📚 Teacher attendance response:', response.data);
        return response.data;
    } catch (error) {
        console.error('📚 Error fetching teacher attendance:', error);
        throw error;
    }
};

export const getTeacherAttendanceById = async (id, optionsOnly = false) => {
    console.log(`📚 Fetching teacher attendance ID ${id}...`);
    try {
        if (optionsOnly) {
            const response = await api.options(`/attendance/teacher-attendance/${id}/`);
            return response;
        }
        const response = await api.get(`/attendance/teacher-attendance/${id}/`);
        console.log(`📚 Teacher attendance ${id} response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📚 Error fetching teacher attendance ${id}:`, error);
        throw error;
    }
};

export const createTeacherAttendance = async (attendanceData) => {
    console.log('📚 Creating teacher attendance...', attendanceData);
    try {
        const response = await api.post('/attendance/teacher-attendance/', attendanceData);
        console.log('📚 Teacher attendance created:', response.data);
        return response.data;
    } catch (error) {
        console.error('📚 Error creating teacher attendance:', error);
        throw error;
    }
};

export const updateTeacherAttendance = async (id, attendanceData) => {
    console.log(`📚 Updating teacher attendance ID ${id}...`, attendanceData);
    try {
        const response = await api.put(`/attendance/teacher-attendance/${id}/`, attendanceData);
        console.log(`📚 Teacher attendance ${id} updated:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📚 Error updating teacher attendance ${id}:`, error);
        throw error;
    }
};

export const patchTeacherAttendance = async (id, attendanceData) => {
    console.log(`📚 Patching teacher attendance ID ${id}...`, attendanceData);
    try {
        const response = await api.patch(`/attendance/teacher-attendance/${id}/`, attendanceData);
        console.log(`📚 Teacher attendance ${id} patched:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📚 Error patching teacher attendance ${id}:`, error);
        throw error;
    }
};

export const deleteTeacherAttendance = async (id) => {
    console.log(`📚 Deleting teacher attendance ID ${id}...`);
    try {
        const response = await api.delete(`/attendance/teacher-attendance/${id}/`);
        console.log(`📚 Teacher attendance ${id} deleted:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📚 Error deleting teacher attendance ${id}:`, error);
        throw error;
    }
};

// Student Attendance
export const getStudentAttendance = async (optionsOnly = false) => {
    console.log('👨‍🎓 Fetching student attendance...');
    try {
        if (optionsOnly) {
            const response = await api.options('/attendance/student-attendance/');
            return response;
        }
        const response = await api.get('/attendance/student-attendance/');
        console.log('👨‍🎓 Student attendance response:', response.data);
        return response.data;
    } catch (error) {
        console.error('👨‍🎓 Error fetching student attendance:', error);
        throw error;
    }
};

export const getStudentAttendanceById = async (id, optionsOnly = false) => {
    console.log(`👨‍🎓 Fetching student attendance ID ${id}...`);
    try {
        if (optionsOnly) {
            const response = await api.options(`/attendance/student-attendance/${id}/`);
            return response;
        }
        const response = await api.get(`/attendance/student-attendance/${id}/`);
        console.log(`👨‍🎓 Student attendance ${id} response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`👨‍🎓 Error fetching student attendance ${id}:`, error);
        throw error;
    }
};

export const createStudentAttendance = async (attendanceData) => {
    console.log('👨‍🎓 Creating student attendance...', attendanceData);
    try {
        const response = await api.post('/attendance/student-attendance/', attendanceData);
        console.log('👨‍🎓 Student attendance created:', response.data);
        return response.data;
    } catch (error) {
        console.error('👨‍🎓 Error creating student attendance:', error);
        throw error;
    }
};

export const updateStudentAttendance = async (id, attendanceData) => {
    console.log(`👨‍🎓 Updating student attendance ID ${id}...`, attendanceData);
    try {
        const response = await api.put(`/attendance/student-attendance/${id}/`, attendanceData);
        console.log(`👨‍🎓 Student attendance ${id} updated:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`👨‍🎓 Error updating student attendance ${id}:`, error);
        throw error;
    }
};

export const patchStudentAttendance = async (id, attendanceData) => {
    console.log(`👨‍🎓 Patching student attendance ID ${id}...`, attendanceData);
    try {
        const response = await api.patch(`/attendance/student-attendance/${id}/`, attendanceData);
        console.log(`👨‍🎓 Student attendance ${id} patched:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`👨‍🎓 Error patching student attendance ${id}:`, error);
        throw error;
    }
};

export const deleteStudentAttendance = async (id) => {
    console.log(`👨‍🎓 Deleting student attendance ID ${id}...`);
    try {
        const response = await api.delete(`/attendance/student-attendance/${id}/`);
        console.log(`👨‍🎓 Student attendance ${id} deleted:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`👨‍🎓 Error deleting student attendance ${id}:`, error);
        throw error;
    }
};

// Period Attendance
export const getPeriodAttendance = async (optionsOnly = false) => {
    console.log('⏰ Fetching period attendance...');
    try {
        if (optionsOnly) {
            const response = await api.options('/attendance/period-attendance/');
            return response;
        }
        const response = await api.get('/attendance/period-attendance/');
        console.log('⏰ Period attendance response:', response.data);
        return response.data;
    } catch (error) {
        console.error('⏰ Error fetching period attendance:', error);
        throw error;
    }
};

export const getPeriodAttendanceById = async (id, optionsOnly = false) => {
    console.log(`⏰ Fetching period attendance ID ${id}...`);
    try {
        if (optionsOnly) {
            const response = await api.options(`/attendance/period-attendance/${id}/`);
            return response;
        }
        const response = await api.get(`/attendance/period-attendance/${id}/`);
        console.log(`⏰ Period attendance ${id} response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`⏰ Error fetching period attendance ${id}:`, error);
        throw error;
    }
};

export const createPeriodAttendance = async (attendanceData) => {
    console.log('⏰ Creating period attendance...', attendanceData);
    try {
        const response = await api.post('/attendance/period-attendance/', attendanceData);
        console.log('⏰ Period attendance created:', response.data);
        return response.data;
    } catch (error) {
        console.error('⏰ Error creating period attendance:', error);
        throw error;
    }
};

export const updatePeriodAttendance = async (id, attendanceData) => {
    console.log(`⏰ Updating period attendance ID ${id}...`, attendanceData);
    try {
        const response = await api.put(`/attendance/period-attendance/${id}/`, attendanceData);
        console.log(`⏰ Period attendance ${id} updated:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`⏰ Error updating period attendance ${id}:`, error);
        throw error;
    }
};

export const patchPeriodAttendance = async (id, attendanceData) => {
    console.log(`⏰ Patching period attendance ID ${id}...`, attendanceData);
    try {
        const response = await api.patch(`/attendance/period-attendance/${id}/`, attendanceData);
        console.log(`⏰ Period attendance ${id} patched:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`⏰ Error patching period attendance ${id}:`, error);
        throw error;
    }
};

export const deletePeriodAttendance = async (id) => {
    console.log(`⏰ Deleting period attendance ID ${id}...`);
    try {
        const response = await api.delete(`/attendance/period-attendance/${id}/`);
        console.log(`⏰ Period attendance ${id} deleted:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`⏰ Error deleting period attendance ${id}:`, error);
        throw error;
    }
}; 