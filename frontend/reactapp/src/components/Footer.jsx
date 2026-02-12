import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="relative mt-20 pt-20 pb-10 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/90 dark:to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="glass-card p-10 md:p-16 rounded-[2.5rem] border-white/40 dark:border-white/5 relative overflow-hidden">
                    {/* Decorative Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="grid md:grid-cols-4 gap-12 relative z-10">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <Link to="/" className="flex items-center gap-3 mb-6 group">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 transform group-hover:rotate-12 transition-transform duration-300">
                                    <Sparkles size={24} fill="currentColor" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    BhashaRakshak
                                </span>
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                {t('footer_desc')}
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-110">
                                    <Github size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-400 hover:text-white transition-all transform hover:scale-110">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-700 hover:text-white transition-all transform hover:scale-110">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-6 tracking-wide">{t('platform')}</h4>
                                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    <li><Link to="/translate" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" /> {t('translate_verify')}</Link></li>
                                    <li><Link to="/contribute" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('donate_voice')}</Link></li>
                                    <li><Link to="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('learn')}</Link></li>
                                    <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('about_us')}</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-6 tracking-wide">{t('community')}</h4>
                                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('guidelines')}</a></li>
                                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('leaderboard')}</a></li>
                                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('partners')}</a></li>
                                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('api_access')}</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-6 tracking-wide">{t('legal')}</h4>
                                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('privacy_policy')}</a></li>
                                    <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('terms_of_service')}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
                        <p>© 2024 BhashaRakshak AI. Open Source Initiative.</p>
                        <p className="flex items-center gap-1">
                            {t('made_with_love')} <Heart size={14} className="text-pink-500 fill-current animate-pulse mx-1" /> {t('in_india')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
