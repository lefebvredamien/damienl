(function () {
    function getPassword() {
        return String.fromCharCode(77, 97, 114, 99, 111);
    }

    function promptPassword(message) {
        const correctPassword = getPassword();
        const password = prompt(message);
        
        if (password === null) {
            return false;
        }
        
        if (password !== correctPassword) {
            alert('Incorrect password. Please try again.');
            return false;
        }
        
        return true;
    }

    function createPasswordProtectedLink(link, promptMessage) {
        return function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (promptPassword(promptMessage)) {
                window.open(link, '_blank');
            }
        };
    }

    function loadContent() {
        if (typeof siteContent === 'undefined') {
            console.error('content.js not loaded');
            return;
        }

        const authorPhotoElements = document.querySelectorAll('[data-content="author-photo"]');
        authorPhotoElements.forEach(el => {
            if (siteContent.author.profileImage) {
                el.src = siteContent.author.profileImage;
                el.alt = siteContent.author.name;
            }
        });

        const authorDescElements = document.querySelectorAll('[data-content="author-description"]');
        if (authorDescElements.length > 0) {
            authorDescElements.forEach((el, index) => {
                if (siteContent.author.description[index]) {
                    el.textContent = siteContent.author.description[index];
                }
            });
        }

        const workLinkElements = document.querySelectorAll('[data-content="work-link"]');
        workLinkElements.forEach(el => {
            if (siteContent.author.workLink) {
                el.textContent = siteContent.author.workLink.text;
                el.href = siteContent.author.workLink.url;
            }
        });

        const journeyList = document.getElementById('journey-list');

        if (journeyList) {
            const renderJourneyItem = (item) => {
                const align = item.align || 'left';
                return `
                <li class="journey-item journey-item-${align}">
                    ${item.logo ? `<div class="journey-image">
                        <img src="${item.logo}" alt="${item.heading || ''}" onerror="this.style.display='none';">
                    </div>` : '<div class="journey-image"></div>'}
                    <div class="journey-content">
                        <div class="journey-main">
                            <span class="journey-heading">${item.heading || ''}</span>
                        </div>
                        <div class="journey-secondary">
                            <span class="journey-timeframe">${item.timeframe || ''}</span>
                            ${item.location ? ` <span class="journey-location">${item.location}</span>` : ''}
                        </div>
                    </div>
                </li>
            `;
            };

            journeyList.innerHTML = siteContent.journey.map(renderJourneyItem).join('');
        }

        const trilogyBlurb = document.getElementById('trilogy-blurb');
        if (trilogyBlurb && siteContent.trilogy) {
            if (siteContent.trilogy.description) {
                if (Array.isArray(siteContent.trilogy.description)) {
                    trilogyBlurb.innerHTML = siteContent.trilogy.description.map(sentence => `<p>${sentence}</p>`).join('');
                } else {
                    trilogyBlurb.innerHTML = `<p>${siteContent.trilogy.description}</p>`;
                }
            } else {
                trilogyBlurb.innerHTML = '<p></p>';
            }
        }

        const booksGrid = document.getElementById('books-grid');
        if (booksGrid) {
            const orderedBooks = [...siteContent.books].sort((a, b) => {
                const order = { 'book1': 1, 'book2': 2, 'book3': 3, 'book4': 4 };
                return (order[a.id] || 99) - (order[b.id] || 99);
            });

            booksGrid.innerHTML = orderedBooks.map(book => {
                const gradients = {
                    'book1': '#667eea 0%, #764ba2 100%',
                    'book2': '#f093fb 0%, #f5576c 100%',
                    'book4': '#a8edea 0%, #fed6e3 100%'
                };
                const gradient = gradients[book.id] || '#667eea 0%, #764ba2 100%';
                const hasCover = book.coverImage !== null && book.coverImage !== undefined;

                const isNewRow = book.id === 'book4';
                const isComingSoon = book.id === 'book3';
                const coverClass = isComingSoon ? 'book-cover coming-soon-cover' : 'book-cover';
                const coverStyle = isComingSoon ? '' : `style="background: linear-gradient(135deg, ${gradient});"`;
                return `
                <div class="book ${isNewRow ? 'book-new-row' : ''}">
                    <a href="${book.id}.html" class="book-cover-link">
                        <div class="${coverClass}" ${coverStyle}>
                            ${hasCover ? `<img src="${book.coverImage}" alt="${book.title}" onerror="this.style.display='none';">` : '<div class="coming-soon">Coming Soon</div>'}
                        </div>
                    </a>
                    <div class="book-info">
                        <a href="${book.id}.html" class="book-title-link">
                            <h2 class="book-title">${book.title}</h2>
                        </a>
                        <p class="book-year">${book.year}</p>
                    </div>
                </div>
            `;
            }).join('');
        }

        const bookTitleElements = document.querySelectorAll('[data-content="book-title"]');
        bookTitleElements.forEach(el => {
            const bookId = el.getAttribute('data-book-id');
            const book = siteContent.books.find(b => b.id === bookId);
            if (book) {
                el.textContent = book.title;
            }
        });

        const bookYearElements = document.querySelectorAll('[data-content="book-year"]');
        bookYearElements.forEach(el => {
            const bookId = el.getAttribute('data-book-id');
            const book = siteContent.books.find(b => b.id === bookId);
            if (book) {
                el.textContent = book.year;
            }
        });

        const bookSummaryElements = document.querySelectorAll('[data-content="book-summary"]');
        bookSummaryElements.forEach(el => {
            const bookId = el.getAttribute('data-book-id');
            const book = siteContent.books.find(b => b.id === bookId);
            if (book) {
                el.innerHTML = `<p>${book.summary}</p>`;
            }
        });

        const pdfLinkElements = document.querySelectorAll('[data-content="pdf-link"]');
        pdfLinkElements.forEach(el => {
            const bookId = el.getAttribute('data-book-id');
            const book = siteContent.books.find(b => b.id === bookId);
            if (book) {
                if (book.coverImage) {
                    el.href = '#';
                    el.style.display = 'inline-block';

                    el.addEventListener('click', createPasswordProtectedLink(book.pdfLink, 'Please enter the password to access the PDF:'), true);
                } else {
                    el.style.display = 'none';
                }
            }
        });

        const bookCoverElements = document.querySelectorAll('[data-content="book-cover"]');
        bookCoverElements.forEach(el => {
            const bookId = el.getAttribute('data-book-id');
            if (bookId) {
                const book = siteContent.books.find(b => b.id === bookId);
                if (book) {
                    const getComingSoonGradient = () => {
                        const computedStyle = getComputedStyle(document.documentElement);
                        const gradient = computedStyle.getPropertyValue('--coming-soon-gradient').trim() || '#c4b5fd 0%, #e9d5ff 100%';
                        return `linear-gradient(135deg, ${gradient})`;
                    };

                    const gradients = {
                        'book1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        'book2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        'book3': getComingSoonGradient(),
                        'book4': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                    };
                    const gradient = gradients[bookId] || gradients['book1'];

                    if (book.coverImage) {
                        el.style.display = 'block';
                        el.src = book.coverImage;
                        el.alt = book.title;
                        el.onerror = function () {
                            this.style.display = 'none';
                            if (this.parentElement) {
                                this.parentElement.style.background = gradient;
                            }
                        };
                    } else {
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                            if (bookId === 'book3') {
                                parent.classList.add('coming-soon-cover');
                            } else {
                                parent.style.background = gradient;
                            }
                            if (!parent.querySelector('.coming-soon')) {
                                const comingSoon = document.createElement('div');
                                comingSoon.className = 'coming-soon';
                                comingSoon.textContent = 'Coming Soon';
                                parent.appendChild(comingSoon);
                            }
                        }
                    }
                }
            }
        });

        const predictionsGrid = document.getElementById('predictions-grid');
        if (predictionsGrid && siteContent.predictions) {
            predictionsGrid.innerHTML = siteContent.predictions.map((prediction, index) => `
                <div class="prediction" data-prediction-id="${prediction.id}">
                    <div class="prediction-cover" ${prediction.link ? 'style="cursor: pointer;"' : ''}>
                        <div class="coming-soon">Coming Soon</div>
                    </div>
                    <div class="prediction-info">
                        <h2 class="prediction-title">${prediction.title}</h2>
                        <p class="prediction-year">${prediction.year}</p>
                    </div>
                </div>
            `).join('');

            siteContent.predictions.forEach(prediction => {
                if (prediction.link) {
                    const predictionElement = predictionsGrid.querySelector(`[data-prediction-id="${prediction.id}"]`);
                    if (predictionElement) {
                        const coverElement = predictionElement.querySelector('.prediction-cover');
                        if (coverElement) {
                            coverElement.addEventListener('click', createPasswordProtectedLink(prediction.link, 'Please enter the password to access the prediction:'), true);
                        }
                    }
                }
            });
        }

        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';

        if (currentFile === 'index.html' || currentFile === '') {
            document.title = siteContent.author.name;
        } else if (currentFile === 'books.html') {
            document.title = `Books - ${siteContent.author.name}`;
        } else if (currentFile === 'predictions.html') {
            document.title = `Predictions - ${siteContent.author.name}`;
        } else if (currentFile.startsWith('book') && currentFile.endsWith('.html')) {
            const bookId = currentFile.replace('.html', '');
            const book = siteContent.books.find(b => b.id === bookId);
            if (book) {
                document.title = `${book.title} - ${siteContent.author.name}`;
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
})();
