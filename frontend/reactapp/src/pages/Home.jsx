import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mic, Globe, BookOpen, ArrowRight, PlayCircle, Heart, Sparkles } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

import { useTranslation } from 'react-i18next';
import { ImpactDashboard } from '../components/ImpactDashboard';
import { LinguisticMap } from '../components/LinguisticMap';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
            {/* Enhanced Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-[120px] -z-10 animate-float" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-[120px] -z-10 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '4s' }} />

            <div className="container mx-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="text-center max-w-4xl mx-auto px-4"
                >
                    {/* Enhanced Badge with Sparkle */}
                    <motion.div
                        variants={item}
                        className="mb-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-700/50 shadow-lg shadow-orange-500/10"
                    >
                        <Sparkles size={16} className="text-orange-500 animate-pulse" />
                        <span className="text-orange-600 dark:text-orange-400 font-bold text-xs md:text-sm tracking-wide uppercase">
                            {t('preserving_heritage')}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    </motion.div>

                    {/* Responsive Hero Title with clamp() */}
                    <motion.h1
                        variants={item}
                        className="font-black mb-6 tracking-tight text-gray-900 dark:text-white break-words"
                        style={{
                            fontSize: 'clamp(2rem, 5vw + 1rem, 4.5rem)',
                            lineHeight: '1.15',
                            wordBreak: 'break-word',
                            hyphens: 'auto'
                        }}
                    >
                        <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 dark:from-white dark:via-orange-400 dark:to-pink-400 bg-clip-text text-transparent inline-block">
                            {t('hero_title')}
                        </span>
                    </motion.h1>

                    {/* Responsive Description */}
                    <motion.p
                        variants={item}
                        className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-medium"
                        style={{
                            fontSize: 'clamp(1rem, 1vw + 0.5rem, 1.25rem)',
                            lineHeight: '1.7',
                            wordBreak: 'break-word'
                        }}
                    >
                        {t('hero_desc')}
                    </motion.p>

                    {/* Enhanced CTA Buttons */}
                    <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/contribute" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Mic size={24} className="relative z-10 group-hover:scale-110 transition-transform" />
                            <span className="relative z-10">{t('donate_voice')}</span>
                            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/learn" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-3 group">
                            <PlayCircle size={24} className="text-gray-400 dark:text-gray-400 group-hover:text-orange-500 transition-colors" />
                            <span>{t('explore_assets')}</span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Dashboard Section */}
                <ImpactDashboard />

                {/* Map Section */}
                <LinguisticMap />

                {/* Enhanced Feature Cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-8 mt-32"
                >
                    {[
                        { icon: Mic, title: t('feature_digitize_title'), desc: t('feature_digitize_desc'), color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', gradient: 'from-orange-500 to-pink-500' },
                        { icon: Globe, title: t('feature_translate_title'), desc: t('feature_translate_desc'), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', gradient: 'from-blue-500 to-cyan-500' },
                        { icon: BookOpen, title: t('feature_empower_title'), desc: t('feature_empower_desc'), color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', gradient: 'from-pink-500 to-purple-500' }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            className="glass-card p-10 relative group overflow-hidden"
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                            {/* Icon Container */}
                            <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10`}>
                                <feature.icon size={32} className={feature.color} />
                            </div>

                            {/* Title with Responsive Font */}
                            <h3
                                className="font-bold mb-3 text-gray-900 dark:text-white relative z-10"
                                style={{
                                    fontSize: 'clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)',
                                    lineHeight: '1.3',
                                    wordBreak: 'break-word',
                                    minHeight: '2.6em'
                                }}
                            >
                                {feature.title}
                            </h3>

                            {/* Description with Responsive Font */}
                            <p
                                className="text-gray-600 dark:text-gray-400 relative z-10"
                                style={{
                                    fontSize: 'clamp(0.9rem, 0.8vw + 0.4rem, 1.05rem)',
                                    lineHeight: '1.65',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {feature.desc}
                            </p>

                            {/* Background Icon */}
                            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                <feature.icon size={100} className="dark:text-white" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Enhanced Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 text-center pb-20"
                >
                    <p className="text-gray-400 font-medium flex items-center justify-center gap-2 text-lg">
                        Made with <Heart size={20} className="text-red-500 fill-current animate-pulse-glow" /> for India
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
