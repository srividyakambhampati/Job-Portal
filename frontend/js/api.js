const API_URL = window.location.origin + '/api';

const api = {
    async request(endpoint, method = 'GET', body = null, isFileUpload = false) {
        const token = localStorage.getItem('token');
        const headers = {};

        if (!isFileUpload) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = isFileUpload ? body : JSON.stringify(body);
        }

        try {
            console.log(`🌐 API Request: ${method} ${API_URL}${endpoint}`, body ? { body: isFileUpload ? '[FormData]' : body } : '');
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            console.log(`📥 API Response: ${response.status}`, data);
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },

    login: (credentials) => api.request('/auth/login', 'POST', credentials),
    register: (userData) => api.request('/auth/register', 'POST', userData),
    getJobs: () => api.request('/jobs'),
    getJob: (id) => api.request(`/jobs/${id}`),
    postJob: (jobData) => api.request('/jobs', 'POST', jobData),
    applyJob: (jobId, formData) => api.request(`/applications/${jobId}`, 'POST', formData, true),
    getMyApplications: () => api.request('/applications/my'), // Candidate
    getJobApplications: (jobId) => api.request(`/applications/job/${jobId}`) // Employer
};
