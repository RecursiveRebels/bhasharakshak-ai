import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Mic, Globe, BookOpen, User, Shield, Sun, Moon, PanelLeft, PanelLeftClose, ChevronDown, HelpCircle, Languages, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useTutorial } from '../context/TutorialContext';
import { getBadges } from '../services/GamificationService';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '../context/SidebarContext';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' }
];

export const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { startTutorial } = useTutorial();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { isCollapsed, setIsCollapsed } = useSidebar(); // Use context instead of local state
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const badges = getBadges();
    const topBadge = badges.length > 0 ? badges[badges.length - 1] : null;

    const isActive = (path) => location.pathname === path;

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        setLangMenuOpen(false);
    };

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const navItems = [
        { path: '/', label: t('home'), icon: Home },
        { path: '/contribute', label: t('contribute'), icon: Mic },
        { path: '/translate', label: t('translate'), icon: Globe },
        { path: '/learn', label: t('learn'), icon: BookOpen },
        { path: '/my-collections', label: t('my_collections') || 'My Collections', icon: User },
    ];

    return (
        <>
            {/* Top Right Actions */}
            <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'lg:right-6' : 'lg:right-6'
                }`}>
                {/* Rank Badge */}
                {topBadge && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 shadow-lg">
                        <span className="text-xl">{topBadge.icon}</span>
                        <span className="hidden sm:inline text-xs font-bold text-amber-900 dark:text-amber-300">
                            {topBadge.name}
                        </span>
                    </div>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-gray-600 dark:text-gray-400"
                >
                    {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop Collapse Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden lg:block fixed top-6 z-50 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'left-6' : 'left-[264px]'
                    }`}
            >
                {isCollapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Side Navigation */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isCollapsed ? 'lg:w-20' : 'w-72'
                    }`}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0">
                            <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                    BhashaRakshak
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                                    AI for All
                                </p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {navItems.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setIsOpen(false)}
                                className="relative group block"
                                title={isCollapsed ? label : ''}
                            >
                                {isActive(path) && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(path)
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}>
                                    <Icon size={20} strokeWidth={2.5} className="flex-shrink-0" />
                                    {!isCollapsed && (
                                        <>
                                            <span className="font-semibold text-sm flex-1">{label}</span>
                                            {isActive(path) && (
                                                <ChevronRight size={16} className="text-indigo-600 dark:text-indigo-400" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    {/* Help */}
                    <button
                        onClick={startTutorial}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title={isCollapsed ? t('start_tutorial') : ''}
                    >
                        <HelpCircle size={20} strokeWidth={2.5} className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-semibold text-sm">{t('start_tutorial')}</span>}
                    </button>

                    {/* Language Selector */}
                    {!isCollapsed && (
                        <div className="relative">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <Languages size={20} strokeWidth={2.5} />
                                <span className="font-semibold text-sm flex-1 text-left">
                                    {currentLang.native}
                                </span>
                                <span className="text-xs font-bold uppercase opacity-60">
                                    {currentLang.code}
                                </span>
                            </button>

                            <AnimatePresence>
                                {langMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="p-2 max-h-80 overflow-y-auto">
                                            {LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${currentLang.code === lang.code
                                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    <p className="font-semibold text-sm">{lang.native}</p>
                                                    <p className="text-xs opacity-60">{lang.label}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Collapsed Language Icon */}
                    {isCollapsed && (
                        <button
                            className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title={currentLang.native}
                        >
                            <Languages size={20} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};
