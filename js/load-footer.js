(function() {
    function loadFooter() {
        if (typeof siteContent === 'undefined') {
            console.error('content.js not loaded');
            return;
        }

        const footerSocialPlaceholder = document.getElementById('footer-social-placeholder');
        if (!footerSocialPlaceholder) return;

        const socialIcons = {
            email: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>`,
            phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>`,
            linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>`,
            github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>`
        };

        const socialLinks = siteContent.social.map(item => {
            const icon = socialIcons[item.type] || '';
            const isExternal = item.type === 'linkedin' || item.type === 'github';
            
            if (isExternal) {
                const externalAttrs = ' target="_blank" rel="noopener noreferrer"';
                return `<a href="${item.url}" class="contact-link" title="${item.title}"${externalAttrs}>${icon}</a>`;
            } else {
                const displayUrl = item.url.replace(/^(mailto:|tel:)/, '');
                return `<span class="contact-link" data-tooltip="${displayUrl}">${icon}</span>`;
            }
        }).join('');

        const footer = footerSocialPlaceholder.closest('footer');
        if (footer) {
            const footerControls = document.createElement('div');
            footerControls.className = 'footer-controls';
            
            const themeToggle = document.createElement('div');
            themeToggle.id = 'theme-toggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = `
                <button class="theme-option" data-theme="system" title="System" aria-label="System theme">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </button>
                <button class="theme-option" data-theme="dark" title="Dark" aria-label="Dark theme">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                <button class="theme-option" data-theme="light" title="Light" aria-label="Light theme">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
            `;
            
            const footerSocial = document.createElement('div');
            footerSocial.className = 'footer-social';
            footerSocial.innerHTML = socialLinks;
            
            footerControls.appendChild(themeToggle);
            footerControls.appendChild(footerSocial);
            
            footer.insertBefore(footerControls, footerSocialPlaceholder);
            footerSocialPlaceholder.remove();
            
            themeToggle.querySelectorAll('.theme-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.themeManager) {
                        window.themeManager.setTheme(btn.dataset.theme);
                    }
                });
            });
            
            footerSocial.querySelectorAll('span.contact-link').forEach(span => {
                span.style.cursor = 'pointer';
                span.addEventListener('click', async function() {
                    const textToCopy = this.getAttribute('data-tooltip');
                    if (textToCopy) {
                        try {
                            await navigator.clipboard.writeText(textToCopy);
                            const originalTooltip = this.getAttribute('data-tooltip');
                            this.setAttribute('data-tooltip', 'Copied!');
                            setTimeout(() => {
                                this.setAttribute('data-tooltip', originalTooltip);
                            }, 2000);
                        } catch (err) {
                            console.error('Failed to copy:', err);
                        }
                    }
                });
            });
            
            if (window.themeManager && window.themeManager.updateThemeToggleUI) {
                window.themeManager.updateThemeToggleUI();
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
