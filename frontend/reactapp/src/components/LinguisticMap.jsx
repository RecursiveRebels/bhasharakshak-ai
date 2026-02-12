import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Loader, MapPin } from 'lucide-react';
import { fetchMapStats, clearMapStatsCache } from '../services/MapService';
import { INDIAN_REGIONS } from '../utils/regionData';

// India TopoJSON (Local)
const INDIA_TOPO_JSON = "/india.json";

// Default fallback markers (shown when no real data)
const DEFAULT_MARKERS = [
    { name: "New Delhi", language: "Hindi", coordinates: [77.1025, 28.7041], contributions: 0, region: "Delhi" },
    { name: "Mumbai", language: "Marathi", coordinates: [72.8777, 19.0760], contributions: 0, region: "Maharashtra" },
    { name: "Chennai", language: "Tamil", coordinates: [80.2707, 13.0827], contributions: 0, region: "Tamil Nadu" },
    { name: "Kolkata", language: "Bengali", coordinates: [88.3639, 22.5726], contributions: 0, region: "West Bengal" },
    { name: "Bangalore", language: "Kannada", coordinates: [77.5946, 12.9716], contributions: 0, region: "Karnataka" }
];

const MARKER_COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6', '#F97316'];

export const LinguisticMap = () => {
    const { t } = useTranslation();
    const [hoveredMarker, setHoveredMarker] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [markers, setMarkers] = useState(DEFAULT_MARKERS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch map data
    const loadMapData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchMapStats();

            if (data.cities && data.cities.length > 0) {
                // Convert backend data to marker format
                const newMarkers = data.cities.map(city => {
                    // Find coordinates from region data
                    const regionData = INDIAN_REGIONS.find(r => r.name === city.region);
                    const coords = regionData ? regionData.coordinates : [78, 20]; // Default center of India

                    return {
                        name: city.city,
                        language: city.primaryLanguage || "Unknown",
                        coordinates: city.latitude && city.longitude
                            ? [city.longitude, city.latitude]
                            : [coords[1], coords[0]], // Swap for [lng, lat]
                        contributions: city.count,
                        region: city.region
                    };
                });
                setMarkers(newMarkers);
            } else {
                // No data yet, use defaults
                setMarkers(DEFAULT_MARKERS);
            }

            setLastUpdated(new Date());
            setLoading(false);
        } catch (err) {
            console.error('Error loading map data:', err);
            setError(err.message);
            setLoading(false);
            // Keep showing default markers on error
            setMarkers(DEFAULT_MARKERS);
        }
    };

    // Load data on mount
    useEffect(() => {
        loadMapData();
    }, []);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadMapData();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Manual refresh
    const handleRefresh = () => {
        clearMapStatsCache();
        loadMapData();
    };

    const totalContributions = markers.reduce((sum, m) => sum + m.contributions, 0);

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        {t('mapping_voices')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">{t('voices')}</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('map_desc')}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{t('linguistic_map') || 'Linguistic Map'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {totalContributions > 0 ? `${totalContributions} contributions across ${markers.length} locations` : 'Explore language distribution'}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="text-sm font-semibold">Refresh</span>
                        </motion.button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Map Container */}
                        <div className="flex-1 relative">
                            <div className="h-[500px] relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner">
                                {/* Loading Overlay */}
                                {loading && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader size={32} className="animate-spin text-orange-500" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading map data...</p>
                                        </div>
                                    </div>
                                )}

                                <ComposableMap
                                    projection="geoMercator"
                                    projectionConfig={{
                                        scale: 1200,
                                        center: [82, 23]
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <Geographies geography={INDIA_TOPO_JSON}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={selectedRegion === geo.rsmKey ? "#fb923c" : "#e2e8f0"}
                                                    stroke="#cbd5e1"
                                                    strokeWidth={0.5}
                                                    style={{
                                                        default: { fill: selectedRegion === geo.rsmKey ? "#fb923c" : "#e2e8f0", outline: "none", transition: "all 250ms" },
                                                        hover: { fill: "#f97316", outline: "none", stroke: "#fff", strokeWidth: 1, cursor: "pointer" },
                                                        pressed: { fill: "#ea580c", outline: "none" }
                                                    }}
                                                    onClick={() => setSelectedRegion(selectedRegion === geo.rsmKey ? null : geo.rsmKey)}
                                                />
                                            ))
                                        }
                                    </Geographies>
                                    {markers.map(({ name, coordinates, language, contributions, region }, idx) => (
                                        <Marker key={name + idx} coordinates={coordinates}>
                                            <motion.g
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                                                onMouseEnter={() => setHoveredMarker(name)}
                                                onMouseLeave={() => setHoveredMarker(null)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {/* Pulsing ring effect */}
                                                <motion.circle
                                                    r={hoveredMarker === name ? 12 : 8}
                                                    fill={MARKER_COLORS[idx % MARKER_COLORS.length]}
                                                    fillOpacity={0.3}
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.3, 0, 0.3]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                {/* Main marker */}
                                                <motion.circle
                                                    r={hoveredMarker === name ? 8 : 6}
                                                    fill={MARKER_COLORS[idx % MARKER_COLORS.length]}
                                                    stroke="#fff"
                                                    strokeWidth={2}
                                                    animate={{
                                                        scale: hoveredMarker === name ? 1.2 : 1
                                                    }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                />
                                                {/* Label */}
                                                <text
                                                    textAnchor="middle"
                                                    y={-15}
                                                    style={{
                                                        fontFamily: "system-ui",
                                                        fill: hoveredMarker === name ? "#f97316" : "#475569",
                                                        fontSize: hoveredMarker === name ? "12px" : "10px",
                                                        fontWeight: "800",
                                                        transition: "all 200ms",
                                                        pointerEvents: "none"
                                                    }}
                                                >
                                                    {name}
                                                </text>
                                            </motion.g>
                                        </Marker>
                                    ))}
                                </ComposableMap>

                                {/* Interactive Tooltip */}
                                <AnimatePresence>
                                    {hoveredMarker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 min-w-[250px]"
                                        >
                                            <div className="text-center">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                                    {markers.find(m => m.name === hoveredMarker)?.name}
                                                </h3>
                                                <p className="text-orange-600 dark:text-orange-400 font-semibold mb-2">
                                                    {markers.find(m => m.name === hoveredMarker)?.language}
                                                </p>
                                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className={`w-2 h-2 rounded-full ${markers.find(m => m.name === hoveredMarker)?.contributions > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                    <span>{markers.find(m => m.name === hoveredMarker)?.contributions} contributions</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Footer with last updated */}
                                <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                                    🗺️ {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-xs border border-red-200 dark:border-red-800">
                                        Error loading data. Showing defaults.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Legend Sidebar */}
                        <div className="lg:w-64 flex flex-col gap-4">
                            <div>
                                <h5 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                    <MapPin size={16} className="text-orange-500" />
                                    Active Locations
                                </h5>
                                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                                    {markers.map((marker, index) => (
                                        <motion.div
                                            key={`legend-${index}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onMouseEnter={() => setHoveredMarker(marker.name)}
                                            onMouseLeave={() => setHoveredMarker(null)}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${hoveredMarker === marker.name
                                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 shadow-md'
                                                : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                } border`}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0 shadow-md"
                                                style={{
                                                    background: `linear-gradient(to bottom, ${MARKER_COLORS[index % MARKER_COLORS.length]}, ${MARKER_COLORS[index % MARKER_COLORS.length]}dd)`
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {marker.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {marker.language}
                                                </p>
                                            </div>
                                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                {marker.contributions}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </section>
    );
};


