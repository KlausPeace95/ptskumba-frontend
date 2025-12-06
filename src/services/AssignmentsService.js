import { api } from './AxiosInstance';

// Get all assignments
export const getAssignments = async () => {
    console.log('📝 Fetching assignments...');
    try {
        const response = await api.get('/assignments/');
        console.log('📝 Assignments response:', response.data);
        return response.data;
    } catch (error) {
        console.error('📝 Error fetching assignments:', error);
        throw error;
    }
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
    console.log(`📝 Fetching assignment ID ${id}...`);
    try {
        const response = await api.get(`/assignments/${id}/`);
        console.log(`📝 Assignment ${id} response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📝 Error fetching assignment ${id}:`, error);
        throw error;
    }
};

// Create new assignment
export const createAssignment = async (assignmentData) => {
    console.log('📝 Creating new assignment...', assignmentData);
    try {
        const response = await api.post('/assignments/', assignmentData);
        console.log('📝 Assignment created:', response.data);
        return response.data;
    } catch (error) {
        console.error('📝 Error creating assignment:', error);
        throw error;
    }
};

// Update assignment
export const updateAssignment = async (id, assignmentData) => {
    console.log(`📝 Updating assignment ID ${id}...`, assignmentData);
    try {
        const response = await api.put(`/assignments/${id}/`, assignmentData);
        console.log(`📝 Assignment ${id} updated:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📝 Error updating assignment ${id}:`, error);
        throw error;
    }
};

// Delete assignment
export const deleteAssignment = async (id) => {
    console.log(`📝 Deleting assignment ID ${id}...`);
    try {
        const response = await api.delete(`/assignments/${id}/`);
        console.log(`📝 Assignment ${id} deleted:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`📝 Error deleting assignment ${id}:`, error);
        throw error;
    }
}; 