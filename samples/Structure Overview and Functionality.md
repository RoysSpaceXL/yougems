# Structure Overview and Functionality

## 1. **Overall Architecture**
This is a **VitePress-based documentation website** for Mermaid.js with the following key characteristics:

- **Framework**: Built with VitePress (Vue.js-based static site generator)
- **Purpose**: Documentation and showcase for Mermaid diagramming library
- **Layout**: Three-column layout with sidebar navigation, main content, and table of contents

## 2. **Main Structural Components**

### **Header Navigation (`VPNav`)**
- **Logo and branding** (Mermaid logo + text)
- **Search functionality** (DocSearch integration)
- **Main navigation menu** (Docs, Tutorials, Integrations, etc.)
- **Version selector dropdown** (currently showing 11.6.0)
- **Theme toggle** (light/dark mode)
- **Social links** (GitHub, Discord, MermaidChart)
- **Mobile hamburger menu**

### **Sidebar Navigation (`VPSidebar`)**
- **Collapsible sections**:
  - 📔 Introduction
  - 📊 Diagram Syntax (20+ diagram types)
  - 📚 Ecosystem
  - ⚙️ Deployment and Configuration
  - 🙌 Contributing
  - 📰 Latest News
- **Active page highlighting**
- **Mobile-responsive** with curtain overlay

### **Main Content Area (`VPContent`)**
- **Promotional banner** (MermaidChart advertisement)
- **Article content** with Mermaid examples
- **Interactive code blocks** with "Run" buttons
- **Rendered diagrams** (SVG output from Mermaid)

### **Table of Contents (`VPDocAside`)**
- **Auto-generated outline** from page headings
- **Scroll tracking** with active section highlighting
- **Nested structure** for sub-sections

## 3. **Key Technologies & Features**

### **Performance Optimizations**
- **Module preloading** for different diagram types
- **Resource prefetching** for common pages
- **Font preloading** for better typography performance
- **Lazy loading** of diagram modules

### **Accessibility Features**
- **Skip links** for keyboard navigation
- **ARIA labels** and roles throughout
- **Screen reader friendly** navigation structure
- **Keyboard navigation** support

### **Responsive Design**
- **Mobile-first approach** with breakpoint adaptations
- **Collapsible navigation** for mobile devices
- **Touch-friendly** interactive elements

### **Interactive Elements**
- **Live code examples** with executable Mermaid diagrams
- **Search functionality** (DocSearch/Algolia integration)
- **Theme switching** (dark/light mode with localStorage persistence)
- **Collapsible sections** in sidebar

## 4. **Integration Points for Your Project**

For partial integration into your website, consider these reusable components:

1. **Navigation Header**: Clean, professional navigation with search
2. **Sidebar Navigation**: Hierarchical, collapsible menu system
3. **Content Layout**: Three-column responsive layout
4. **Interactive Code Blocks**: For technical documentation
5. **Theme System**: Dark/light mode implementation
6. **Search Integration**: Document search functionality

## 5. **Dependencies to Consider**

- **VitePress framework** (or adapt to your framework)
- **Vue.js components** (data-v-* attributes indicate Vue components)
- **CSS custom properties** for theming
- **Icon system** (vpi-* classes for icons)
- **Search service** (DocSearch/Algolia)

This structure provides a solid foundation for a documentation website with excellent UX patterns that you can adapt to your specific needs.
//
Important Setup Notes
1. File Structure Requirements:
your-project/
├── index.html
├── styles.css
├── script.js
├── sw.js          ← Must be in root directory
├── favicon.ico
└── logo.svg

Testing the Service Worker
1. Development Testing:

Serve your files through a local server (not just opening HTML file)
Use Python: python -m http.server 8000
Or Node.js: npx http-server
Or VS Code Live Server extension
2. Check if it's working:

Open DevTools → Application tab → Service Workers
Look for your registered service worker
Check Network tab - cached files show "from ServiceWorker"
3. Test offline functionality:

Open DevTools → Network tab
Check "Offline" checkbox
Refresh page - should still load from cache
Alternative: Manual Service Worker Registration
If you prefer more control, you can add this directly to your HTML:

// 
Alternative: Add Button via Console
Paste this in your browser console (F12 → Console)
const testButton = document.createElement('div');
testButton.innerHTML = `
    <button id="manual-offline-test" style="
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        z-index: 9999;
        padding: 12px 16px; 
        background: #dc2626; 
        color: white; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer; 
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: system-ui, sans-serif;
    ">
        🔴 Test Offline Mode
    </button>
`;

document.body.appendChild(testButton);

// Add functionality
let isOffline = false;
const originalFetch = window.fetch;

document.getElementById('manual-offline-test').addEventListener('click', function() {
    isOffline = !isOffline;
    
    if (isOffline) {
        window.fetch = () => Promise.reject(new Error('Offline test mode'));
        this.textContent = '🟢 Go Online';
        this.style.background = '#16a34a';
        console.log('🚫 Offline mode enabled');
    } else {
        window.fetch = originalFetch;
        this.textContent = '🔴 Test Offline Mode';
        this.style.background = '#dc2626';
        console.log('🟢 Online mode enabled');
    }
});

console.log('✅ Manual offline test button added');


