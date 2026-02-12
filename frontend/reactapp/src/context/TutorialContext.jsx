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

    // Initialize driver
    useEffect(() => {
        const drive = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            doneBtnText: t('done') || "Done",
            nextBtnText: t('next') || "Next",
            prevBtnText: t('previous') || "Previous",
            onNextClick: (elem, step, opts) => {
                handleNext(step);
                drive.moveNext();
            }
        });
        setDriverObj(drive);
    }, [t]);

    // Handle navigation based on steps
    const handleNext = (step) => {
        // Logic to navigate if the next step requires a page change
        // This is tricky with driver.js v1+, so we might need a custom flow
        // For simplicity in this implementation, we will use a chain of small tours
    };

    const startTutorial = () => {
        // We will run a "chain" of tours.
        // Part 1: Home & Nav
        const homeSteps = [

            {
                element: '#nav-logo',
                popover: {
                    title: t('welcome_title') || 'Welcome to BhashaRakshak',
                    description: t('welcome_desc') || 'Your gateway to preserving and learning Indian languages.',
                    side: "bottom", align: 'start'
                }
            },
            {
                element: '#nav-home',
                popover: { title: t('home'), description: t('home_desc') || 'Go back to the main dashboard anytime.', side: "bottom" }
            },
            {
                element: '#nav-lang-selector',
                popover: { title: t('change_language'), description: t('change_lang_desc') || 'Switch the interface language here at any time.', side: "left" }
            },
            {
                element: '#nav-contribute',
                popover: {
                    title: t('contribute'),
                    description: t('contribute_nav_desc') || 'Click here to contribute your voice.',
                    side: "bottom",
                    onNextClick: () => {
                        navigate('/contribute');
                        setTimeout(() => startContributeTour(), 800);
                        driverObj.destroy();
                    }
                }
            }
        ];

        driverObj.setConfig({
            steps: homeSteps,
            onDestroyed: () => {
                // Optional: save state if user closes it manually
            }
        });
        driverObj.drive();
    };

    const startContributeTour = () => {
        const contributeSteps = [
            {
                element: '#contribute-recorder',
                popover: {
                    title: t('how_to_record') || 'How to Record',
                    description: t('record_instruction') || 'Click the microphone icon to start recording. Read the text displayed above.',
                    side: "top"
                }
            },
            {
                element: '#nav-translate',
                popover: {
                    title: t('translate'),
                    description: t('translate_nav_desc') || 'Explore our translation tools.',
                    side: "bottom",
                    onNextClick: () => {
                        navigate('/translate');
                        setTimeout(() => startTranslateTour(), 800);
                        driverObj.destroy();
                    }
                }
            }
        ];

        const drive = driver({
            showProgress: true,
            animate: true,
            steps: contributeSteps
        });
        drive.drive();
    };

    const startTranslateTour = () => {
        const translateSteps = [
            {
                element: '#translation-panel', // Need to add ID
                popover: {
                    title: t('translation_panel'),
                    description: t('translate_panel_desc') || 'Type text or use voice to translate between languages.',
                    side: "top"
                }
            },
            {
                element: '#nav-learn',
                popover: {
                    title: t('learn'),
                    description: t('learn_nav_desc') || 'Learn from verified contributions.',
                    side: "bottom",
                    onNextClick: () => {
                        navigate('/learn');
                        setTimeout(() => startLearnTour(), 800);
                        driverObj.destroy(); // Close current tour
                    }
                }
            }
        ];

        const drive = driver({
            showProgress: true,
            animate: true,
            steps: translateSteps
        });
        drive.drive();
    }

    const startLearnTour = () => {
        const learnSteps = [
            {
                element: '#language-gallery', // Need to add ID
                popover: {
                    title: t('language_gallery'),
                    description: t('gallery_desc') || 'Browse verified content by language.',
                    side: "top"
                }
            },
            {
                element: '#nav-home',
                popover: {
                    title: t('tutorial_complete'),
                    description: t('tutorial_complete_desc') || 'You are all set! Click Done to finish.',
                    side: "bottom",
                    doneBtnText: t('finish') || 'Finish'
                }
            }
        ];

        const drive = driver({
            showProgress: true,
            animate: true,
            steps: learnSteps,
            onDestroyed: () => localStorage.setItem('hasSeenTutorial', 'true')
        });
        drive.drive();
    }


    // Auto-start check
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenTutorial');
        // Check if we are done with language selection (assuming localStorage item 'hasSeenLanguageSelector')
        const languageSelected = localStorage.getItem('hasSeenLanguageSelector');

        if (!hasSeen && languageSelected && location.pathname === '/') {
            // Small delay to let page render
            setTimeout(() => startTutorial(), 1000);
        }
    }, [location.pathname]);


    return (
        <TutorialContext.Provider value={{ startTutorial }}>
            {children}
        </TutorialContext.Provider>
    );
};
