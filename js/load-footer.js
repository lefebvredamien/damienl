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
            linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>`,
            instagram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>`
        };

        const socialLinks = siteContent.social.map(item => {
            const icon = socialIcons[item.type] || '';
            const isExternal = item.type === 'linkedin' || item.type === 'instagram';
            
            if (isExternal) {
                const externalAttrs = ' target="_blank" rel="noopener noreferrer"';
                return `<a href="${item.url}" class="contact-link" title="${item.title}"${externalAttrs}>${icon}</a>`;
            } else {
                const displayUrl = item.url.replace(/^(mailto:|tel:)/, '');
                return `<span class="contact-link" data-tooltip="${displayUrl}">${icon}</span>`;
            }
        }).join('');

        function attachCopyHandlers(root) {
            root.querySelectorAll('span.contact-link').forEach(span => {
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
        }

        const homeSocial = document.getElementById('home-social');
        if (homeSocial) {
            homeSocial.innerHTML = socialLinks;
            attachCopyHandlers(homeSocial);
        }

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

            const themeGroup = document.createElement('div');
            themeGroup.className = 'footer-theme-group';
            themeGroup.appendChild(themeToggle);

            const copyright = footer.querySelector('p');
            if (copyright) {
                copyright.className = 'footer-copyright';
                const yearSpan = copyright.querySelector('#copyright-year');
                if (yearSpan) {
                    yearSpan.textContent = new Date().getFullYear();
                }
                themeGroup.appendChild(copyright);
            }

            footerControls.appendChild(themeGroup);
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
            
            attachCopyHandlers(footerSocial);
            
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
