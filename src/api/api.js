// src/api/api.js
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_BACKEND_URL,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const apiRequest = async (endpoint, method, body = null, customHeaders = {}) => {
    const headers = {
        ...API_CONFIG.HEADERS,
        ...customHeaders
    };

    const config = {
        method,
        headers
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);

    let result;
    try {
        result = await response.json();
    } catch (err) {
        result = {};
    }

    if (!response.ok) {
        throw new Error(result.message || 'API request failed');
    }

    console.log("response from api:", result);
    return result;
};

// User API functions
export const loginUser = (email, password) =>
    apiRequest('/user/login', 'POST', { email, password });

export const registerUser = (userData) =>
    apiRequest('/user/register', 'POST', userData);

export const fetchUserProfile = () => {
    const token = localStorage.getItem('token');
    return apiRequest('/user/profile', 'GET', null, {
        'Authorization': `Bearer ${token}`
    });
};

export const publishJourney = (journeyData) => {
    const token = localStorage.getItem('token');
    return apiRequest('/user/createjourney', 'POST', journeyData, {
        'Authorization': `Bearer ${token}`
    });
};

export const fetchAllJourneys = () =>
    apiRequest('/user/all-journey', 'GET');

export const updateUserProfile = (updatedData) => {
    const token = localStorage.getItem('token');
    return apiRequest('/user/update', 'PUT', updatedData, {
        'Authorization': `Bearer ${token}`
    });
};


export const getDriverProfile = (id) => {
    const token = localStorage.getItem('token');
    return apiRequest(`/user/get-journeyby-id/${id}`, 'GET', null, {
        'Authorization': `Bearer ${token}`
    });
}


