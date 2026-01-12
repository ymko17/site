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

/* --- 5. UNIVERSAL MODAL (With Vertical Support) --- */
// We added a second parameter: 'isVertical' (defaults to false)
function openModal(content, isVertical = false) {
    const modal = document.getElementById("video-modal");
    const modalContent = document.querySelector(".modal-content"); // Get the wrapper to change width
    const youtubeContainer = document.getElementById("youtube-container");
    const youtubeIframe = document.getElementById("youtube-iframe");
    const imagePlayer = document.getElementById("popup-image");
    
    if (!modal || !content) return;

    // 1. Activate Modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // 2. Ensure Close Logic is Ready
    document.getElementById("close-modal").onclick = closeModal;

    // 3. Reset Classes (Remove vertical mode from previous clicks)
    modalContent.classList.remove("vertical-mode");
    youtubeContainer.classList.remove("vertical");

    // 4. Check Content Type
    const isImage = content.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    if (isImage) {
        // IMAGE MODE
        youtubeContainer.style.display = "none"; youtubeIframe.src = ""; 
        imagePlayer.style.display = "block"; imagePlayer.src = content;
    } else {
        // YOUTUBE MODE
        imagePlayer.style.display = "none"; youtubeContainer.style.display = "block";
        
        // CHECK IF VERTICAL
        if (isVertical) {
            modalContent.classList.add("vertical-mode"); // Make modal narrow
            youtubeContainer.classList.add("vertical");  // Make player tall
        }
        
        // Extract ID
        let videoId = content;
        if (content.includes("v=")) { videoId = content.split('v=')[1].split('&')[0]; } 
        else if (content.includes("youtu.be/")) { videoId = content.split('youtu.be/')[1]; }
        // Handle Shorts URL (youtube.com/shorts/ID)
        else if (content.includes("/shorts/")) { videoId = content.split('/shorts/')[1].split('?')[0]; }
        
        // Embed
        youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
    }
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