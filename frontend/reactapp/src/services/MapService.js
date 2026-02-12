import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Cache for map stats (30 seconds)
let mapStatsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const fetchMapStats = async () => {
    const now = Date.now();

    // Return cached data if still valid
    if (mapStatsCache && (now - lastFetchTime) < CACHE_DURATION) {
        return mapStatsCache;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/map-stats`);
        mapStatsCache = response.data;
        lastFetchTime = now;
        return response.data;
    } catch (error) {
        console.error('Error fetching map stats:', error);
        // Return cached data if available, even if expired
        if (mapStatsCache) {
            return mapStatsCache;
        }
        throw error;
    }
};

// Clear cache manually (for refresh button)
export const clearMapStatsCache = () => {
    mapStatsCache = null;
    lastFetchTime = 0;
};
