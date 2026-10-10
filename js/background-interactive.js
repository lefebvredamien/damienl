(function() {
    function handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        const softX = 10 + (x - 50) * 0.08;
        const softY = (y - 50) * 0.06;
        document.documentElement.style.setProperty('--wash-x', `${softX}%`);
        document.documentElement.style.setProperty('--wash-y', `${softY}%`);
    }

    function init() {
        document.documentElement.style.setProperty('--wash-x', '10%');
        document.documentElement.style.setProperty('--wash-y', '0%');
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
