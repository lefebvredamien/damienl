(function() {
    function handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        const offset1 = 20;
        const offset2 = 20;
        const offset3 = 20;

        const gradient1X = x + offset1;
        const gradient1Y = y;
        const gradient2X = x - offset2;
        const gradient2Y = y + offset2;
        const gradient3X = x;
        const gradient3Y = y - offset3;

        document.documentElement.style.setProperty('--gradient-1-pos', `${gradient1X}% ${gradient1Y}%`);
        document.documentElement.style.setProperty('--gradient-2-pos', `${gradient2X}% ${gradient2Y}%`);
        document.documentElement.style.setProperty('--gradient-3-pos', `${gradient3X}% ${gradient3Y}%`);
    }

    function init() {
        document.addEventListener('mousemove', handleMouseMove);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();