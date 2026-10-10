(function () {
    function getPassword() {
        return String.fromCharCode(77, 111, 110, 97, 99, 111);
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

        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';
        
        if (currentFile.startsWith('book') && currentFile.endsWith('.html')) {
            const bookId = currentFile.replace('.html', '');
            const bookIdElements = document.querySelectorAll('[data-book-id]');
            bookIdElements.forEach(el => {
                const currentId = el.getAttribute('data-book-id');
                if (!currentId || currentId === '') {
                    el.setAttribute('data-book-id', bookId);
                }
            });
        }

        const authorNameElements = document.querySelectorAll('[data-content="author-name"]');
        authorNameElements.forEach(el => {
            if (siteContent.author.name) {
                el.textContent = siteContent.author.name;
            }
        });

        const authorPhotoElements = document.querySelectorAll('[data-content="author-photo"]');
        authorPhotoElements.forEach(el => {
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
            const panels = siteContent.author.cities.map(city => `
                <div class="city-panel">
                    <img src="${city.image}" alt="${city.name}" onerror="this.style.opacity='0'">
                    <div class="city-meta">
                        <span class="city-name">${city.name}</span>
                        <span class="city-years">${city.years}</span>
                    </div>
                </div>
            `).join('');
            citiesStage.insertAdjacentHTML('afterbegin', panels);
            if (profileCenter) {
                citiesStage.appendChild(profileCenter);
            }
        }

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

        const predictionsBlurb = document.getElementById('predictions-blurb');
        if (predictionsBlurb && siteContent.predictions) {
            if (siteContent.predictions.description) {
                if (Array.isArray(siteContent.predictions.description)) {
                    predictionsBlurb.innerHTML = siteContent.predictions.description.map(sentence => `<p>${sentence}</p>`).join('');
                } else {
                    predictionsBlurb.innerHTML = `<p>${siteContent.predictions.description}</p>`;
                }
            } else {
                predictionsBlurb.innerHTML = '<p></p>';
            }
        }

        const booksGrid = document.getElementById('books-grid');
        if (booksGrid) {
            const orderedBooks = [...siteContent.books].sort((a, b) => {
                const order = { 'book1': 1, 'book2': 2, 'book3': 3, 'book4': 4 };
                return (order[a.id] || 99) - (order[b.id] || 99);
            });

            booksGrid.innerHTML = orderedBooks.map(book => {
                const hasCover = book.coverImage !== null && book.coverImage !== undefined;
                const isComingSoon = book.id === 'book3';
                const coverClass = isComingSoon ? 'book-cover coming-soon-cover' : 'book-cover';
                return `
                <div class="book">
                    <a href="${book.id}.html" class="book-cover-link">
                        <div class="${coverClass}">
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
                    if (book.coverImage) {
                        el.style.display = 'block';
                        el.src = book.coverImage;
                        el.alt = book.title;
                        el.onerror = function () {
                            this.style.display = 'none';
                        };
                    } else {
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                            if (bookId === 'book3') {
                                parent.classList.add('coming-soon-cover');
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
        if (predictionsGrid && siteContent.predictions && siteContent.predictions.list) {
            predictionsGrid.innerHTML = siteContent.predictions.list.map((prediction, index) => {
                const hasCover = prediction.coverImage !== null && prediction.coverImage !== undefined;
                return `
                <div class="prediction" data-prediction-id="${prediction.id}">
                    <div class="prediction-cover" ${prediction.link ? 'style="cursor: pointer;"' : ''}>
                        ${hasCover ? `<img src="${prediction.coverImage}" alt="${prediction.title}" onerror="this.style.display='none'; this.parentElement.querySelector('.coming-soon').style.display='flex';">` : ''}
                        ${!hasCover ? '<div class="coming-soon">Coming Soon</div>' : '<div class="coming-soon" style="display: none;">Coming Soon</div>'}
                    </div>
                    <div class="prediction-info">
                        <h2 class="prediction-title">${prediction.title}</h2>
                        ${prediction.year ? `<p class="prediction-year">${prediction.year}</p>` : ''}
                    </div>
                </div>
            `;
            }).join('');

            siteContent.predictions.list.forEach(prediction => {
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
