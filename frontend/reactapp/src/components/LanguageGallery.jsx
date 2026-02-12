import React, { useState, useEffect } from 'react';
import { validateLanguageScript } from '../utils/languageUtils';
import { getNativeLanguageName } from '../utils/languageNames';
import axios from 'axios';
import { Search, Globe, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const LanguageGallery = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [groupedAssets, setGroupedAssets] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const url = query
                ? `http://localhost:8080/api/v1/search?query=${query}`
                : `http://localhost:8080/api/v1/search?query=`;

            const res = await axios.get(url);
            const verified = res.data.filter(a => a.status === 'verified');

            // Group by language
            const grouped = verified.reduce((acc, asset) => {
                const lang = asset.languageName || t('unknown_language');

                // Strict script validation
                if (!validateLanguageScript(asset.transcript, lang)) {
                    return acc;
                }

                if (!acc[lang]) acc[lang] = [];
                acc[lang].push(asset);
                return acc;
            }, {});

            setGroupedAssets(grouped);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Search Bar - Floating */}
            <div className="max-w-3xl mx-auto mb-20 relative z-20">
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center p-3 border border-white/20">
                        <Search className="text-gray-400 ml-4" size={24} />
                        <input
                            type="text"
                            className="flex-1 pl-4 pr-4 py-3 bg-transparent outline-none text-lg text-gray-700 dark:text-gray-200 placeholder-gray-400"
                            placeholder={t('search_placeholder')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Sparkles size={18} /> {t('search')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Language Cards Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : Object.keys(groupedAssets).length === 0 ? (
                <div className="text-center py-24 glass-card border-dashed bg-white/50 dark:bg-gray-800/50">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe size={48} className="text-gray-300 dark:text-gray-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">{t('no_assets_found')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">{t('no_assets_desc')}</p>
                    <a href="/contribute" className="btn-primary inline-flex items-center gap-2">
                        {t('contribute_now')} <ArrowRight size={20} />
                    </a>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {Object.entries(groupedAssets).map(([language, assets]) => {
                        const nativeName = getNativeLanguageName(language);
                        const displayName = nativeName === language ? language : nativeName;

                        return (
                            <Link
                                key={language}
                                to={`/learn/${language}`}
                                className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl dark:shadow-black/40 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                            >
                                {/* Decorative Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                                <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                                {/* Content */}
                                <div className="relative p-8 flex flex-col h-full z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                                            <span className="text-2xl font-bold">{displayName.charAt(0)}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                            <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-300">
                                            {displayName}
                                        </h3>
                                        {nativeName !== language && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                                {language}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium">
                                            <BookOpen size={18} />
                                            <span>{assets.length} {assets.length === 1 ? t('entry') : t('entries')}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
