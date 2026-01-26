(function() {
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;

        if (typeof headerContent !== 'undefined') {
            headerPlaceholder.innerHTML = headerContent;
        } else {
            console.error('header-content.js not loaded');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
