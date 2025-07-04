export function setupDarkMode() {
    const savedDarkMode = localStorage.getItem('dark_mode') === 'true';
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    if (savedDarkMode) {
        document.documentElement.classList.add('dark');
        updateDarkModeIcon(darkModeIcon, true);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.documentElement.classList.toggle('dark');
            localStorage.setItem('dark_mode', isDarkMode.toString());
            updateDarkModeIcon(darkModeIcon, isDarkMode);
        });
    }
}

function updateDarkModeIcon(iconElement, isDarkMode) {
    if (!iconElement) return;
    
    iconElement.innerHTML = isDarkMode 
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
}