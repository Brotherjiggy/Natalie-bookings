/* =========================================================
   HERO SLIDESHOW IMAGES & CONFIGURATION
========================================================= */
// Add your image URLs into this array for the slideshow
const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1080',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1080',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1080'
];

let currentSlideIndex = 0;
const SLIDE_INTERVAL = 5000; // Time per slide in milliseconds (5 seconds)

/* =========================================================
   INITIALIZATION ON DOM LOAD
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initializeAutoHideHeader();
    initializeMobileMenu();
    initializeThemeToggle();
    startHeroSlideshow();
});

/* =========================================================
   HERO SLIDESHOW CONTROLLER
========================================================= */
function startHeroSlideshow() {
    const heroSection = document.getElementById("home");
    if (!heroSection || HERO_IMAGES.length === 0) return;

    // Set initial background image
    heroSection.style.backgroundImage = `url('${HERO_IMAGES[0]}')`;

    // Rotate images automatically
    setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % HERO_IMAGES.length;
        heroSection.style.backgroundImage = `url('${HERO_IMAGES[currentSlideIndex]}')`;
    }, SLIDE_INTERVAL);
}

/* =========================================================
   AUTO-HIDING NAVBAR ON SCROLL
========================================================= */
function initializeAutoHideHeader() {
    const header = document.getElementById("siteHeader");
    const navigation = document.getElementById("primaryNavigation");
    if (!header) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollThreshold = 10;

    window.addEventListener("scroll", () => {
        if (navigation && navigation.classList.contains("active")) return;

        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY <= 60) {
            header.classList.remove("nav-hidden");
            lastScrollY = currentScrollY;
            return;
        }

        if (Math.abs(currentScrollY - lastScrollY) <= scrollThreshold) return;

        if (currentScrollY > lastScrollY && !header.classList.contains("nav-hidden")) {
            header.classList.add("nav-hidden");
        } else if (currentScrollY < lastScrollY && header.classList.contains("nav-hidden")) {
            header.classList.remove("nav-hidden");
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

/* =========================================================
   MOBILE MENU TOGGLE
========================================================= */
function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("primaryNavigation");

    if (!menuToggle || !navigation) return;

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("active");
        menuToggle.classList.toggle("is-active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuToggle.classList.remove("is-active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        });
    });
}

/* =========================================================
   LIGHT / DARK MODE TOGGLE
========================================================= */
function initializeThemeToggle() {
    const desktopToggle = document.getElementById("themeToggle");
    const mobileToggle = document.getElementById("themeToggleMobile");

    const toggleTheme = () => {
        document.body.classList.toggle("dark-mode");
    };

    if (desktopToggle) desktopToggle.addEventListener("click", toggleTheme);
    if (mobileToggle) mobileToggle.addEventListener("click", toggleTheme);
}

