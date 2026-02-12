import React from 'react';
import { LanguageGallery } from '../components/LanguageGallery';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Learn = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-24 pb-12 px-4 container mx-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center max-w-4xl mx-auto mb-16"
            >
                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-block px-4 py-1 rounded-full bg-brand-amber/10 text-brand-amber border border-brand-amber/20 font-semibold text-sm mb-4"
                >
                    {t('knowledge_hub')}
                </motion.span>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold mb-6 relative"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white animate-shimmer bg-[length:200%_100%]">
                        {t('explore_heritage')}
                    </span>
                    {' '}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber via-orange-500 to-brand-teal animate-shimmer bg-[length:200%_100%]">{t('heritage')}</span>
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                    {t('learn_desc')}
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                id="language-gallery"
            >
                <LanguageGallery />
            </motion.div>
        </div>
    );
};
