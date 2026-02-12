import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pulsing marker icon
const createPulsingIcon = (color = '#F43F5E') => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="position: relative;">
                <div style="
                    width: 20px;
                    height: 20px;
                    background: ${color};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(244, 63, 94, 0.5);
                    animation: pulse 2s infinite;
                "></div>
            </div>
            <style>
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 15px rgba(244, 63, 94, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(244, 63, 94, 0);
                    }
                }
            </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });
};

// Language contribution locations (same as before)
const markers = [
    { id: 1, name: "New Delhi", language: "Hindi", coordinates: [28.7041, 77.1025], contributions: 1247 },
    { id: 2, name: "Dispur", language: "Assamese", coordinates: [26.1158, 91.7898], contributions: 432 },
    { id: 3, name: "Chennai", language: "Tamil", coordinates: [13.0827, 80.2707], contributions: 891 },
    { id: 4, name: "Mumbai", language: "Marathi", coordinates: [19.0760, 72.8777], contributions: 1056 },
    { id: 5, name: "Kohima", language: "Naga", coordinates: [25.6751, 94.1168], contributions: 234 }
];

export const LeafletMap = () => {
    const { t } = useTranslation();
    const [activeMarker, setActiveMarker] = useState(null);

    return (
        <>
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t('mapping_voices')} <span className="text-orange-500">{t('voices')}</span>
                        </h2>
                        <p className="text-gray-500">{t('map_desc')}</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-sm"
                    >
                        <MapContainer
                            center={[23.0, 82.0]}
                            zoom={5}
                            zoomControl={false}
                            style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
                            className="z-10"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                className="map-tiles"
                            />

                            <ZoomControl position="topright" />

                            {markers.map((marker) => (
                                <Marker
                                    key={marker.id}
                                    position={marker.coordinates}
                                    icon={createPulsingIcon()}
                                    eventHandlers={{
                                        click: () => setActiveMarker(marker.id),
                                    }}
                                >
                                    <Popup className="custom-popup">
                                        <div className="p-2 min-w-[200px]">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                                                {marker.name}
                                            </h3>
                                            <p className="text-orange-600 font-semibold mb-2">
                                                {marker.language}
                                            </p>
                                            <div className="text-sm text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    {marker.contributions} contributions
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        <div className="absolute bottom-4 left-6 text-xs text-gray-400 z-[1000] bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            🗺️ Interactive map powered by OpenStreetMap
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Global Styles for Leaflet */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-container {
                    font-family: inherit;
                }
                
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                }
                
                .leaflet-popup-tip {
                    background: white;
                }
                
                .custom-marker {
                    background: transparent;
                    border: none;
                }
                
                .dark .map-tiles {
                    filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9);
                }
                
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                }
                
                .leaflet-control-zoom a {
                    background: white !important;
                    color: #374151 !important;
                    border: none !important;
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                    font-size: 20px !important;
                    font-weight: bold !important;
                }
                
                .leaflet-control-zoom a:hover {
                    background: #f97316 !important;
                    color: white !important;
                }
                
                .dark .leaflet-control-zoom a {
                    background: #1f2937 !important;
                    color: white !important;
                }
                
                .dark .leaflet-control-zoom a:hover {
                    background: #f97316 !important;
                }
            `}} />
        </>
    );
};
