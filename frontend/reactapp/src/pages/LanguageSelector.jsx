import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Globe, ArrowRight } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

export const LanguageSelector = ({ onComplete }) => {
    const { i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

    const handleLanguageChange = (langCode) => {
        setSelectedLang(langCode);
        i18n.changeLanguage(langCode);
    };

    const handleContinue = () => {
        localStorage.setItem('hasSeenLanguageSelector', 'true');
        onComplete();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-block p-3 bg-white/5 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
                        <Globe size={32} className="text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Namaste! <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Welcome</span>
                    </h1>
                    <p className="text-xl text-gray-400">Select your preferred language to continue</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {languages.map((lang) => (
                        <motion.button
                            key={lang.code}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`
                relative p-6 rounded-2xl border transition-all duration-300 text-left group
                ${selectedLang === lang.code
                                    ? 'bg-blue-600/20 border-blue-500 shadow-xl shadow-blue-900/20'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'}
              `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-medium uppercase tracking-wider ${selectedLang === lang.code ? 'text-blue-300' : 'text-gray-500'}`}>
                                    {lang.name}
                                </span>
                                {selectedLang === lang.code && (
                                    <div className="bg-blue-500 rounded-full p-1">
                                        <Check size={12} className="text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            <div className={`text-3xl font-bold ${selectedLang === lang.code ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                {lang.native}
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContinue}
                        className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                    >
                        Continue <ArrowRight size={20} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
