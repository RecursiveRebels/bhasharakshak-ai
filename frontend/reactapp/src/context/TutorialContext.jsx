import React, { createContext, useContext, useEffect, useState } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const TutorialContext = createContext();

export const useTutorial = () => {
    return useContext(TutorialContext);
};

export const TutorialProvider = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [driverObj, setDriverObj] = useState(null);

    const driverConfig = {
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: t('done') || "Done",
        nextBtnText: t('next') || "Next",
        prevBtnText: t('previous') || "Previous",
        popoverClass: 'driver-popover', // Use our custom glassmorphism class
        onHighlightStarted: (element) => {
            if (element) {
                element.classList.add('driver-active-element');
            }
        },
        onDeselected: (element) => {
            if (element) {
                element.classList.remove('driver-active-element');
            }
        },
        onDestroyed: () => {
            // Cleanup any remaining active classes
            document.querySelectorAll('.driver-active-element').forEach(el => el.classList.remove('driver-active-element'));
        }
    };

    // Initialize driver
    useEffect(() => {
        const drive = driver(driverConfig);
        setDriverObj(drive);
    }, [t]);

    const startTutorial = () => {
        // Part 1: Home & Global Features
        const homeSteps = [
            {
                element: '#nav-logo',
                popover: {
                    title: t('welcome_title'),
                    description: t('welcome_desc'),
                    side: "bottom", align: 'start'
                }
            },
            {
                element: '#nav-home',
                popover: { title: t('home'), description: t('home_desc'), side: "right" }
            },
            {
                element: '#nav-rank-badge',
                popover: { title: t('your_rank'), description: t('rank_desc'), side: "bottom" }
            },
            {
                element: '#nav-theme-toggle',
                popover: { title: t('theme_toggle'), description: t('theme_desc'), side: "bottom" }
            },
            {
                element: '#nav-lang-selector',
                popover: { title: t('change_language'), description: t('change_lang_desc'), side: "bottom" }
            },
            {
                element: '#nav-contribute',
                popover: {
                    title: t('contribute'),
                    description: t('contribute_nav_desc'),
                    side: "right",
                    onNextClick: () => {
                        navigate('/contribute');
                        setTimeout(() => startContributeTour(), 800);
                        driverObj.destroy();
                    }
                }
            }
        ];

        driverObj.setConfig({
            ...driverConfig,
            steps: homeSteps,
            onDestroyed: () => { } // Prevent generic destroy from firing prematurely
        });
        driverObj.drive();
    };

    const startContributeTour = () => {
        const contributeSteps = [
            {
                element: '#contribute-recorder',
                popover: {
                    title: t('how_to_record'),
                    description: t('record_instruction'),
                    side: "left"
                }
            },
            {
                element: '#nav-translate',
                popover: {
                    title: t('translate'),
                    description: t('translate_nav_desc'),
                    side: "right",
                    onNextClick: () => {
                        navigate('/translate');
                        setTimeout(() => startTranslateTour(), 800);
                        driverObj.destroy();
                    }
                }
            }
        ];

        const drive = driver({
            ...driverConfig,
            steps: contributeSteps
        });
        drive.drive();
    };

    const startTranslateTour = () => {
        const translateSteps = [
            {
                element: '#translation-panel',
                popover: {
                    title: t('translation_panel'),
                    description: t('translate_panel_desc'),
                    side: "left"
                }
            },
            {
                element: '#nav-learn',
                popover: {
                    title: t('learn'),
                    description: t('learn_nav_desc'),
                    side: "right",
                    onNextClick: () => {
                        navigate('/learn');
                        setTimeout(() => startLearnTour(), 800);
                        driverObj.destroy();
                    }
                }
            }
        ];

        const drive = driver({
            ...driverConfig,
            steps: translateSteps
        });
        drive.drive();
    }

    const startLearnTour = () => {
        const learnSteps = [
            {
                element: '#language-gallery',
                popover: {
                    title: t('language_gallery'),
                    description: t('gallery_desc'),
                    side: "left"
                }
            },
            {
                element: '#nav-my-collections',
                popover: {
                    title: t('my_collections'),
                    description: t('my_collections_desc'),
                    side: "right",
                    onNextClick: () => {
                        navigate('/my-collections');
                        setTimeout(() => startCollectionsTour(), 800);
                        driverObj.destroy();
                    }
                }
            }
        ];

        const drive = driver({
            ...driverConfig,
            steps: learnSteps
        });
        drive.drive();
    }

    const startCollectionsTour = () => {
        const collectionSteps = [
            {
                element: '#my-collections-list',
                popover: {
                    title: t('your_recordings'),
                    description: t('recordings_desc'),
                    side: "left"
                }
            },
            {
                element: '#nav-help-btn',
                popover: {
                    title: t('tutorial_complete'),
                    description: t('tutorial_complete_desc'),
                    side: "top",
                    doneBtnText: t('finish') || 'Finish'
                }
            }
        ];

        const drive = driver({
            ...driverConfig,
            steps: collectionSteps,
            onDestroyed: () => {
                localStorage.setItem('hasSeenTutorial', 'true');
                // Cleanup active classes
                document.querySelectorAll('.driver-active-element').forEach(el => el.classList.remove('driver-active-element'));
            }
        });
        drive.drive();
    }


    // Auto-start check
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenTutorial');
        const languageSelected = localStorage.getItem('hasSeenLanguageSelector');

        if (!hasSeen && languageSelected && location.pathname === '/') {
            setTimeout(() => startTutorial(), 1000);
        }
    }, [location.pathname]);


    return (
        <TutorialContext.Provider value={{ startTutorial }}>
            {children}
        </TutorialContext.Provider>
    );
};
