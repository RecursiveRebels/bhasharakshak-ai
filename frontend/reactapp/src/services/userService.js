import { v4 as uuidv4 } from 'uuid';

/**
 * Get or generate a unique user ID for private collections
 * Stored in localStorage for persistence across sessions
 */
export const getUserId = () => {
    let userId = localStorage.getItem('bhasharakshak_user_id');

    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('bhasharakshak_user_id', userId);
        console.log('Generated new user ID:', userId);
    }

    return userId;
};

/**
 * Clear user ID (for testing or logout)
 */
export const clearUserId = () => {
    localStorage.removeItem('bhasharakshak_user_id');
};

/**
 * Check if user has an ID
 */
export const hasUserId = () => {
    return !!localStorage.getItem('bhasharakshak_user_id');
};
