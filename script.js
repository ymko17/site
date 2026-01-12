/* ========================================= */
/* 1. INITIALIZATION & STATE RESTORATION     */
/* ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    
    // A. RESTORE PREVIOUS STATE (Tab & Scroll)
    const savedTab = localStorage.getItem('ymkoActiveTab') || 'projects';
    const savedScroll = parseInt(localStorage.getItem('ymkoScrollPos')) || 0;
    const projectsSection = document.getElementById('portfolio-anchor');
    const aboutSection = document.getElementById('about-section');

    // Restore correct section visibility
    if (savedTab === 'about') {
        projectsSection.classList.remove('active-section'); projectsSection.classList.add('hidden-section');
        aboutSection.classList.remove('hidden-section'); aboutSection.classList.add('active-section');
    } else {
        aboutSection.classList.remove('active-section'); aboutSection.classList.add('hidden-section');
        projectsSection.classList.remove('hidden-section'); projectsSection.classList.add('active-section');
    }

    // Restore scroll position instantly
    if (savedScroll > 0) {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, savedScroll);
        setTimeout(() => { document.documentElement.style.scrollBehavior = 'smooth'; }, 100);
    }

    // B. SETUP SCROLL REVEAL OBSERVER
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("active"); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    
    // C. SETUP MODAL CLOSE LISTENER (Global Click)
    const modal = document.getElementById("video-modal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // D. CRITICAL: FORCE DEFAULT FILTER
    // Ensures only 'Video' items are shown on load
    filterProjects('video');
});


/* ========================================= */
/* 2. TAB SWITCHING (Projects vs About)      */
/* ========================================= */
function switchTab(tabName, shouldScroll = true) {
    const projectsSection = document.getElementById('portfolio-anchor');
    const aboutSection = document.getElementById('about-section');
    localStorage.setItem('ymkoActiveTab', tabName); // Save for refresh

    const show = (el) => { el.classList.remove('hidden-section'); el.classList.add('active-section'); };
    const hide = (el) => { el.classList.remove('active-section'); el.classList.add('hidden-section'); };

    if (tabName === 'about') {
        hide(projectsSection); show(aboutSection);
        if (shouldScroll) setTimeout(() => { aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    } else {
        hide(aboutSection); show(projectsSection);
        if (shouldScroll) setTimeout(() => { projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }
}


/* ========================================= */
/* 3. FILTERING LOGIC                        */
/* ========================================= */
function filterProjects(category) {
    // 1. Update Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === category) btn.classList.add('active');
    });

    // 2. Hide/Show Items
    const projects = document.querySelectorAll('.project-item');
    projects.forEach(project => {
        const cat = project.getAttribute('data-category');
        if (category === 'all' || cat === category) {
            project.classList.remove('hidden'); 
            project.classList.remove('fade-out');
        } else {
            project.classList.add('hidden'); 
        }
    });
}


/* ========================================= */
/* 4. MODAL LOGIC (YouTube + Images)         */
/* ========================================= */
function openModal(content) {
    const modal = document.getElementById("video-modal");
    const youtubeContainer = document.getElementById("youtube-container");
    const youtubeIframe = document.getElementById("youtube-iframe");
    const imagePlayer = document.getElementById("popup-image");
    
    if (!modal || !content) return;

    // 1. Activate Modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Stop background scroll

    // 2. Ensure Close Button Works
    document.getElementById("close-modal").onclick = closeModal;

    // 3. Determine Content Type
    const isImage = content.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    if (isImage) {
        // IMAGE MODE
        youtubeContainer.style.display = "none"; youtubeIframe.src = ""; 
        imagePlayer.style.display = "block"; imagePlayer.src = content;
    } else {
        // YOUTUBE MODE
        imagePlayer.style.display = "none"; youtubeContainer.style.display = "block";
        
        // Smart ID Extraction (Handles Full URL or just ID)
        let videoId = content;
        if (content.includes("v=")) { videoId = content.split('v=')[1].split('&')[0]; } 
        else if (content.includes("youtu.be/")) { videoId = content.split('youtu.be/')[1]; }
        
        // Embed with Autoplay + Mute (Required for Autoplay)
        youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
    }
}

function closeModal() {
    const modal = document.getElementById("video-modal");
    const youtubeIframe = document.getElementById("youtube-iframe");
    const imagePlayer = document.getElementById("popup-image");

    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "auto"; // Resume scroll
    
    // Stop playback
    if (youtubeIframe) youtubeIframe.src = "";
    if (imagePlayer) imagePlayer.src = "";
}


/* ========================================= */
/* 5. UTILITIES (Scroll / BackToTop)         */
/* ========================================= */
window.addEventListener('beforeunload', () => { 
    localStorage.setItem('ymkoScrollPos', window.scrollY); 
});

const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    if (backToTopBtn) {
        if (window.scrollY > 500) backToTopBtn.classList.add("visible");
        else backToTopBtn.classList.remove("visible");
    }
});

function scrollToTop() { 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
}