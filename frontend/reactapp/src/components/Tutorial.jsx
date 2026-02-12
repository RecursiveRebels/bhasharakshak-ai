import React, { useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslation } from 'react-i18next';

export const Tutorial = ({ onComplete }) => {
    const { t } = useTranslation();

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');

        if (!hasSeenTutorial) {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                allowClose: false,
                doneBtnText: t('done') || "Done",
                nextBtnText: t('next') || "Next",
                prevBtnText: t('previous') || "Previous",
                onDestroyed: () => {
                    localStorage.setItem('hasSeenTutorial', 'true');
                    if (onComplete) onComplete();
                },
                steps: [
                    {
                        element: '#nav-logo',
                        popover: {
                            title: t('welcome_title'),
                            description: t('welcome_desc'),
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: '#nav-home',
                        popover: {
                            title: t('home'),
                            description: t('home_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#nav-contribute',
                        popover: {
                            title: t('contribute'),
                            description: t('contribute_nav_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#nav-translate',
                        popover: {
                            title: t('translate'),
                            description: t('translate_nav_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#nav-learn',
                        popover: {
                            title: t('learn'),
                            description: t('learn_nav_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#nav-lang-selector',
                        popover: {
                            title: t('change_language'),
                            description: t('change_lang_desc'),
                            side: "left"
                        }
                    }
                ]
            });

            // Small timeout to ensure DOM is ready
            setTimeout(() => {
                driverObj.drive();
            }, 1000);
        }
    }, [t, onComplete]);

    return null; // This component doesn't render anything itself
};
