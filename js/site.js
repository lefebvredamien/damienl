(function () {
    function getPassword() {
        return String.fromCharCode(77, 111, 110, 97, 99, 111);
    }

    function openProtected(link, message) {
        return function (e) {
            e.preventDefault();
            e.stopPropagation();
            const password = prompt(message);
            if (password === null) return;
            if (password !== getPassword()) {
                alert('Incorrect password. Please try again.');
                return;
            }
            window.open(link, '_blank', 'noopener');
        };
    }

    function bookById(id) {
        if (typeof siteContent === 'undefined' || !siteContent.books) return null;
        return siteContent.books.find(function (book) { return book.id === id; }) || null;
    }

    function paragraphs(value) {
        if (!value) return '';
        const items = Array.isArray(value) ? value : [value];
        return items.map(function (sentence) { return '<p>' + sentence + '</p>'; }).join('');
    }

    function render() {
        document.querySelectorAll('[data-content="author-name"]').forEach(function (el) {
            if (siteContent.author.name) el.textContent = siteContent.author.name;
        });

        document.querySelectorAll('[data-content="author-photo"]').forEach(function (el) {
            if (siteContent.author.profileImage) {
                el.src = siteContent.author.profileImage;
                el.alt = siteContent.author.name;
            } else {
                el.style.display = 'none';
            }
        });

        const citiesStage = document.getElementById('cities-stage');
        if (citiesStage && siteContent.author.cities) {
            const profileCenter = citiesStage.querySelector('.profile-center');
            const panels = siteContent.author.cities.map(function (city) {
                return '<div class="city-panel">' +
                    '<img src="' + city.image + '" alt="' + city.name + '" onerror="this.style.opacity=\'0\'">' +
                    '<div class="city-meta">' +
                    '<span class="city-name">' + city.name + '</span>' +
                    '<span class="city-years">' + city.years + '</span>' +
                    '</div></div>';
            }).join('');
            citiesStage.insertAdjacentHTML('afterbegin', panels);
            if (profileCenter) citiesStage.appendChild(profileCenter);
        }

        const trilogyBlurb = document.getElementById('trilogy-blurb');
        if (trilogyBlurb && siteContent.trilogy) {
            trilogyBlurb.innerHTML = paragraphs(siteContent.trilogy.description);
        }

        const predictionsBlurb = document.getElementById('predictions-blurb');
        if (predictionsBlurb && siteContent.predictions) {
            predictionsBlurb.innerHTML = paragraphs(siteContent.predictions.description);
        }

        const booksGrid = document.getElementById('books-grid');
        if (booksGrid) {
            const order = { book1: 1, book2: 2, book4: 3, book3: 4 };
            const orderedBooks = siteContent.books.slice().sort(function (a, b) {
                return (order[a.id] || 99) - (order[b.id] || 99);
            });
            booksGrid.innerHTML = orderedBooks.map(function (book) {
                const hasCover = book.coverImage !== null && book.coverImage !== undefined;
                const coverClass = hasCover ? 'book-cover' : 'book-cover coming-soon-cover';
                const cover = hasCover
                    ? '<img src="' + book.coverImage + '" alt="' + book.title + '" onerror="this.style.display=\'none\';">'
                    : '<div class="coming-soon">Coming Soon</div>';
                return '<div class="book">' +
                    '<a href="#' + book.id + '" class="book-cover-link"><div class="' + coverClass + '">' + cover + '</div></a>' +
                    '<div class="book-info">' +
                    '<a href="#' + book.id + '" class="book-title-link"><h2 class="book-title">' + book.title + '</h2></a>' +
                    '<p class="book-year">' + book.year + '</p>' +
                    '</div></div>';
            }).join('');
        }

        const predictionsGrid = document.getElementById('predictions-grid');
        if (predictionsGrid && siteContent.predictions && siteContent.predictions.list) {
            predictionsGrid.innerHTML = siteContent.predictions.list.map(function (prediction) {
                const hasCover = prediction.coverImage !== null && prediction.coverImage !== undefined;
                const cursor = prediction.link ? ' style="cursor: pointer;"' : '';
                const image = hasCover
                    ? '<img src="' + prediction.coverImage + '" alt="' + prediction.title + '" onerror="this.style.display=\'none\'; this.parentElement.querySelector(\'.coming-soon\').style.display=\'flex\';">'
                    : '';
                const soon = hasCover
                    ? '<div class="coming-soon" style="display: none;">Coming Soon</div>'
                    : '<div class="coming-soon">Coming Soon</div>';
                const year = prediction.year ? '<p class="prediction-year">' + prediction.year + '</p>' : '';
                return '<div class="prediction" data-prediction-id="' + prediction.id + '">' +
                    '<div class="prediction-cover"' + cursor + '>' + image + soon + '</div>' +
                    '<div class="prediction-info"><h2 class="prediction-title">' + prediction.title + '</h2>' + year + '</div>' +
                    '</div>';
            }).join('');

            siteContent.predictions.list.forEach(function (prediction) {
                if (!prediction.link) return;
                const predictionElement = predictionsGrid.querySelector('[data-prediction-id="' + prediction.id + '"]');
                if (!predictionElement) return;
                const coverElement = predictionElement.querySelector('.prediction-cover');
                if (coverElement) {
                    coverElement.addEventListener('click', openProtected(prediction.link, 'Please enter the password to access the prediction:'), true);
                }
            });
        }

        const hashedBook = bookById(location.hash.slice(1));
        document.title = hashedBook ? hashedBook.title + ' - ' + siteContent.author.name : siteContent.author.name;
    }

    function initSocial() {
        const socialIcons = {
            email: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
            linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
            instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
        };

        const homeSocial = document.getElementById('home-social');
        const toggle = document.getElementById('home-social-toggle');
        if (!homeSocial || !toggle || !siteContent.social) return;

        homeSocial.innerHTML = siteContent.social.map(function (item) {
            const icon = socialIcons[item.type] || '';
            if (item.type === 'linkedin' || item.type === 'instagram') {
                return '<a href="' + item.url + '" class="contact-link" title="' + item.title + '" target="_blank" rel="noopener noreferrer">' + icon + '</a>';
            }
            const displayUrl = item.url.replace(/^(mailto:|tel:)/, '');
            return '<span class="contact-link" data-tooltip="' + displayUrl + '">' + icon + '</span>';
        }).join('');

        homeSocial.querySelectorAll('span.contact-link').forEach(function (span) {
            span.style.cursor = 'pointer';
            span.addEventListener('click', function () {
                const textToCopy = span.getAttribute('data-tooltip');
                if (!textToCopy || textToCopy === 'Copied!') return;
                navigator.clipboard.writeText(textToCopy).then(function () {
                    span.setAttribute('data-tooltip', 'Copied!');
                    setTimeout(function () {
                        span.setAttribute('data-tooltip', textToCopy);
                    }, 2000);
                }).catch(function (err) {
                    console.error('Failed to copy:', err);
                });
            });
        });

        const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)');
        let closeTimer;

        function setOpen(open) {
            clearTimeout(closeTimer);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            homeSocial.classList.toggle('is-open', open);
        }

        function scheduleClose() {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(function () {
                toggle.setAttribute('aria-expanded', 'false');
                homeSocial.classList.remove('is-open');
            }, 180);
        }

        if (hoverFine.matches) {
            toggle.addEventListener('mouseenter', function () { setOpen(true); });
            homeSocial.addEventListener('mouseenter', function () { setOpen(true); });
            toggle.addEventListener('mouseleave', scheduleClose);
            homeSocial.addEventListener('mouseleave', scheduleClose);
            toggle.addEventListener('focus', function () { setOpen(true); });
            toggle.addEventListener('blur', scheduleClose);
            homeSocial.addEventListener('focusin', function () { setOpen(true); });
            homeSocial.addEventListener('focusout', scheduleClose);
        } else {
            toggle.addEventListener('click', function () {
                setOpen(toggle.getAttribute('aria-expanded') !== 'true');
            });
        }

    }

    function initPanel() {
        const panel = document.getElementById('home-panel');
        const sheet = document.getElementById('home-panel-sheet');
        const views = {
            books: document.getElementById('home-panel-books'),
            book: document.getElementById('home-panel-book'),
            predictions: document.getElementById('home-panel-predictions')
        };
        const triggers = document.querySelectorAll('[data-open-panel]');
        const pdfLink = document.getElementById('panel-book-pdf');
        let lastTrigger = null;
        let active = null;

        function setExpanded(name) {
            triggers.forEach(function (btn) {
                const openName = name === 'books' || bookById(name) ? 'books' : name;
                btn.setAttribute('aria-expanded', btn.getAttribute('data-open-panel') === openName ? 'true' : 'false');
            });
        }

        function setPageTitle(name) {
            const book = bookById(name);
            document.title = book ? book.title + ' - ' + siteContent.author.name : siteContent.author.name;
        }

        function fillBook(book) {
            const title = document.getElementById('home-panel-book-title');
            const year = document.getElementById('panel-book-year');
            const summary = document.getElementById('panel-book-summary');
            const coverWrap = document.getElementById('panel-book-cover-wrap');
            const cover = document.getElementById('panel-book-cover');
            title.textContent = book.title;
            year.textContent = book.year;
            summary.replaceChildren();
            const paragraph = document.createElement('p');
            paragraph.textContent = book.summary;
            summary.appendChild(paragraph);
            let soon = coverWrap.querySelector('.coming-soon');
            if (book.coverImage) {
                cover.style.display = 'block';
                cover.src = book.coverImage;
                cover.alt = book.title;
                coverWrap.classList.remove('coming-soon-cover');
                if (soon) soon.style.display = 'none';
            } else {
                cover.style.display = 'none';
                cover.removeAttribute('src');
                cover.alt = '';
                coverWrap.classList.add('coming-soon-cover');
                if (!soon) {
                    soon = document.createElement('div');
                    soon.className = 'coming-soon';
                    soon.textContent = 'Coming Soon';
                    coverWrap.appendChild(soon);
                }
                soon.style.display = 'flex';
            }
            if (book.pdfLink && book.coverImage) {
                pdfLink.style.display = 'inline-block';
                pdfLink.setAttribute('data-pdf', book.pdfLink);
            } else {
                pdfLink.style.display = 'none';
                pdfLink.removeAttribute('data-pdf');
            }
        }

        function viewFor(name) {
            if (bookById(name)) return views.book;
            return views[name] || null;
        }

        function show(name) {
            const view = viewFor(name);
            if (!view) return;
            const book = bookById(name);
            if (book) fillBook(book);
            Object.keys(views).forEach(function (key) {
                views[key].hidden = views[key] !== view;
            });
            const title = view.querySelector('h2');
            if (title) sheet.setAttribute('aria-labelledby', title.id);
            const backBtn = sheet.querySelector('[data-panel-back]');
            if (backBtn) backBtn.hidden = !(name === 'predictions' || book);
            const socialToggle = document.getElementById('home-social-toggle');
            const socialPanel = document.getElementById('home-social');
            if (socialToggle && socialPanel) {
                socialToggle.setAttribute('aria-expanded', 'false');
                socialPanel.classList.remove('is-open');
            }
            panel.hidden = false;
            sheet.scrollTop = 0;
            active = name;
            setExpanded(name);
            setPageTitle(name);
            const closeBtn = sheet.querySelector('.home-panel-close');
            if (closeBtn) closeBtn.focus();
        }

        function hide() {
            if (panel.hidden) return;
            panel.hidden = true;
            active = null;
            setExpanded('');
            if (lastTrigger) lastTrigger.focus();
        }

        function open(name, trigger) {
            if (trigger) lastTrigger = trigger;
            if (location.hash !== '#' + name) {
                history.pushState({ panel: name }, '', '#' + name);
            }
            show(name);
        }

        function close() {
            const hash = location.hash.slice(1);
            if (hash === 'books' || hash === 'predictions' || bookById(hash)) {
                history.pushState(null, '', location.pathname + location.search);
            }
            hide();
            setPageTitle('');
        }

        function sync() {
            const hash = location.hash.slice(1);
            if (hash === 'books' || hash === 'predictions' || bookById(hash)) {
                if (!lastTrigger) {
                    lastTrigger = document.querySelector('[data-open-panel="' + (bookById(hash) ? 'books' : hash) + '"]');
                }
                show(hash);
            } else if (active) {
                hide();
                setPageTitle('');
            }
        }

        triggers.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const name = btn.getAttribute('data-open-panel');
                if (active === name) close();
                else open(name, btn);
            });
        });

        panel.addEventListener('click', function (e) {
            if (e.target.closest('[data-panel-back]')) {
                open('books');
                return;
            }
            if (e.target.closest('[data-close-panel]')) close();
        });

        document.addEventListener('keydown', function (e) {
            if (panel.hidden) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
                return;
            }
            if (e.key !== 'Tab' || !active) return;
            const closeBtn = sheet.querySelector('.home-panel-close');
            const backBtn = sheet.querySelector('[data-panel-back]');
            const focusable = [];
            if (backBtn && !backBtn.hidden) focusable.push(backBtn);
            focusable.push(closeBtn);
            const activeView = viewFor(active);
            if (activeView) {
                focusable.push.apply(focusable, Array.from(activeView.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) {
                    return el.getClientRects().length > 0;
                }));
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        pdfLink.addEventListener('click', function (e) {
            const link = pdfLink.getAttribute('data-pdf');
            if (!link) {
                e.preventDefault();
                return;
            }
            openProtected(link, 'Please enter the password to access the PDF:')(e);
        });

        window.addEventListener('hashchange', sync);
        window.addEventListener('popstate', sync);
        sync();
    }

    function init() {
        if (typeof siteContent === 'undefined') {
            console.error('content.js not loaded');
            return;
        }
        render();
        initSocial();
        initPanel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
