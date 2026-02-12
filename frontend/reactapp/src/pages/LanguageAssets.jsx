import React, { useState, useEffect } from 'react';
import { validateLanguageScript } from '../utils/languageUtils';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Search, Play, Volume2, Globe, ArrowLeft, BookOpen, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const LanguageAssets = () => {
    const { language } = useParams();
    const { t } = useTranslation();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchAssets();
    }, [language]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            // Fetching all and filtering client side for now as per plan
            const res = await axios.get(`http://localhost:8080/api/v1/search?query=`);
            const verified = res.data.filter(a =>
                a.status === 'verified' &&
                a.languageName.toLowerCase() === language.toLowerCase() &&
                validateLanguageScript(a.transcript, language)
            );
            setAssets(verified);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = (url) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(err => console.error("Error playing audio:", err));
    };

    const playTTS = (text, lang = 'en-US') => {
        if (!text) return;
        if ('speechSynthesis' in window) {
            // Use Web Speech API for text-to-speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9;
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Text-to-speech not supported in this browser');
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.transcript.toLowerCase().includes(query.toLowerCase()) ||
        (asset.englishTranslation && asset.englishTranslation.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 container mx-auto">
            <div className="mb-8">
                <Link to="/learn" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-4">
                    <ArrowLeft size={20} /> {t('back_to_languages')}
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
                            {language} <span className="text-orange-500">Collection</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {assets.length} {assets.length === 1 ? t('entry') : t('entries')} available
                        </p>
                    </div>

                    <div className="relative group w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                            placeholder={`Search in ${language}...`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">{t('no_assets_found')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or contribute new content!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAssets.map((asset, idx) => (
                        <motion.div
                            key={asset.assetId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl dark:shadow-black/40 border border-gray-100 dark:border-gray-700"
                        >
                            {/* Card Header Illustration */}
                            <div className="h-24 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform rotate-12">
                                    <Globe size={80} className="text-orange-500 dark:text-gray-400" />
                                </div>
                                <div className="absolute bottom-3 left-6 flex gap-2">
                                    <span className="inline-block bg-white/50 dark:bg-black/20 backdrop-blur-sm text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-lg">
                                        {asset.languageName}
                                    </span>
                                    {asset.targetLanguage && (
                                        <span className="inline-block bg-blue-100/50 dark:bg-blue-900/20 backdrop-blur-sm text-blue-600 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-lg">
                                            → {asset.targetLanguage}
                                        </span>
                                    )}
                                    {asset.dialect && (
                                        <span className="inline-block bg-gray-100/50 dark:bg-gray-900/20 backdrop-blur-sm text-gray-500 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded-lg">
                                            {asset.dialect}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 pt-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 w-full">
                                        <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed font-serif italic text-lg mb-2">"{asset.transcript}"</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                <BookOpen size={12} /> {t('native_script')}
                                            </div>
                                            {asset.audioUrl && (
                                                <button
                                                    onClick={() => playAudio(asset.audioUrl)}
                                                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center"
                                                >
                                                    <Play size={14} fill="currentColor" className="ml-0.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {asset.englishTranslation && (
                                    <div className="pl-4 border-l-2 border-orange-200 dark:border-gray-600 mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('translation_label')}</h4>
                                            <button onClick={() => playTTS(asset.englishTranslation)} className="text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-bold">
                                                <Volume2 size={14} /> {t('listen')}
                                            </button>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{asset.englishTranslation}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
