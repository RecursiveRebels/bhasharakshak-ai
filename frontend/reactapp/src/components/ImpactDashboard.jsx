import React, { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Mic } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6', '#F97316'];

export const ImpactDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalHours: 0,
        totalAssets: 0,
        languageCount: 0,
        distribution: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/v1/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
        // Poll every 30s for "Live" feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    // Calculate total for percentage
    const total = stats.distribution.reduce((sum, item) => sum + item.value, 0);

    // Custom label for pie chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Hide labels for small slices

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-bold text-sm"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom legend
    const CustomLegend = ({ payload }) => {
        return (
            <div className="grid grid-cols-2 gap-3 mt-6">
                {payload.map((entry, index) => (
                    <motion.div
                        key={`legend-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: entry.color }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {entry.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {entry.payload.value} {t('contributions') || 'contributions'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        {t('real_time_impact')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{t('impact')}</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('impact_desc')}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Stat Cards */}
                    <div className="grid gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-3xl border border-white/20 shadow-xl flex items-center justify-between"
                        >
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-1">{t('total_hours')}</p>
                                <h3 className="text-5xl font-black text-gray-900 dark:text-white">{stats.totalHours} <span className="text-lg text-green-500 font-bold">hrs</span></h3>
                            </div>
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <TrendingUp size={32} />
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-3xl border border-white/20 shadow-xl flex items-center justify-between"
                        >
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-1">{t('total_contributions_stats')}</p>
                                <h3 className="text-5xl font-black text-gray-900 dark:text-white">{stats.totalAssets} <span className="text-lg text-blue-500 font-bold">Clips</span></h3>
                            </div>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Users size={32} />
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-3xl border border-white/20 shadow-xl flex items-center justify-between"
                        >
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-1">{t('languages_covered')}</p>
                                <h3 className="text-5xl font-black text-gray-900 dark:text-white">{stats.languageCount} <span className="text-lg text-orange-500 font-bold">Dialects</span></h3>
                            </div>
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <Mic size={32} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Enhanced Donut Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700"
                    >
                        <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{t('language_distribution')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            {total > 0 ? `${total} total contributions across ${stats.distribution.length} languages` : 'No data yet'}
                        </p>

                        {stats.distribution.length > 0 ? (
                            <div className="flex flex-col items-center">
                                {/* Chart Container */}
                                <div className="h-[300px] w-full max-w-[300px] mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                {COLORS.map((color, index) => (
                                                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                        <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            <Pie
                                                data={stats.distribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomLabel}
                                                outerRadius={110}
                                                innerRadius={70}
                                                fill="#8884d8"
                                                dataKey="value"
                                                animationBegin={0}
                                                animationDuration={800}
                                            >
                                                {stats.distribution.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={`url(#gradient-${index % COLORS.length})`}
                                                        stroke="white"
                                                        strokeWidth={3}
                                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                    padding: '12px'
                                                }}
                                                formatter={(value, name) => [`${value} contributions`, name]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Custom Legend Below Chart */}
                                <div className="w-full">
                                    <div className="grid grid-cols-2 gap-4">
                                        {stats.distribution.map((entry, index) => (
                                            <motion.div
                                                key={`legend-${index}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform shadow-md"
                                                    style={{
                                                        background: `linear-gradient(to bottom, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}dd)`
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                        {entry.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {entry.value} {entry.value === 1 ? 'contribution' : 'contributions'}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {((entry.value / total) * 100).toFixed(0)}%
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Mic className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium">No language data available</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Start contributing to see the distribution</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
