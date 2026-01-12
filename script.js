/* --- 0. FORCE SCROLL TO TOP ON REFRESH --- */
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

/* --- 1. INITIAL SETUP & STATE RESTORATION --- */
document.addEventListener("DOMContentLoaded", () => {
    
    // A. RESTORE TAB AND SCROLL POSITION (Memory)
    const savedTab = localStorage.getItem('ymkoActiveTab') || 'projects';
    const savedScroll = parseInt(localStorage.getItem('ymkoScrollPos')) || 0;

    const projectsSection = document.getElementById('portfolio-anchor');
    const aboutSection = document.getElementById('about-section');

    // 1. Set the correct tab immediately
    if (savedTab === 'about') {
        projectsSection.classList.remove('active-section');
        projectsSection.classList.add('hidden-section');
        aboutSection.classList.remove('hidden-section');
        aboutSection.classList.add('active-section');
    } else {
        aboutSection.classList.remove('active-section');
        aboutSection.classList.add('hidden-section');
        projectsSection.classList.remove('hidden-section');
        projectsSection.classList.add('active-section');
    }

    // 2. Force Scroll to Saved Position
    if (savedScroll > 0) {
        document.documentElement.style.scrollBehavior = 'auto'; 
        window.scrollTo(0, savedScroll);
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'smooth'; 
        }, 100);
    }

    // B. REVEAL ANIMATION OBSERVER
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    
    // C. MODAL LISTENERS
    const closeBtn = document.getElementById("close-modal");
    const modal = document.getElementById("video-modal");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    // --- NEW FIX: FORCE VIDEO FILTER ON LOAD ---
    // This tells the script: "Don't wait for a click. Filter by video NOW."
    filterProjects('video'); 
});

/* --- 2. SAVE SCROLL POSITION ON REFRESH/EXIT --- */
window.addEventListener('beforeunload', () => {
    localStorage.setItem('ymkoScrollPos', window.scrollY);
});

/* --- 3. SWITCH TABS --- */
function switchTab(tabName, shouldScroll = true) {
    const projectsSection = document.getElementById('portfolio-anchor');
    const aboutSection = document.getElementById('about-section');

    localStorage.setItem('ymkoActiveTab', tabName);

    if (tabName === 'about') {
        projectsSection.classList.remove('active-section');
        projectsSection.classList.add('hidden-section');
        aboutSection.classList.remove('hidden-section');
        aboutSection.classList.add('active-section');
        
        if (shouldScroll) {
            setTimeout(() => { aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
        }

    } else if (tabName === 'projects') {
        aboutSection.classList.remove('active-section');
        aboutSection.classList.add('hidden-section');
        projectsSection.classList.remove('hidden-section');
        projectsSection.classList.add('active-section');
        
        if (shouldScroll) {
            setTimeout(() => { projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
        }
    }
}

/* --- 4. FILTER FUNCTION --- */
function filterProjects(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === category || (category === 'all' && btn.innerText.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });

    const projects = document.querySelectorAll('.project-item');
    
    // Simple visual update without full fade delay on initial load
    projects.forEach(project => {
        const cat = project.getAttribute('data-category');
        if (category === 'all' || cat === category) {
            project.classList.remove('hidden'); 
            project.classList.remove('fade-out'); // Ensure it's visible
        } else {
            project.classList.add('hidden'); 
        }
    });
}

/* --- 5. UNIVERSAL MODAL FUNCTION --- */
function openModal(file) {
    const modal = document.getElementById("video-modal");
    const videoPlayer = document.getElementById("popup-player");
    const imagePlayer = document.getElementById("popup-image");
    
    if (!modal || !file) return;

    // Check file extension to see if it's an image or video
    const isImage = file.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Stop scroll

    if (isImage) {
        // SETUP IMAGE MODE
        videoPlayer.style.display = "none";
        videoPlayer.pause(); // Ensure video isn't playing
        
        imagePlayer.style.display = "block";
        imagePlayer.src = file;
        
    } else {
        // SETUP VIDEO MODE
        imagePlayer.style.display = "none";
        
        videoPlayer.style.display = "block";
        videoPlayer.src = file;
        videoPlayer.play();
    }
}

function closeModal() {
    const modal = document.getElementById("video-modal");
    const videoPlayer = document.getElementById("popup-player");
    const imagePlayer = document.getElementById("popup-image");

    if (!modal) return;
    
    modal.classList.remove("active");
    document.body.style.overflow = "auto"; // Allow scroll

    // Reset Players
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = "";
        videoPlayer.style.display = "none";
    }
    if (imagePlayer) {
        imagePlayer.src = "";
        imagePlayer.style.display = "none";
    }
}

/* --- 6. BACK TO TOP LOGIC --- */
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (backToTopBtn) {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}