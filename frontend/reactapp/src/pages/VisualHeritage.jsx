import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Globe, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
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
    const [heritageItems, setHeritageItems] = useState([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(true);
    const [error, setError] = useState(null);

    // Fetch gallery items
    React.useEffect(() => {
        fetchHeritageItems();
    }, []);

    const fetchHeritageItems = async () => {
        try {
            setError(null);
            const response = await axios.get('http://localhost:8080/api/v1/visual-heritage');
            setHeritageItems(response.data);
        } catch (error) {
            console.error('Failed to fetch heritage items:', error);
            setError('Unable to connect to the server. Please check your connection.');
        } finally {
            setIsLoadingGallery(false);
        }
    };

    // Refresh gallery after successful upload
    React.useEffect(() => {
        if (uploadStatus === 'success') {
            fetchHeritageItems();
        }
    }, [uploadStatus]);

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

    const handleDelete = async (id) => {
        const pin = prompt("Enter Admin PIN to confirm deletion:");
        if (!pin) return;

        try {
            await axios.delete(`http://localhost:8080/api/v1/visual-heritage/${id}`, {
                headers: { 'X-Admin-Pin': pin }
            });
            // Optimistic update
            setHeritageItems(prev => prev.filter(item => item.id !== id));
            alert("Heritage item deleted successfully.");
        } catch (error) {
            console.error("Delete failed:", error);
            if (error.response?.status === 403) {
                alert("Access Denied: Invalid PIN");
            } else {
                alert("Failed to delete item. Please try again.");
            }
        }
    };

    const handleVerify = async (id) => {
        const pin = prompt("Enter Admin PIN to verify this item:");
        if (!pin) return;

        try {
            const res = await axios.patch(`http://localhost:8080/api/v1/visual-heritage/${id}/verify`, {}, {
                headers: { 'X-Admin-Pin': pin }
            });
            // Optimistic update
            setHeritageItems(prev => prev.map(item =>
                item.id === id ? { ...item, status: 'verified', updatedAt: new Date().toISOString() } : item
            ));
            alert("Heritage item verified successfully.");
        } catch (error) {
            console.error("Verification failed:", error);
            if (error.response?.status === 403) {
                alert("Access Denied: Invalid PIN");
            } else {
                alert("Failed to verify item. Please try again.");
            }
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <ImageIcon className="text-indigo-500" />
                {t('visual_heritage_title') || 'Visual Heritage'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                {t('visual_heritage_desc') || 'Preserve rare scripts, manuscripts, and cultural images for future generations.'}
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
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
                <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
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
                                {t('language_of_desc') || 'Language'}
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
                                {t('region') || 'Region'} (Optional)
                            </label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
                                placeholder="e.g. Madurai"
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
                                    <CheckCircle /> {t('contribution_received') || 'Received!'}
                                </>
                            ) : uploadStatus === 'error' ? (
                                <>
                                    <AlertCircle /> {t('upload_failed') || 'Failed'}
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
                                {t('translation_in_progress') || 'Image uploaded successfully!'}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            {/* Gallery Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('recent_contributions') || 'Recent Contributions'}
                </h3>

                {/* Loading State */}
                {isLoadingGallery ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
                        <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
                        <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">
                            {t('connection_error') || 'Connection Error'}
                        </h4>
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchHeritageItems}
                            className="px-6 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full font-medium transition-colors"
                        >
                            {t('try_again') || 'Try Again'}
                        </button>
                    </div>
                ) : heritageItems.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-800">
                        <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No contributions yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {heritageItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
                                        {item.language}
                                    </div>
                                    {item.region && (
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-gray-200 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                                            {item.region}
                                        </div>
                                    )}

                                    {/* Admin Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        {(item.status === 'pending' || !item.status) && (
                                            <button
                                                onClick={() => handleVerify(item.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all"
                                                title="Verify Asset"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all"
                                            title="Delete Asset"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1" title={item.title}>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                        {item.originalDescription}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <span>{(new Date(item.createdAt)).toLocaleDateString()}</span>
                                        <span className={`px-2 py-0.5 rounded-full ${(item.status === 'verified')
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {item.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
