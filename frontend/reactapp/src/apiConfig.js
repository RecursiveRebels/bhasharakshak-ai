
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    // Assume backend is always on port 8080 of the same host
    return `http://${hostname}:8080/api/v1`;
};

export const API_BASE_URL = getApiBaseUrl();
