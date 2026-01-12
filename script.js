/* --- 1. INITIAL SETUP --- */
document.addEventListener("DOMContentLoaded", () => {
    
    // A. RESTORE STATE
    const savedTab = localStorage.getItem('ymkoActiveTab') || 'projects';
    const savedScroll = parseInt(localStorage.getItem('ymkoScrollPos')) || 0;
    const projectsSection = document.getElementById('portfolio-anchor');
    const aboutSection = document.getElementById('about-section');

    if (savedTab === 'about') {
        projectsSection.classList.remove('active-section'); projectsSection.classList.add('hidden-section');
        aboutSection.classList.remove('hidden-section'); aboutSection.classList.add('active-section');
    } else {
        aboutSection.classList.remove('active-section'); aboutSection.classList.add('hidden-section');
        projectsSection.classList.remove('hidden-section'); projectsSection.classList.add('active-section');
    }

    if (savedScroll > 0) {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, savedScroll);
        setTimeout(() => { document.documentElement.style.scrollBehavior = 'smooth'; }, 100);
    }

    // B. REVEAL ANIMATION
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("active"); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    
    // C. MODAL CLOSING LOGIC (SETUP LISTENERS ONCE)
    const closeBtn = document.getElementById("close-modal");
    const modal = document.getElementById("video-modal");
    
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // D. CRITICAL FIX: FORCE VIDEO FILTER ON LOAD
    // This line ensures that only videos are shown when the site opens
    filterProjects('video');
});

/* --- 2. SAVE STATE --- */
window.addEventListener('beforeunload', () => { localStorage.setItem('ymkoScrollPos', window.scrollY); });

/* --- 3. SWITCH TABS --- */
function switchTab(tabName, shouldScroll = true) {
    const projectsSection = document.getElementById('portfolio-anchor');
    const aboutSection = document.getElementById('about-section');
    localStorage.setItem('ymkoActiveTab', tabName);

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

/* --- 4. FILTER FUNCTION --- */
function filterProjects(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === category) btn.classList.add('active');
    });

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

/* --- 5. UNIVERSAL MODAL (YOUTUBE + IMAGE) --- */
function openModal(content) {
    const modal = document.getElementById("video-modal");
    const youtubeContainer = document.getElementById("youtube-container");
    const youtubeIframe = document.getElementById("youtube-iframe");
    const imagePlayer = document.getElementById("popup-image");
    
    if (!modal || !content) return;

    const isImage = content.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    if (isImage) {
        youtubeContainer.style.display = "none"; youtubeIframe.src = ""; 
        imagePlayer.style.display = "block"; imagePlayer.src = content;
    } else {
        imagePlayer.style.display = "none"; youtubeContainer.style.display = "block";
        
        let videoId = content;
        if (content.includes("v=")) { videoId = content.split('v=')[1].split('&')[0]; } 
        else if (content.includes("youtu.be/")) { videoId = content.split('youtu.be/')[1]; }
        
        youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
    }
}

function closeModal() {
    const modal = document.getElementById("video-modal");
    const youtubeIframe = document.getElementById("youtube-iframe");
    const imagePlayer = document.getElementById("popup-image");

    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "auto"; 
    
    if (youtubeIframe) youtubeIframe.src = "";
    if (imagePlayer) imagePlayer.src = "";
}

/* --- 6. BACK TO TOP --- */
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    if (backToTopBtn) {
        if (window.scrollY > 500) backToTopBtn.classList.add("visible");
        else backToTopBtn.classList.remove("visible");
    }
});
function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }