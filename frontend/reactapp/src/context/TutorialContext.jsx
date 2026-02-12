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
                drive.moveNext();
            }
        });
        setDriverObj(drive);
    }, [t]);

    const startTutorial = () => {
        // Part 1: Home & Global Features
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
                popover: { title: t('home'), description: t('home_desc') || 'Go back to the main dashboard anytime.', side: "right" }
            },
            {
                element: '#nav-rank-badge',
                popover: { title: t('your_rank') || 'Your Rank', description: t('rank_desc') || 'Track your contribution progress and badges here.', side: "left" }
            },
            {
                element: '#nav-theme-toggle',
                popover: { title: t('theme_toggle') || 'Theme', description: t('theme_desc') || 'Switch between light and dark modes.', side: "left" }
            },
            {
                element: '#nav-lang-selector',
                popover: { title: t('change_language'), description: t('change_lang_desc') || 'Switch the interface language here at any time.', side: "top" }
            },
            {
                element: '#nav-contribute',
                popover: {
                    title: t('contribute'),
                    description: t('contribute_nav_desc') || 'Click here to contribute your voice.',
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
            steps: homeSteps,
            onDestroyed: () => { }
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
                    side: "left"
                }
            },
            {
                element: '#nav-translate',
                popover: {
                    title: t('translate'),
                    description: t('translate_nav_desc') || 'Explore our translation tools.',
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
            showProgress: true,
            animate: true,
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
                    description: t('translate_panel_desc') || 'Type text or use voice to translate between languages.',
                    side: "left"
                }
            },
            {
                element: '#nav-learn',
                popover: {
                    title: t('learn'),
                    description: t('learn_nav_desc') || 'Learn from verified contributions.',
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
            showProgress: true,
            animate: true,
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
                    description: t('gallery_desc') || 'Browse verified content by language.',
                    side: "left"
                }
            },
            {
                element: '#nav-my-collections',
                popover: {
                    title: t('my_collections'),
                    description: t('my_collections_desc') || 'Manage your private recordings here.',
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
            showProgress: true,
            animate: true,
            steps: learnSteps
        });
        drive.drive();
    }

    const startCollectionsTour = () => {
        const collectionSteps = [
            {
                element: '#my-collections-list',
                popover: {
                    title: t('your_recordings') || 'Your Recordings',
                    description: t('recordings_desc') || 'View, listen to, and manage your private recordings. You can choose to make them public or delete them.',
                    side: "left"
                }
            },
            {
                element: '#nav-help-btn',
                popover: {
                    title: t('tutorial_complete'),
                    description: t('tutorial_complete_desc') || 'Click here anytime to replay this tutorial. Enjoy BhashaRakshak!',
                    side: "top",
                    doneBtnText: t('finish') || 'Finish'
                }
            }
        ];

        const drive = driver({
            showProgress: true,
            animate: true,
            steps: collectionSteps,
            onDestroyed: () => localStorage.setItem('hasSeenTutorial', 'true')
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
