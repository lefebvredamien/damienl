(function() {
    const THEME_STORAGE_KEY = 'theme-preference';
    const THEMES = {
        SYSTEM: 'system',
        DARK: 'dark',
        LIGHT: 'light'
    };

    const COOKIE_EXPIRY_DAYS = 365;

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getStoredTheme() {
        return getCookie(THEME_STORAGE_KEY) || THEMES.SYSTEM;
    }

    function setStoredTheme(theme) {
        setCookie(THEME_STORAGE_KEY, theme, COOKIE_EXPIRY_DAYS);
    }

    function getEffectiveTheme() {
        const stored = getStoredTheme();
        return stored === THEMES.SYSTEM ? getSystemTheme() : stored;
    }

    function applyTheme(theme) {
        const effectiveTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', effectiveTheme);
        document.documentElement.classList.remove('theme-dark', 'theme-light');
        document.documentElement.classList.add(`theme-${effectiveTheme}`);
    }

    function initTheme() {
        const theme = getStoredTheme();
        applyTheme(theme);
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (getStoredTheme() === THEMES.SYSTEM) {
                applyTheme(THEMES.SYSTEM);
            }
        });
    }

    function setTheme(theme) {
        if (!Object.values(THEMES).includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }
        setStoredTheme(theme);
        applyTheme(theme);
        updateThemeToggleUI();
    }

    function updateThemeToggleUI() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        
        const buttons = toggle.querySelectorAll('.theme-option');
        const currentTheme = getStoredTheme();
        
        buttons.forEach(btn => {
            if (btn.dataset.theme === currentTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    window.themeManager = {
        setTheme: setTheme,
        getTheme: getStoredTheme,
        getEffectiveTheme: getEffectiveTheme,
        updateThemeToggleUI: updateThemeToggleUI,
        THEMES: THEMES
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();