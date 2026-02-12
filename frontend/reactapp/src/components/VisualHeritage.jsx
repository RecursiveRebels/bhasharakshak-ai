import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const LANGUAGES = [
    { code: 'English', label: 'English' },
    { code: 'Hindi', label: 'Hindi' },
    { code: 'Tamil', label: 'Tamil' },
    { code: 'Telugu', label: 'Telugu' },
    { code: 'Kannada', label: 'Kannada' },
    { code: 'Malayalam', label: 'Malayalam' },
    { code: 'Bengali', label: 'Bengali' },
    { code: 'Gujarati', label: 'Gujarati' },
    { code: 'Marathi', label: 'Marathi' },
    { code: 'Dogri', label: 'Dogri' }
];

export const VisualHeritage = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedLang, setSelectedLang] = useState('English');
    const [region, setRegion] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async (selectedFile) => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/visual-heritage/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000 // 30 second timeout
            });
            if (response.data && response.data.description) {
                setDescription(response.data.description);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            if (error.code === 'ECONNABORTED') {
                setErrorMessage('AI analysis timed out. You can still enter a description manually.');
            } else {
                setErrorMessage('AI analysis failed. Please enter details manually.');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setUploadStatus(null);
            handleAnalyze(selectedFile);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setUploadStatus(null);
            handleAnalyze(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        setDescription('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title || !description) return;

        setIsUploading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('language', selectedLang);
        formData.append('region', region);

        try {
            await axios.post('http://localhost:8080/api/v1/visual-heritage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('success');
            // Reset form after delay
            setTimeout(() => {
                setFile(null);
                setPreview(null);
                setTitle('');
                setDescription('');
                setRegion('');
                setUploadStatus(null);
            }, 3000);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to upload. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <ImageIcon className="text-indigo-500" />
                {t('visual_heritage_title') || 'Visual Heritage'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t('visual_heritage_desc') || 'Preserve rare scripts, manuscripts, and cultural images for future generations.'}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div className="space-y-4">
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all ${preview
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
                            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        {preview ? (
                            <div className="relative w-full h-full p-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain rounded-xl"
                                />
                                <button
                                    onClick={removeFile}
                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {t('drag_drop_image') || 'Drag & Drop Image'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {t('or_click_browse') || 'or click to browse from device'}
                                </p>
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
                                >
                                    {t('browse_files') || 'Browse Files'}
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {t('title') || 'Title / Name of Script'}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
                            placeholder="e.g. Ancient Tamil Palm Leaf"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                            <span>{t('description') || 'Description (in any language)'}</span>
                            {isAnalyzing && <span className="text-xs text-indigo-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Generating description...</span>}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all resize-none ${isAnalyzing ? 'opacity-50' : ''}`}
                            placeholder={isAnalyzing ? "AI is analyzing the image..." : "Describe what is in the image..."}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('language_of_desc') || 'Language of Description'}
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all appearance-none"
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                                    ))}
                                </select>
                                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t('region') || 'Region / Origin'} (Optional)
                            </label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
                                placeholder="e.g. Madurai, India"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isUploading || !file || !title || !description}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${uploadStatus === 'success'
                                ? 'bg-green-500 text-white'
                                : uploadStatus === 'error'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/25'
                                } ${isUploading || !file ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="animate-spin" /> {t('uploading') || 'Processing...'}
                                </>
                            ) : uploadStatus === 'success' ? (
                                <>
                                    <CheckCircle /> {t('contribution_received') || 'Contribution Received!'}
                                </>
                            ) : uploadStatus === 'error' ? (
                                <>
                                    <AlertCircle /> {t('upload_failed') || 'Upload Failed'}
                                </>
                            ) : (
                                t('submit_contribution') || 'Submit Contribution'
                            )}
                        </button>

                        {uploadStatus === 'error' && (
                            <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
                        )}

                        {uploadStatus === 'success' && (
                            <p className="text-green-500 text-sm text-center mt-2">
                                {t('translation_in_progress') || 'Your image is uploaded and translations are being generated!'}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
