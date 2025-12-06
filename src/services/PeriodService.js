import axiosInstance from './AxiosInstance';

// Get all periods
export const getPeriods = async (optionsOnly = false) => {
  try {
    const response = await axiosInstance.get('/api/timetable/periods/');
    if (optionsOnly) {
      return response.data.map(period => ({
        value: period.id,
        label: `${period.subject?.name || 'Unknown'} - ${period.classroom?.name || 'Unknown'} (${period.day_of_week})`
      }));
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching periods:', error);
    throw error;
  }
};

// Get period by ID
export const getPeriodById = async (id, optionsOnly = false) => {
  try {
    const response = await axiosInstance.get(`/api/timetable/periods/${id}/`);
    if (optionsOnly) {
      const period = response.data;
      return {
        value: period.id,
        label: `${period.subject?.name || 'Unknown'} - ${period.classroom?.name || 'Unknown'} (${period.day_of_week})`
      };
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching period:', error);
    throw error;
  }
};

// Create new period - Updated to match Django backend
export const createPeriod = async (periodData) => {
  try {
    // The Django backend expects:
    // - allocated_subject: AllocatedSubject ID
    // - classroom: ClassRoom ID
    // - day_of_week, start_time, end_time
    const response = await axiosInstance.post('/api/timetable/periods/', periodData);
    return response.data;
  } catch (error) {
    console.error('Error creating period:', error);
    throw error;
  }
};

// Update period
export const updatePeriod = async (id, periodData) => {
  try {
    const response = await axiosInstance.put(`/api/timetable/periods/${id}/`, periodData);
    return response.data;
  } catch (error) {
    console.error('Error updating period:', error);
    throw error;
  }
};

// Patch period (partial update)
export const patchPeriod = async (id, periodData) => {
  try {
    const response = await axiosInstance.patch(`/api/timetable/periods/${id}/`, periodData);
    return response.data;
  } catch (error) {
    console.error('Error patching period:', error);
    throw error;
  }
};

// Delete period
export const deletePeriod = async (id) => {
  try {
    await axiosInstance.delete(`/api/timetable/periods/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting period:', error);
    throw error;
  }
};

// Get periods by filters (day, teacher, classroom, etc.)
export const getPeriodsByFilter = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axiosInstance.get(`/api/timetable/periods/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered periods:', error);
    throw error;
  }
};

// Generate timetable - Updated to match Django backend
export const generateTimetable = async () => {
  try {
    const response = await axiosInstance.post('/api/timetable/generate-timetable/');
    return response.data;
  } catch (error) {
    console.error('Error generating timetable:', error);
    throw error;
  }
};

// Get periods for a specific week
export const getWeeklySchedule = async (weekStart, weekEnd) => {
  try {
    const response = await axiosInstance.get('/api/timetable/periods/', {
      params: { week_start: weekStart, week_end: weekEnd }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly schedule:', error);
    return [];
  }
};

// Get periods for a specific day
export const getDailySchedule = async (date) => {
  try {
    const response = await axiosInstance.get('/api/timetable/periods/', {
      params: { date: date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily schedule:', error);
    return [];
  }
};

// Get timetable statistics
export const getTimetableStats = async () => {
  try {
    const response = await axiosInstance.get('/api/timetable/periods/');
    const periods = response.data;
    
    const stats = {
      total: periods.length,
      byDay: {
        Monday: periods.filter(p => p.day_of_week === 'Monday').length,
        Tuesday: periods.filter(p => p.day_of_week === 'Tuesday').length,
        Wednesday: periods.filter(p => p.day_of_week === 'Wednesday').length,
        Thursday: periods.filter(p => p.day_of_week === 'Thursday').length,
        Friday: periods.filter(p => p.day_of_week === 'Friday').length
      },
      byTeacher: {},
      byClassroom: {},
      bySubject: {}
    };
    
    // Group by teacher, classroom, and subject
    periods.forEach(period => {
      const teacherName = period.teacher?.name || 'Unknown';
      const classroomName = period.classroom?.name || 'Unknown';
      const subjectName = period.subject?.name || 'Unknown';
      
      stats.byTeacher[teacherName] = (stats.byTeacher[teacherName] || 0) + 1;
      stats.byClassroom[classroomName] = (stats.byClassroom[classroomName] || 0) + 1;
      stats.bySubject[subjectName] = (stats.bySubject[subjectName] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching timetable stats:', error);
    return { total: 0, byDay: {}, byTeacher: {}, byClassroom: {}, bySubject: {} };
  }
};

// Export timetable data
export const exportTimetable = async (format = 'json') => {
  try {
    const response = await axiosInstance.get('/api/timetable/periods/', {
      params: { format: format }
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting timetable:', error);
    throw error;
  }
};
