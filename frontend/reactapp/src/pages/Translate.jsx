import React from 'react';
import { TranslationPanel } from '../components/TranslationPanel';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Translate = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-28 pb-12 px-4 container mx-auto min-h-screen flex flex-col relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-indigo/10 dark:bg-brand-indigo/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6"
            >
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100 dark:border-indigo-800">
                        <Globe2 size={14} /> {t('collaborative_workspace')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                        {t('translate_verify')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">{t('verify')}</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl font-light">
                        {t('translate_desc')}
                    </p>
                </div>

                {/* Stats or Decorative Badge */}
                <div className="hidden md:block">
                    <div className="flex -space-x-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700" />
                        ))}
                        <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                            +2k
                        </div>
                    </div>
                    <p className="text-right text-xs text-gray-400 font-bold mt-2 uppercase tracking-wide">{t('active_contributors')}</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 relative z-10"
                id="translation-panel"
            >
                <TranslationPanel />
            </motion.div>
        </div>
    );
};
