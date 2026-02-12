import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getUserId } from '../services/userService';
import axios from 'axios';
import { Trash2, Globe, Play, Pause, Lock, Unlock, AlertCircle } from 'lucide-react';
import { getLanguageNameFromCode } from '../utils/languageUtils';

export const MyCollections = () => {
    const { t, i18n } = useTranslation();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const [audioElement, setAudioElement] = useState(null);
    const userId = getUserId();

    useEffect(() => {
        fetchMyCollections();
    }, [i18n.language]);

    const fetchMyCollections = async () => {
        setLoading(true);
        console.log('=== FETCHING MY COLLECTIONS ===');
        console.log('userId:', userId);

        const currentLangName = getLanguageNameFromCode(i18n.language);
        let apiUrl = `http://localhost:8080/api/v1/my-collections?userId=${userId}`;

        if (currentLangName) {
            apiUrl += `&language=${currentLangName}`;
        }

        console.log('API URL:', apiUrl);

        try {
            const response = await axios.get(apiUrl);
            console.log('Response data:', response.data);
            console.log('Number of collections:', response.data.length);
            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
            console.error('Error response:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (assetId) => {
        if (!window.confirm(t('confirm_delete') || 'Are you sure you want to delete this recording?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/v1/my-collections/${assetId}?userId=${userId}`);
            setCollections(collections.filter(c => c.assetId !== assetId));
        } catch (error) {
            console.error('Error deleting asset:', error);
            alert(t('delete_error') || 'Failed to delete recording');
        }
    };

    const handleMakePublic = async (assetId) => {
        if (!window.confirm(t('confirm_make_public') || 'Make this recording public? It will be shared with everyone after verification.')) {
            return;
        }

        try {
            await axios.patch(`http://localhost:8080/api/v1/my-collections/${assetId}/make-public?userId=${userId}`);
            // Remove from private collections
            setCollections(collections.filter(c => c.assetId !== assetId));
            alert(t('made_public_success') || 'Recording is now public and pending verification!');
        } catch (error) {
            console.error('Error making public:', error);
            alert(t('make_public_error') || 'Failed to make recording public');
        }
    };

    const togglePlay = (audioUrl, assetId) => {
        if (playingId === assetId && audioElement) {
            audioElement.pause();
            setPlayingId(null);
        } else {
            if (audioElement) {
                audioElement.pause();
            }
            const audio = new Audio(audioUrl);
            audio.play();
            audio.onended = () => setPlayingId(null);
            setAudioElement(audio);
            setPlayingId(assetId);
        }
    };

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
                    className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold text-sm mb-4"
                >
                    <Lock size={14} className="inline mr-2" />
                    {t('private_space') || 'Private Space'}
                </motion.span>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold mb-6"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-shimmer bg-[length:200%_100%]">
                        {t('my_collections') || 'My Collections'}
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                    {t('my_collections_desc') || 'Your private recordings, visible only to you'}
                </motion.p>
            </motion.div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : collections.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 glass-card border-dashed bg-white/50 dark:bg-gray-800/50"
                >
                    <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={48} className="text-purple-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {t('no_private_collections') || 'No Private Collections Yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        {t('no_private_collections_desc') || 'Recordings you create without consent will appear here'}
                    </p>
                    <a href="/contribute" className="btn-primary inline-flex items-center gap-2">
                        {t('start_recording') || 'Start Recording'}
                    </a>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="my-collections-list">
                    {collections.map((asset, index) => (
                        <motion.div
                            key={asset.assetId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 hover:-translate-y-1 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {asset.languageName}
                                    </h3>
                                    {asset.dialect && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {asset.dialect}
                                        </p>
                                    )}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Lock size={18} className="text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                    {asset.transcript || t('no_transcript') || 'No transcript available'}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => togglePlay(asset.audioUrl, asset.assetId)}
                                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {playingId === asset.assetId ? (
                                        <><Pause size={16} /> {t('pause') || 'Pause'}</>
                                    ) : (
                                        <><Play size={16} /> {t('play') || 'Play'}</>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleMakePublic(asset.assetId)}
                                    className="px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30 transition-all"
                                    title={t('make_public') || 'Make Public'}
                                >
                                    <Unlock size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(asset.assetId)}
                                    className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                                    title={t('delete') || 'Delete'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(asset.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
