// Sidebar toggle functionality
(function() {
    'use strict';
    
    // Create the toggle button
    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'sidebar-toggle';
        toggleButton.className = 'sidebar-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle Sidebar');
        toggleButton.innerHTML = '&#8249;'; // Left angle bracket
        
        return toggleButton;
    }
    
    // Initialize sidebar toggle functionality
    function initSidebarToggle() {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        
        if (!sidebar || !content) return;
        
        // Create and add toggle button
        const toggleButton = createToggleButton();
        document.body.appendChild(toggleButton);
        
        // Check for saved state - default is collapsed
        const isExpanded = localStorage.getItem('sidebar-expanded') === 'true';
        if (isExpanded) {
            // Add expanded class to expand sidebar
            document.body.classList.add('sidebar-expanded');
            toggleButton.innerHTML = '&#8249;'; // Left angle bracket
        } else {
            // Default collapsed state (no class needed)
            toggleButton.innerHTML = '&#8250;'; // Right angle bracket
        }
        
        // Toggle functionality
        toggleButton.addEventListener('click', function() {
            const isCurrentlyExpanded = document.body.classList.contains('sidebar-expanded');
            
            if (isCurrentlyExpanded) {
                document.body.classList.remove('sidebar-expanded');
                toggleButton.innerHTML = '&#8250;'; // Right angle bracket
                localStorage.setItem('sidebar-expanded', 'false');
            } else {
                document.body.classList.add('sidebar-expanded');
                toggleButton.innerHTML = '&#8249;'; // Left angle bracket
                localStorage.setItem('sidebar-expanded', 'true');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Hide toggle button on mobile (< 768px)
            if (window.innerWidth < 768) {
                toggleButton.style.display = 'none';
            } else {
                toggleButton.style.display = 'block';
            }
        });
        
        // Initial check for mobile
        if (window.innerWidth < 768) {
            toggleButton.style.display = 'none';
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebarToggle);
    } else {
        initSidebarToggle();
    }
})();