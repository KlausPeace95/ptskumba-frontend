import { api } from './AxiosInstance';

// Academic Years - GET, POST, HEAD, OPTIONS
export const getAcademicYears = async (optionsOnly = false) => {
    console.log('🎓 Fetching Academic Years...');
    if (optionsOnly) {
        try {
            const response = await api.options('/administration/academic-years/');
            return response;
        } catch (error) {
            return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await api.get('/administration/academic-years/');
        console.log('📊 Academic Years Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching academic years:', error);
        throw error;
    }
};

export const getAcademicYearById = async (id, optionsOnly = false) => {
    console.log(`🎓 Fetching Academic Year ID: ${id}...`);
    if (optionsOnly) {
        try {
            const response = await api.options(`/administration/academic-years/${id}/`);
            return response;
        } catch (error) {
            return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await api.get(`/administration/academic-years/${id}/`);
        console.log('📊 Academic Year Detail Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching academic year ${id}:`, error);
        throw error;
    }
};

export const createAcademicYear = async (data) => {
    console.log('🎓 Creating Academic Year...', data);
    try {
        const response = await api.post('/administration/academic-years/', data);
        console.log('📊 Created Academic Year Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating academic year:', error);
        throw error;
    }
};

export const updateAcademicYear = async (id, data) => {
    console.log(`🎓 Updating Academic Year ID: ${id}...`, data);
    try {
        const response = await api.put(`/administration/academic-years/${id}/`, data);
        console.log('📊 Updated Academic Year Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating academic year ${id}:`, error);
        throw error;
    }
};

export const patchAcademicYear = async (id, data) => {
    console.log(`🎓 Patching Academic Year ID: ${id}...`, data);
    try {
        const response = await api.patch(`/administration/academic-years/${id}/`, data);
        console.log('📊 Patched Academic Year Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error patching academic year ${id}:`, error);
        throw error;
    }
};

export const deleteAcademicYear = async (id) => {
    console.log(`🎓 Deleting Academic Year ID: ${id}...`);
    try {
        const response = await api.delete(`/administration/academic-years/${id}/`);
        console.log('📊 Deleted Academic Year Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting academic year ${id}:`, error);
        throw error;
    }
};

// Terms - GET, POST, HEAD, OPTIONS
export const getTerms = async (optionsOnly = false) => {
    console.log('📅 Fetching Terms...');
    if (optionsOnly) {
        try {
            const response = await api.options('/administration/terms/');
            return response;
        } catch (error) {
            return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await api.get('/administration/terms/');
        console.log('📊 Terms Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching terms:', error);
        throw error;
    }
};

export const getTermById = async (id, optionsOnly = false) => {
    console.log(`📅 Fetching Term ID: ${id}...`);
    if (optionsOnly) {
        try {
            const response = await api.options(`/administration/terms/${id}/`);
            return response;
        } catch (error) {
            return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await api.get(`/administration/terms/${id}/`);
        console.log('📊 Term Detail Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching term ${id}:`, error);
        throw error;
    }
};

export const createTerm = async (data) => {
    console.log('📅 Creating Term...', data);
    try {
        const response = await api.post('/administration/terms/', data);
        console.log('📊 Created Term Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating term:', error);
        throw error;
    }
};

export const updateTerm = async (id, data) => {
    console.log(`📅 Updating Term ID: ${id}...`, data);
    try {
        const response = await api.put(`/administration/terms/${id}/`, data);
        console.log('📊 Updated Term Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating term ${id}:`, error);
        throw error;
    }
};

export const patchTerm = async (id, data) => {
    console.log(`📅 Patching Term ID: ${id}...`, data);
    try {
        const response = await api.patch(`/administration/terms/${id}/`, data);
        console.log('📊 Patched Term Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error patching term ${id}:`, error);
        throw error;
    }
};

export const deleteTerm = async (id) => {
    console.log(`📅 Deleting Term ID: ${id}...`);
    try {
        const response = await api.delete(`/administration/terms/${id}/`);
        console.log('📊 Deleted Term Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting term ${id}:`, error);
        throw error;
    }
};

// School Events - GET, POST, HEAD, OPTIONS
export const getSchoolEvents = async (optionsOnly = false) => {
    console.log('🎉 Fetching School Events...');
    if (optionsOnly) {
        try {
            const response = await api.options('/administration/school-events/');
            return response;
        } catch (error) {
            return { headers: { allow: 'GET, POST, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await api.get('/administration/school-events/');
        console.log('📊 School Events Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching school events:', error);
        throw error;
    }
};

export const getSchoolEventById = async (id, optionsOnly = false) => {
    console.log(`🎉 Fetching School Event ID: ${id}...`);
    if (optionsOnly) {
        try {
            const response = await api.options(`/administration/school-events/${id}/`);
            return response;
        } catch (error) {
            return { headers: { allow: 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS' } };
        }
    }
    try {
        const response = await api.get(`/administration/school-events/${id}/`);
        console.log('📊 School Event Detail Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching school event ${id}:`, error);
        throw error;
    }
};

export const createSchoolEvent = async (data) => {
    console.log('🎉 Creating School Event...', data);
    try {
        const response = await api.post('/administration/school-events/', data);
        console.log('📊 Created School Event Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating school event:', error);
        throw error;
    }
};

export const updateSchoolEvent = async (id, data) => {
    console.log(`🎉 Updating School Event ID: ${id}...`, data);
    try {
        const response = await api.put(`/administration/school-events/${id}/`, data);
        console.log('📊 Updated School Event Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating school event ${id}:`, error);
        throw error;
    }
};

export const patchSchoolEvent = async (id, data) => {
    console.log(`🎉 Patching School Event ID: ${id}...`, data);
    try {
        const response = await api.patch(`/administration/school-events/${id}/`, data);
        console.log('📊 Patched School Event Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error patching school event ${id}:`, error);
        throw error;
    }
};

export const deleteSchoolEvent = async (id) => {
    console.log(`🎉 Deleting School Event ID: ${id}...`);
    try {
        const response = await api.delete(`/administration/school-events/${id}/`);
        console.log('📊 Deleted School Event Response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting school event ${id}:`, error);
        throw error;
    }
};

// Bulk Upload and Template Download (these endpoints return 404, but we'll keep them for when they're implemented)
export const bulkUploadSchoolEvents = async (formData) => {
    console.log('🎉 Bulk uploading School Events...');
    try {
        const response = await api.post('/administration/school-events/bulk-upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('📊 Bulk Upload School Events Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error bulk uploading school events:', error);
        throw error;
    }
};

export const downloadSchoolEventsTemplate = async () => {
    console.log('🎉 Downloading School Events Template...');
    try {
        const response = await api.get('/administration/school-events/template-download/', {
            responseType: 'blob'
        });
        console.log('📊 School Events Template Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error downloading school events template:', error);
        throw error;
    }
};

export default {
    // Academic Years
    getAcademicYears,
    getAcademicYearById,
    createAcademicYear,
    updateAcademicYear,
    patchAcademicYear,
    deleteAcademicYear,
    
    // Terms
    getTerms,
    getTermById,
    createTerm,
    updateTerm,
    patchTerm,
    deleteTerm,
    
    // School Events
    getSchoolEvents,
    getSchoolEventById,
    createSchoolEvent,
    updateSchoolEvent,
    patchSchoolEvent,
    deleteSchoolEvent,
    bulkUploadSchoolEvents,
    downloadSchoolEventsTemplate,
};