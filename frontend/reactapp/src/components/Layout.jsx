import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '../context/SidebarContext';

export const Layout = ({ children }) => {
    const location = useLocation();
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-transparent relative">
            <Navbar />
            <div className={`flex-grow flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                }`}>
                <main className="flex-grow w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
                <Footer />
            </div>
        </div>
    );
};
