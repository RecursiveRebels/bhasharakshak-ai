// Language name mappings: English -> Native Script
export const LANGUAGE_NATIVE_NAMES = {
    // Constitutional Languages
    "Assamese": "অসমীয়া",
    "Bengali": "বাংলা",
    "Bodo": "बड़ो",
    "Dogri": "डोगरी",
    "English": "English",
    "Gujarati": "ગુજરાતી",
    "Hindi": "हिन्दी",
    "Kannada": "ಕನ್ನಡ",
    "Kashmiri": "کٲشُر",
    "Konkani": "कोंकणी",
    "Maithili": "मैथिली",
    "Malayalam": "മലയാളം",
    "Manipuri": "মৈতৈলোন্",
    "Marathi": "मराठी",
    "Nepali": "नेपाली",
    "Odia": "ଓଡ଼ିଆ",
    "Punjabi": "ਪੰਜਾਬੀ",
    "Sanskrit": "संस्कृतम्",
    "Santali": "ᱥᱟᱱᱛᱟᱲᱤ",
    "Sindhi": "سنڌي",
    "Tamil": "தமிழ்",
    "Telugu": "తెలుగు",
    "Urdu": "اردو",

    // Tribal and Regional Languages
    "Adi": "Adi",
    "Aka": "Aka",
    "Angami": "Angami",
    "Ao": "Ao",
    "Apatani": "Apatani",
    "Bhutia": "Bhutia",
    "Bishnupriya Manipuri": "Bishnupriya Manipuri",
    "Bugun": "Bugun",
    "Chakma": "𑄌𑄋𑄴𑄟𑄳𑄦",
    "Chang": "Chang",
    "Deori": "Deori",
    "Dimasa": "Dimasa",
    "Garo": "Garo",
    "Hajong": "Hajong",
    "Hmar": "Hmar",
    "Karbi": "Karbi",
    "Khasi": "Khasi",
    "Khamti": "Khamti",
    "Koch": "Koch",
    "Kokborok": "Kokborok",
    "Konyak": "Konyak",
    "Kuki": "Kuki",
    "Ladakhi": "Ladakhi",
    "Lepcha": "Lepcha",
    "Limbu": "Limbu",
    "Lotha": "Lotha",
    "Lushai": "Lushai",
    "Meitei": "ꯃꯩꯇꯩꯂꯣꯟ",
    "Mishing": "Mishing",
    "Mishmi": "Mishmi",
    "Mizo": "Mizo",
    "Monpa": "Monpa",
    "Munda": "Munda",
    "Nocte": "Nocte",
    "Nyishi": "Nyishi",
    "Phom": "Phom",
    "Rabha": "Rabha",
    "Rengma": "Rengma",
    "Sangtam": "Sangtam",
    "Sherdukpen": "Sherdukpen",
    "Singpho": "Singpho",
    "Sumi": "Sumi",
    "Tagin": "Tagin",
    "Tangkhul": "Tangkhul",
    "Tangsa": "Tangsa",
    "Tiwa": "Tiwa",
    "Tripuri": "Tripuri",
    "Wancho": "Wancho",
    "Yimkhiung": "Yimkhiung",
    "Zeme": "Zeme"
};

/**
 * Get native script name for a language
 * @param {string} englishName - English name of the language
 * @returns {string} Native script name or English name if not found
 */
export const getNativeLanguageName = (englishName) => {
    return LANGUAGE_NATIVE_NAMES[englishName] || englishName;
};

/**
 * Get display name with both English and native script
 * @param {string} englishName - English name of the language
 * @param {boolean} nativeFirst - Show native script first
 * @returns {string} Combined display name
 */
export const getLanguageDisplayName = (englishName, nativeFirst = true) => {
    const nativeName = LANGUAGE_NATIVE_NAMES[englishName];

    if (!nativeName || nativeName === englishName) {
        return englishName;
    }

    return nativeFirst ? `${nativeName} (${englishName})` : `${englishName} (${nativeName})`;
};
