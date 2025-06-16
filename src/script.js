class DocumentationSite {
    constructor() {
        this.searchIndex = [];
        this.fuse = null;
        this.activeSection = null;
        this.tocObserver = null;
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSidebar();
        this.setupSearch();
        this.setupTOC();
        this.setupCopyButtons();
        this.setupLazyLoading();
        this.setupKeyboardShortcuts();
        this.buildSearchIndex();
        
        // Initialize after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.finalizeInit();
            });
        } else {
            this.finalizeInit();
        }
    }

    finalizeInit() {
        this.generateTOC();
        this.setupScrollSpy();
        this.hideLoading();
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Smooth transition
            document.documentElement.style.transition = 'color 0.3s, background-color 0.3s';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });

        // System theme detection
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
        }
        
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const sidebar = document.getElementById('sidebar');

        const toggleMobileMenu = () => {
            const isOpen = sidebar.classList.contains('mobile-open');
            
            if (isOpen) {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                sidebar.classList.add('mobile-open');
                mobileOverlay.classList.add('active');
                mobileToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        mobileToggle?.addEventListener('click', toggleMobileMenu);
        mobileOverlay?.addEventListener('click', toggleMobileMenu);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });

        // Close on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });
    }

    // Sidebar Navigation
    setupSidebar() {
        const navToggles = document.querySelectorAll('.nav-toggle');
        
        navToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const section = toggle.dataset.section;
                const navList = document.getElementById(section);
                const isExpanded = navList.classList.contains('expanded');
                
                if (isExpanded) {
                    navList.classList.remove('expanded');
                    toggle.classList.remove('active');
                } else {
                    navList.classList.add('expanded');
                    toggle.classList.add('active');
                }
            });
        });

        // Auto-expand active section
        const activeNavItem = document.querySelector('.nav-item.active');
        if (activeNavItem) {
            const parentList = activeNavItem.closest('.nav-list');
            const parentToggle = document.querySelector(`[data-section="${parentList.id}"]`);
            
            if (parentList && parentToggle) {
                parentList.classList.add('expanded');
                parentToggle.classList.add('active');
            }
        }

        // Handle nav item clicks
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Update active states
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 768) {
                        const sidebar = document.getElementById('sidebar');
                        const overlay = document.getElementById('mobile-overlay');
                        const toggle = document.getElementById('mobile-menu-toggle');
                        
                        sidebar.classList.remove('mobile-open');
                        overlay.classList.remove('active');
                        toggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        let searchTimeout;

        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });

        // Handle search result clicks
        searchResults?.addEventListener('click', (e) => {
            const result = e.target.closest('.search-result');
            if (result) {
                const targetId = result.dataset.target;
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                }
            }
        });
    }

    buildSearchIndex() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = document.querySelectorAll('p');
        
        this.searchIndex = [];
        
        headings.forEach(heading => {
            if (heading.id) {
                this.searchIndex.push({
                    id: heading.id,
                    title: heading.textContent,
                    content: heading.textContent,
                    type: 'heading',
                    level: parseInt(heading.tagName.substring(1))
                });
            }
        });
        
        paragraphs.forEach((paragraph, index) => {
            const nearestHeading = this.findNearestHeading(paragraph);
            this.searchIndex.push({
                id: nearestHeading?.id || `content-${index}`,
                title: nearestHeading?.textContent || 'Content',
                content: paragraph.textContent,
                type: 'content'
            });
        });

        // Initialize Fuse.js when available
        if (window.Fuse) {
            this.fuse = new Fuse(this.searchIndex, {
                keys: ['title', 'content'],
                threshold: 0.3,
                includeScore: true,
                includeMatches: true
            });
        }
    }

    findNearestHeading(element) {
        let current = element;
        while (current.previousElementSibling) {
            current = current.previousElementSibling;
            if (current.matches('h1, h2, h3, h4, h5, h6') && current.id) {
                return current;
            }
        }
        return null;
    }

    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        
        if (!this.fuse) {
            // Fallback search without Fuse.js
            const results = this.searchIndex.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.content.toLowerCase().includes(query.toLowerCase())
            );
            this.displaySearchResults(results.slice(0, 5));
            return;
        }

        const results = this.fuse.search(query);
        this.displaySearchResults(results.slice(0, 5));
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result">No results found</div>';
            searchResults.style.display = 'block';
            return;
        }

        const html = results.map(result => {
            const item = result.item || result;
            const title = item.title;
            const content = item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '');
            
            return `
                <div class="search-result" data-target="${item.id}">
                    <div class="search-result-title">${title}</div>
                    <div class="search-result-content">${content}</div>
                </div>
            `;
        }).join('');

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Table of Contents
    generateTOC() {
        const tocNav = document.getElementById('toc-nav');
        const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
        
        if (!tocNav || headings.length === 0) return;

        let tocHTML = '<ul>';
        let currentLevel = 2;
        
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            const level = parseInt(heading.tagName.substring(1));
            const title = heading.textContent;
            
            if (level > currentLevel) {
                tocHTML += '<ul class="nested">'.repeat(level - currentLevel);
            } else if (level < currentLevel) {
                tocHTML += '</ul>'.repeat(currentLevel - level);
            }
            
            tocHTML += `<li><a href="#${heading.id}" class="toc-link">${title}</a></li>`;
            currentLevel = level;
        });
        
        tocHTML += '</ul>';
        tocNav.innerHTML = tocHTML;

        // Add click handlers for TOC links
        const tocLinks = tocNav.querySelectorAll('.toc-link');
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupTOC() {
        // Will be called after DOM is ready
    }

    // Scroll Spy for TOC
    setupScrollSpy() {
        const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
        const tocLinks = document.querySelectorAll('.toc-link');
        
        if (headings.length === 0 || tocLinks.length === 0) return;

        this.tocObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocLink = document.querySelector(`.toc-link[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    // Remove active class from all TOC links
                    tocLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current link
                    if (tocLink) {
                        tocLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-64px 0px -80% 0px', // Account for fixed header
            threshold: 0
        });

        headings.forEach(heading => {
            this.tocObserver.observe(heading);
        });
    }

    // Copy Button Functionality
    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const textToCopy = button.dataset.copy;
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    
                    // Visual feedback
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.style.backgroundColor = '#10b981';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = '';
                    }, 2000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                }
            });
        });
    }

    // Lazy Loading for Images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Escape to close search
            if (e.key === 'Escape') {
                const searchResults = document.getElementById('search-results');
                const searchInput = document.getElementById('search-input');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
                if (searchInput) {
                    searchInput.blur();
                }
            }
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the documentation site
const docSite = new DocumentationSite();

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentationSite;
}