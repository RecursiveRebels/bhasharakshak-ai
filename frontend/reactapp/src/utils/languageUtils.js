/**
 * Utility to validate if the text contains script characters for the given language.
 * This helps ensure we don't show English text in a Tamil container, etc.
 */

export const LANGUAGE_MAPPING = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'bn': 'Bengali',
    'gu': 'Gujarati',
    'mr': 'Marathi',
    'or': 'Odia',
    'pa': 'Punjabi',
    'as': 'Assamese',
    'ur': 'Urdu',
    'sa': 'Sanskrit'
};

/**
 * Helper to get full language name from ISO code
 * @param {string} code - ISO language code (e.g. 'hi', 'en')
 * @returns {string|null} - Full name (e.g. 'Hindi') or null if not found
 */
export const getLanguageNameFromCode = (code) => {
    if (!code) return null;
    return LANGUAGE_MAPPING[code.toLowerCase()] || null;
};

const SCRIPT_RANGES = {
    // Tamil: U+0B80–U+0BFF
    tamil: /[\u0B80-\u0BFF]/,
    // Bengali: U+0980–U+09FF
    bengali: /[\u0980-\u09FF]/,
    // Devanagari (Hindi, Marathi, Sanskrit): U+0900–U+097F
    hindi: /[\u0900-\u097F]/,
    marathi: /[\u0900-\u097F]/,
    sanskrit: /[\u0900-\u097F]/,
    // Gujarati: U+0A80–U+0AFF
    gujarati: /[\u0A80-\u0AFF]/,
    // Telugu: U+0C00–U+0C7F
    telugu: /[\u0C00-\u0C7F]/,
    // Kannada: U+0C80–U+0CFF
    kannada: /[\u0C80-\u0CFF]/,
    // Malayalam: U+0D00–U+0D7F
    malayalam: /[\u0D00-\u0D7F]/,
    // English (Latin): Basic Latin and Latin-1 Supplement
    english: /[a-zA-Z]/
};

/**
 * Checks if the text strictly matches the script of the provided language.
 * Logic: Returns true if the text contains at least one character from the target language's script.
 * We can make this stricter (e.g. >50% chars) if needed, but existence check is a good start.
 * 
 * @param {string} text - The text to validate (e.g. the transcript)
 * @param {string} languageName - The name of the language (case-insensitive)
 * @returns {boolean} - True if valid or if language is unknown/unsupported
 */
export const validateLanguageScript = (text, languageName) => {
    if (!text || !languageName) return true;

    const langKey = languageName.toLowerCase();
    const regex = SCRIPT_RANGES[langKey];

    // If we don't have a regex for this language, we assume it's valid (fail open)
    // or if the user wants strictness, maybe fail closed?
    // For now, let's fail open to avoid hiding valid content for languages we haven't defined yet.
    if (!regex) return true;

    return regex.test(text);
};
