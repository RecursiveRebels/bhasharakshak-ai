export const BADGES = [
    { id: 'novice', name: 'badge_novice_name', min: 1, icon: '🌟', desc: 'badge_novice_desc' },
    { id: 'scholar', name: 'badge_scholar_name', min: 5, icon: '📜', desc: 'badge_scholar_desc' },
    { id: 'master', name: 'badge_master_name', min: 20, icon: '👑', desc: 'badge_master_desc' },
    { id: 'guardian', name: 'badge_guardian_name', min: 50, icon: '🛡️', desc: 'badge_guardian_desc' }
];

export const getContributionCount = () => {
    return parseInt(localStorage.getItem('contributionCount') || '0');
};

export const incrementContribution = () => {
    const current = getContributionCount();
    const newVal = current + 1;
    localStorage.setItem('contributionCount', newVal.toString());
    return newVal;
};

export const getBadges = () => {
    const count = getContributionCount();
    return BADGES.filter(b => count >= b.min);
};

export const getNextBadge = () => {
    const count = getContributionCount();
    return BADGES.find(b => count < b.min);
};
