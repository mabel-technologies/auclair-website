export const ICON_PATHS = {
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
    'chevron-left': '<polyline points="15 18 9 12 15 6"/>',
    'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
    close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    rocket: '<path d="M12 2c2.5 2 4 5.5 4 9 0 2-1 3.8-2 5l-2 2-2-2c-1-1.2-2-3-2-5 0-3.5 1.5-7 4-9z"/><circle cx="12" cy="10" r="1.5"/><path d="M8.5 15.5 6 18l1-3.5M15.5 15.5 18 18l-1-3.5"/>',
    'credit-card': '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><line x1="2.5" y1="10" x2="21.5" y2="10"/>',
    headphones: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/>',
    ear: '<path d="M8 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 2.5-2 3-2 5.5a2.5 2.5 0 0 1-5 0"/><path d="M8 12c0 3 1.5 4.5 1.5 7"/>',
    compass: '<circle cx="12" cy="12" r="9.5"/><polygon points="15 9 13 13 9 15 11 11 15 9"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3.3 3-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 13.8c2.6.5 4.5 2.4 4.5 5.2"/>',
    mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><line x1="12" y1="17.5" x2="12" y2="21.5"/><line x1="8.5" y1="21.5" x2="15.5" y2="21.5"/>',
    'user-star': '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5 1 0 1.9.15 2.8.43"/><path d="M19 13.8l1 2 2.2.3-1.6 1.5.4 2.2-2-1.05-2 1.05.4-2.2-1.6-1.5 2.2-.3z"/>',
    shield: '<path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5-4.5-1.5-8-4.5-8-9.5V6z"/><polyline points="9 12 11 14 15 9.5"/>',
    'life-buoy': '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><line x1="5.1" y1="5.1" x2="9.2" y2="9.2"/><line x1="14.8" y1="14.8" x2="18.9" y2="18.9"/><line x1="18.9" y1="5.1" x2="14.8" y2="9.2"/><line x1="9.2" y1="14.8" x2="5.1" y2="18.9"/>',
    'question-circle': '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8"/><line x1="12" y1="16.5" x2="12" y2="16.6"/>',
    'check-circle': '<circle cx="12" cy="12" r="9.5"/><polyline points="7.5 12.5 10.5 15.5 16.5 9"/>',
    paperclip: '<path d="M17.5 8.5 9.9 16a3 3 0 1 1-4.2-4.2L14 3.4a2 2 0 0 1 2.8 2.8L8.4 14.6a1 1 0 0 1-1.4-1.4l7-7"/>',
};
export const ICON_OPTIONS = Object.keys(ICON_PATHS).map((key) => ({
    label: key,
    value: key,
}));
export function iconSvg(key, size = 24) {
    const path = ICON_PATHS[key] || '';
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}
