/* =========================================================
   PERFUME DATABASE (10 SIGNATURE LUXURY FRAGRANCES)
========================================================= */
const PERFUMES_DATA = [
    { id: 1, name: "Velvet Amber Nectar", price: 280, notes: "Amber, Spiced Vanilla, Tonka", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Oud Royale Imperial", price: 340, notes: "Cambodian Oud, Rose, Sandalwood", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Midnight Saffron", price: 295, notes: "Saffron, Leather, Black Violet", img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Soleil D'Or Bloom", price: 260, notes: "Bergamot, Jasmine, White Musk", img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Elixir De Natalya", price: 420, notes: "Rare Black Iris, Damask Rose, Cedar", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Celestial Tonka", price: 275, notes: "Toasted Tonka, Cocoa, Almond Blossom", img: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "Rogue Patchouli", price: 310, notes: "Dark Patchouli, Smoked Vetiver, Honey", img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=600&q=80" },
    { id: 8, name: "Aura de Fleur", price: 250, notes: "Tuberose, Orange Blossom, Peony", img: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80" },
    { id: 9, name: "Smokey Birch Absolute", price: 330, notes: "Birch Tar, Incense, Guaiac Wood", img: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80" },
    { id: 10, name: "Elysian Cashmere", price: 290, notes: "White Amber, Cashmere Wood, Iris", img: "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?auto=format&fit=crop&w=600&q=80" }
];

let cart = [];

/* =========================================================
   INITIALIZATION ON DOM LOAD
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initializeAutoHideHeader();
    initializeMobileMenu();
    initializeThemeToggle();
    renderPerfumes();
    initializeCart();
    initializeBookingCalculator();
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
        if (navigation && navigation.classList.contains("active")) return;

        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY <= 80) {
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
   THEME TOGGLE
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

/* =========================================================
   PERFUME RENDERER
========================================================= */
function renderPerfumes() {
    const grid = document.getElementById("perfumeGrid");
    if (!grid) return;

    grid.innerHTML = PERFUMES_DATA.map(p => `
        <div class="card perfume-card">
            <div class="card-image" style="background-image: url('${p.img}');">
                <span class="badge">Extrait de Parfum</span>
            </div>
            <div class="card-body">
                <p class="perfume-notes">${p.notes}</p>
                <h3>${p.name}</h3>
                <div class="card-footer">
                    <span class="price">$${p.price}</span>
                    <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

/* =========================================================
   SHOPPING CART & COMBINED CHECKOUT
========================================================= */
function initializeCart() {
    const cartBtn = document.getElementById("cartBtn");
    const cartBtnMobile = document.getElementById("cartBtnMobile");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartOverlay = document.getElementById("cartOverlay");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const openCart = () => cartOverlay.classList.add("active");
    const closeCart = () => cartOverlay.classList.remove("active");

    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (cartBtnMobile) cartBtnMobile.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty. Add fragrances or experiences first!");
                return;
            }
            alert("Redirecting to secure multi-item combined checkout...");
        });
    }
}

function addToCart(perfumeId) {
    const perfume = PERFUMES_DATA.find(p => p.id === perfumeId);
    if (!perfume) return;

    cart.push(perfume);
    updateCartUI();
    document.getElementById("cartOverlay").classList.add("active");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartCountMobile = document.getElementById("cartCountMobile");
    const cartContainer = document.getElementById("cartItemsContainer");
    const cartSubtotal = document.getElementById("cartSubtotal");

    if (cartCount) cartCount.textContent = cart.length;
    if (cartCountMobile) cartCountMobile.textContent = cart.length;

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="text-align:center; color:#888; margin-top:40px;">Your cart is currently empty.</p>`;
        if (cartSubtotal) cartSubtotal.textContent = "$0.00";
        return;
    }

    let subtotal = 0;
    cartContainer.innerHTML = cart.map((item, index) => {
        subtotal += item.price;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <button class="cart-remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    }).join('');

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

/* =========================================================
   BOOKING ESTIMATOR CALCULATOR
========================================================= */
function initializeBookingCalculator() {
    const serviceSelect = document.getElementById("serviceType");
    const guestsInput = document.getElementById("guests");
    const totalDisplay = document.getElementById("calcTotal");
    const bookingForm = document.getElementById("bookingForm");

    const calculateTotal = () => {
        if (!serviceSelect || !guestsInput || !totalDisplay) return;
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const basePrice = parseFloat(selectedOption.getAttribute("data-price")) || 1000;
        const guests = parseInt(guestsInput.value) || 1;

        const total = basePrice + (guests > 1 ? (guests - 1) * 200 : 0);
        totalDisplay.textContent = `$${total.toLocaleString()}`;
    };

    if (serviceSelect) serviceSelect.addEventListener("change", calculateTotal);
    if (guestsInput) guestsInput.addEventListener("input", calculateTotal);

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you! Your custom booking request has been submitted. A personal concierge will contact you shortly.");
            bookingForm.reset();
            calculateTotal();
        });
    }
}
