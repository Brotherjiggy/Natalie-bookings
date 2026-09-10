/* =========================================================
   INITIALIZATION ON DOM LOAD
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initializeAutoHideHeader();
    initializeMobileMenu();
    initializeThemeToggle();
});

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
        // Prevent hiding while mobile menu is open
        if (navigation && navigation.classList.contains("active")) return;

        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Keep header visible at top of page
        if (currentScrollY <= 80) {
            header.classList.remove("nav-hidden");
            lastScrollY = currentScrollY;
            return;
        }

        if (Math.abs(currentScrollY - lastScrollY) <= scrollThreshold) return;

        if (currentScrollY > lastScrollY && !header.classList.contains("nav-hidden")) {
            header.classList.add("nav-hidden"); // Hide on scroll down
        } else if (currentScrollY < lastScrollY && header.classList.contains("nav-hidden")) {
            header.classList.remove("nav-hidden"); // Show on scroll up
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

        // Disable scrolling when menu is open
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when tapping any link
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

