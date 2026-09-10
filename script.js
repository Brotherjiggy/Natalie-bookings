"use strict";

/* =========================================================
   NATALYA BOOKINGS
   PREMIUM FRONTEND ENGINE

   FEATURES
   - Premium auto-hiding navbar
   - Mobile navigation
   - Active navigation tracking
   - Dark/light mode
   - Hero slideshow
   - Supabase
   - Multi-product selection
   - Combined pricing
   - Flight pricing
   - Dinner reservations
   - Fan membership
   - Meet & Greet
   - Donation system
   - Cart / booking state
   - Checkout preparation
   - Toast notifications
   - Scroll animations
   - Product detail modal
   - Professional UX
========================================================= */


/* =========================================================
   1. GLOBAL CONFIGURATION
========================================================= */

const CONFIG = {
    SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
    SUPABASE_ANON_KEY: "YOUR-SUPABASE-ANON-KEY",

    CURRENCY: "USD",

    DONATION_GOAL: 1000000,
    DONATION_RAISED: 432000,

    FLIGHT_BASE_PRICE: 2500,

    HERO_INTERVAL: 5000,

    TOAST_DURATION: 3500
};


/* =========================================================
   2. DOM HELPERS
========================================================= */

const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
};

const $$ = (selector, parent = document) => {
    return [...parent.querySelectorAll(selector)];
};


/* =========================================================
   3. APPLICATION STATE
========================================================= */

const state = {
    cart: [],
    currentProduct: null,

    selectedState: "",
    flightFee: 0,

    darkMode: false,

    heroIndex: 0,

    navOpen: false,

    bookingSubmitting: false
};


/* =========================================================
   4. STORAGE
========================================================= */

const STORAGE_KEY = "natalyaBookingsState";


function saveState() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                cart: state.cart,
                selectedState: state.selectedState,
                flightFee: state.flightFee,
                darkMode: state.darkMode
            })
        );
    } catch (error) {
        console.warn("Could not save application state.", error);
    }
}


function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        const data = JSON.parse(saved);

        if (Array.isArray(data.cart)) {
            state.cart = data.cart;
        }

        if (data.selectedState) {
            state.selectedState = data.selectedState;
        }

        if (typeof data.flightFee === "number") {
            state.flightFee = data.flightFee;
        }

        if (typeof data.darkMode === "boolean") {
            state.darkMode = data.darkMode;
        }
    } catch (error) {
        console.warn("Could not load saved state.", error);
    }
}


/* =========================================================
   5. MONEY FORMATTER
========================================================= */

function formatMoney(amount) {
    const number = Number(amount) || 0;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: CONFIG.CURRENCY,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(number);
}


/* =========================================================
   6. TOAST NOTIFICATIONS
========================================================= */

function showToast(message, type = "info") {

    let container = $(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";

        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <div class="toast-message">${escapeHTML(message)}</div>
        <button class="toast-close" aria-label="Close notification">
            ×
        </button>
    `;

    container.appendChild(toast);

    const closeButton = $(".toast-close", toast);

    closeButton?.addEventListener("click", () => {
        toast.remove();
    });

    setTimeout(() => {
        toast.classList.add("toast-hide");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, CONFIG.TOAST_DURATION);
}


/* =========================================================
   7. HTML SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   8. MOBILE NAVIGATION
========================================================= */

function setupMobileNavigation() {

    const menuToggle =
        $("#menu-toggle") ||
        $(".menu-toggle") ||
        $("[data-menu-toggle]");

    const navLinks =
        $("#nav-links") ||
        $(".nav-links") ||
        $("[data-nav-links]");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {

        state.navOpen = !state.navOpen;

        navLinks.classList.toggle("active", state.navOpen);

        menuToggle.classList.toggle("active", state.navOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(state.navOpen)
        );
    });

    $$(".nav-link, #nav-links a", navLinks).forEach(link => {

        link.addEventListener("click", () => {

            state.navOpen = false;

            navLinks.classList.remove("active");

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}


/* =========================================================
   9. NAVBAR SCROLL EFFECT
========================================================= */

function setupNavbar() {

    const navbar =
        $("header") ||
        $(".navbar") ||
        $("nav");

    if (!navbar) return;

    let previousScroll = window.scrollY;

    window.addEventListener(
        "scroll",
        () => {

            const currentScroll = window.scrollY;

            if (currentScroll > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

            if (
                currentScroll > previousScroll &&
                currentScroll > 250
            ) {
                navbar.classList.add("nav-hidden");
            } else {
                navbar.classList.remove("nav-hidden");
            }

            previousScroll = currentScroll;
        },
        { passive: true }
    );
}


/* =========================================================
   10. ACTIVE NAVIGATION TRACKING
========================================================= */

function setupActiveNavigation() {

    const sections = $$("section[id]");

    const links = $$(".nav-link, nav a[href^='#']");

    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                links.forEach(link => {

                    const target =
                        link.getAttribute("href");

                    link.classList.toggle(
                        "active",
                        target === `#${id}`
                    );
                });
            });
        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });
}


/* =========================================================
   11. SMOOTH SCROLL
========================================================= */

function setupSmoothScroll() {

    $$("a[href^='#']").forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (
                !href ||
                href === "#" ||
                href.length < 2
            ) {
                return;
            }

            const target = $(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* =========================================================
   12. DARK / LIGHT MODE
========================================================= */

function setupTheme() {

    const themeToggle =
        $("#theme-toggle") ||
        $("[data-theme-toggle]");

    applyTheme();

    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {

        state.darkMode = !state.darkMode;

        applyTheme();

        saveState();
    });
}


function applyTheme() {

    document.documentElement.classList.toggle(
        "dark-mode",
        state.darkMode
    );

    document.body.classList.toggle(
        "dark-mode",
        state.darkMode
    );

    const themeToggle =
        $("#theme-toggle") ||
        $("[data-theme-toggle]");

    if (themeToggle) {

        themeToggle.setAttribute(
            "aria-label",
            state.darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
        );
    }
}


/* =========================================================
   13. HERO SLIDESHOW
========================================================= */

function setupHeroSlider() {

    const slides =
        $$(".hero-slide") ||
        $$(".hero img[data-hero]");

    if (!slides.length) return;

    slides.forEach((slide, index) => {

        slide.classList.toggle(
            "active",
            index === 0
        );
    });

    setInterval(() => {

        slides[state.heroIndex]
            ?.classList.remove("active");

        state.heroIndex =
            (state.heroIndex + 1) %
            slides.length;

        slides[state.heroIndex]
            ?.classList.add("active");

    }, CONFIG.HERO_INTERVAL);
}


/* =========================================================
   14. SCROLL REVEAL ANIMATIONS
========================================================= */

function setupRevealAnimations() {

    const elements =
        $$(".hidden, [data-reveal]");

    if (!elements.length) return;

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("active");

                    observer.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(element => {
        observer.observe(element);
    });
}


/* =========================================================
   15. PRODUCT DATABASE
========================================================= */

const PRODUCTS = {

    flight: {
        id: "flight",
        name: "Flight Booking",
        category: "Travel",
        description:
            "Premium flight booking and travel coordination.",
        price: CONFIG.FLIGHT_BASE_PRICE,
        image: "images/flight.jpg"
    },

    dinner: {
        id: "dinner",
        name: "Dinner Reservation",
        category: "Experience",
        description:
            "Curated dinner reservation experience.",
        price: 750,
        image: "images/dinner.jpg"
    },

    membership: {
        id: "membership",
        name: "Fan Membership",
        category: "Membership",
        description:
            "Exclusive fan membership access.",
        price: 500,
        image: "images/membership.jpg"
    },

    meetGreet: {
        id: "meet-greet",
        name: "Meet & Greet",
        category: "Premium Experience",
        description:
            "Premium meet-and-greet experience.",
        price: 2500,
        image: "images/meet-greet.jpg"
    }
};


/* =========================================================
   16. US STATE FLIGHT FEES
========================================================= */

const STATE_FEES = {

    AL: 550,
    AK: 750,
    AZ: 700,
    AR: 550,
    CA: 850,
    CO: 700,
    CT: 650,
    DE: 600,
    FL: 650,
    GA: 600,
    HI: 950,
    ID: 750,
    IL: 600,
    IN: 600,
    IA: 550,
    KS: 550,
    KY: 550,
    LA: 600,
    ME: 700,
    MD: 600,
    MA: 650,
    MI: 600,
    MN: 650,
    MS: 550,
    MO: 550,
    MT: 750,
    NE: 550,
    NV: 750,
    NH: 700,
    NJ: 600,
    NM: 700,
    NY: 650,
    NC: 550,
    ND: 700,
    OH: 600,
    OK: 600,
    OR: 800,
    PA: 600,
    RI: 650,
    SC: 550,
    SD: 650,
    TN: 550,
    TX: 650,
    UT: 750,
    VT: 700,
    VA: 600,
    WA: 850,
    WV: 600,
    WI: 600,
    WY: 750
};


/* =========================================================
   17. GET FLIGHT STATE FEE
========================================================= */

function getStateFee(stateCode) {

    if (!stateCode) {
        return 0;
    }

    return STATE_FEES[stateCode] || 0;
}


/* =========================================================
   18. PRODUCT PRICE
========================================================= */

function getProductPrice(product) {

    if (!product) return 0;

    if (product.id === "flight") {

        return (
            Number(product.price) +
            Number(state.flightFee || 0)
        );
    }

    return Number(product.price) || 0;
}


/* =========================================================
   19. ADD PRODUCT TO CART
========================================================= */

function addToCart(productId) {

    const product = PRODUCTS[productId];

    if (!product) {
        showToast(
            "This booking option is currently unavailable.",
            "error"
        );

        return;
    }

    const existing =
        state.cart.find(
            item => item.id === productId
        );

    if (existing) {

        existing.quantity += 1;

    } else {

        state.cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1
        });
    }

    saveState();

    updateCartUI();

    showToast(
        `${product.name} added to your booking.`,
        "success"
    );
}


/* =========================================================
   20. REMOVE PRODUCT
========================================================= */

function removeFromCart(productId) {

    state.cart =
        state.cart.filter(
            item => item.id !== productId
        );

    saveState();

    updateCartUI();
}


/* =========================================================
   21. CLEAR CART
========================================================= */

function clearCart() {

    state.cart = [];

    saveState();

    updateCartUI();
}


/* =========================================================
   22. CART TOTAL
========================================================= */

function getCartTotal() {

    return state.cart.reduce(
        (total, item) => {

            let price = Number(item.price) || 0;

            if (item.id === "flight") {
                price += Number(state.flightFee || 0);
            }

            return total +
                price *
                (Number(item.quantity) || 1);

        },
        0
    );
}


/* =========================================================
   23. CART COUNT
========================================================= */

function getCartCount() {

    return state.cart.reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 1),
        0
    );
}


/* =========================================================
   24. CART UI
========================================================= */

function updateCartUI() {

    const countElements = $$(
        "#cart-count, .cart-count, [data-cart-count]"
    );

    const totalElements = $$(
        "#cart-total, .cart-total, [data-cart-total]"
    );

    const count = getCartCount();

    const total = getCartTotal();

    countElements.forEach(element => {
        element.textContent = count;
    });

    totalElements.forEach(element => {
        element.textContent =
            formatMoney(total);
    });

    renderCartItems();
}


/* =========================================================
   25. RENDER CART ITEMS
========================================================= */

function renderCartItems() {

    const containers = $$(
        "#cart-items, .cart-items, [data-cart-items]"
    );

    if (!containers.length) return;

    containers.forEach(container => {

        container.innerHTML = "";

        if (!state.cart.length) {

            container.innerHTML = `
                <div class="empty-cart">
                    <p>Your booking list is empty.</p>
                </div>
            `;

            return;
        }

        state.cart.forEach(item => {

            let price =
                Number(item.price) || 0;

            if (item.id === "flight") {
                price += Number(state.flightFee || 0);
            }

            const row =
                document.createElement("div");

            row.className = "cart-item";

            row.innerHTML = `
                <div class="cart-item-info">
                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <span>
                        ${escapeHTML(item.category)}
                    </span>
                </div>

                <div class="cart-item-price">
                    ${formatMoney(
                        price *
                        (Number(item.quantity) || 1)
                    )}
                </div>

                <button
                    type="button"
                    class="remove-cart-item"
                    data-remove-cart="${escapeHTML(item.id)}"
                    aria-label="Remove ${escapeHTML(item.name)}"
                >
                    ×
                </button>
            `;

            container.appendChild(row);
        });
    });

    $$("[data-remove-cart]").forEach(button => {

        button.addEventListener("click", () => {

            removeFromCart(
                button.dataset.removeCart
            );
        });
    });
}


/* =========================================================
   26. PRODUCT BUTTONS
========================================================= */

function setupProductButtons() {

    $$("[data-product]").forEach(button => {

        button.addEventListener("click", () => {

            const productId =
                button.dataset.product;

            openProduct(productId);
        });
    });


    $$("[data-add-product]").forEach(button => {

        button.addEventListener("click", () => {

            const productId =
                button.dataset.addProduct;

            addToCart(productId);
        });
    });
}


/* =========================================================
   27. PRODUCT DETAIL MODAL
========================================================= */

function openProduct(productId) {

    const product =
        PRODUCTS[productId];

    if (!product) return;

    state.currentProduct = product;

    let modal = $("#product-modal");

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id = "product-modal";

        modal.className = "product-modal";

        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="product-modal-overlay"></div>

        <div class="product-modal-content">

            <button
                class="product-modal-close"
                type="button"
                aria-label="Close"
            >
                ×
            </button>

            <div class="product-modal-image">
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="product-modal-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <strong class="product-modal-price">
                    ${formatMoney(product.price)}
                </strong>

                <button
                    type="button"
                    class="primary-btn"
                    id="modal-add-product"
                >
                    Add to Booking
                </button>

            </div>
        </div>
    `;

    modal.classList.add("active");

    $(".product-modal-close", modal)
        ?.addEventListener(
            "click",
            closeProductModal
        );

    $(".product-modal-overlay", modal)
        ?.addEventListener(
            "click",
            closeProductModal
        );

    $("#modal-add-product")
        ?.addEventListener(
            "click",
            () => {

                addToCart(productId);

                closeProductModal();
            }
        );
}


function closeProductModal() {

    const modal = $("#product-modal");

    if (!modal) return;

    modal.classList.remove("active");
}


/* =========================================================
   28. FLIGHT STATE SELECTOR
========================================================= */

function setupFlightStateSelector() {

    const selector =
        $("#state-select") ||
        $("#state") ||
        $("[data-state-select]");

    if (!selector) return;

    selector.addEventListener("change", () => {

        state.selectedState =
            selector.value;

        state.flightFee =
            getStateFee(selector.value);

        saveState();

        updateCartUI();

        const feeElements = $$(
            "#state-fee, .state-fee, [data-state-fee]"
        );

        feeElements.forEach(element => {

            element.textContent =
                formatMoney(state.flightFee);
        });

        if (state.flightFee > 0) {

            showToast(
                `Route fee updated to ${formatMoney(state.flightFee)}.`,
                "info"
            );
        }
    });

    if (state.selectedState) {
        selector.value =
            state.selectedState;
    }
}


/* =========================================================
   29. DONATION PROGRESS
========================================================= */

function setupDonation() {

    const progressElements =
        $$(
            "#donation-progress, [data-donation-progress]"
        );

    const raisedElements =
        $$(
            "#donation-raised, [data-donation-raised]"
        );

    const goalElements =
        $$(
            "#donation-goal, [data-donation-goal]"
        );

    const percentage =
        Math.min(
            100,
            (
                CONFIG.DONATION_RAISED /
                CONFIG.DONATION_GOAL
            ) * 100
        );

    progressElements.forEach(element => {

        if (
            element.tagName === "PROGRESS"
        ) {

            element.value =
                percentage;

        } else {

            element.style.width =
                `${percentage}%`;
        }
    });

    raisedElements.forEach(element => {

        element.textContent =
            formatMoney(
                CONFIG.DONATION_RAISED
            );
    });

    goalElements.forEach(element => {

        element.textContent =
            formatMoney(
                CONFIG.DONATION_GOAL
            );
    });
}


/* =========================================================
   30. BOOKING FORM
========================================================= */

function setupBookingForm() {

    const forms = $$(
        "#booking-form, [data-booking-form]"
    );

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                if (state.bookingSubmitting) {
                    return;
                }

                state.bookingSubmitting = true;

                const submitButton =
                    $("button[type='submit']", form);

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.dataset.originalText =
                        submitButton.textContent;

                    submitButton.textContent =
                        "Processing...";
                }

                try {

                    const formData =
                        new FormData(form);

                    const booking = {

                        full_name:
                            formData.get("full_name") ||
                            formData.get("name") ||
                            "",

                        email:
                            formData.get("email") ||
                            "",

                        phone:
                            formData.get("phone") ||
                            "",

                        state:
                            formData.get("state") ||
                            state.selectedState ||
                            "",

                        service:
                            formData.get("service") ||
                            "",

                        notes:
                            formData.get("notes") ||
                            "",

                        total:
                            getCartTotal(),

                        cart:
                            state.cart,

                        created_at:
                            new Date().toISOString()
                    };

                    if (!booking.full_name) {
                        throw new Error(
                            "Please enter your full name."
                        );
                    }

                    if (!booking.email) {
                        throw new Error(
                            "Please enter your email address."
                        );
                    }

                    await submitBooking(
                        booking
                    );

                    showToast(
                        "Booking request received successfully.",
                        "success"
                    );

                    form.reset();

                    clearCart();

                } catch (error) {

                    console.error(error);

                    showToast(
                        error.message ||
                        "Something went wrong while submitting your booking.",
                        "error"
                    );

                } finally {

                    state.bookingSubmitting =
                        false;

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            submitButton.dataset.originalText ||
                            "Submit";
                    }
                }
            }
        );
    });
}


/* =========================================================
   31. SUPABASE BOOKING SUBMISSION
========================================================= */

async function submitBooking(booking) {

    if (
        !CONFIG.SUPABASE_URL ||
        CONFIG.SUPABASE_URL.includes("YOUR-PROJECT")
    ) {

        console.warn(
            "Supabase is not configured."
        );

        console.log(
            "Booking data:",
            booking
        );

        return booking;
    }

    const response =
        await fetch(
            `${CONFIG.SUPABASE_URL}/rest/v1/bookings`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "apikey":
                        CONFIG.SUPABASE_ANON_KEY,

                    "Authorization":
                        `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,

                    "Prefer":
                        "return=minimal"
                },

                body:
                    JSON.stringify(booking)
            }
        );

    if (!response.ok) {

        const text =
            await response.text();

        throw new Error(
            text ||
            "Unable to save booking."
        );
    }

    return true;
}


/* =========================================================
   32. CHECKOUT BUTTON
========================================================= */

function setupCheckout() {

    $$(
        "#checkout-btn, [data-checkout]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                if (!state.cart.length) {

                    showToast(
                        "Please select a booking first.",
                        "error"
                    );

                    return;
                }

                const total =
                    getCartTotal();

                showToast(
                    `Checkout total: ${formatMoney(total)}.`,
                    "info"
                );

                await startCheckout();
            }
        );
    });
}


/* =========================================================
   33. CHECKOUT PREPARATION
========================================================= */

async function startCheckout() {

    const checkoutData = {

        items: state.cart,

        state:
            state.selectedState,

        flight_fee:
            state.flightFee,

        total:
            getCartTotal(),

        currency:
            CONFIG.CURRENCY
    };

    console.log(
        "Checkout payload:",
        checkoutData
    );

    /*
       Your Stripe / payment backend
       can be connected here.

       Example:

       const response = await fetch(
           "/api/create-checkout",
           {
               method: "POST",
               headers: {
                   "Content-Type": "application/json"
               },
               body: JSON.stringify(checkoutData)
           }
       );

       const result = await response.json();

       window.location.href =
           result.checkout_url;
    */

    showToast(
        "Checkout is ready for payment processing.",
        "success"
    );
}


/* =========================================================
   34. CART DRAWER
========================================================= */

function setupCartDrawer() {

    const openButtons = $$(
        "#cart-button, .cart-button, [data-open-cart]"
    );

    const closeButtons = $$(
        "#cart-close, .cart-close, [data-close-cart]"
    );

    const drawer =
        $("#cart-drawer") ||
        $(".cart-drawer");

    if (!drawer) return;

    openButtons.forEach(button => {

        button.addEventListener("click", () => {

            drawer.classList.add("active");

            document.body.classList.add(
                "cart-open"
            );
        });
    });

    closeButtons.forEach(button => {

        button.addEventListener("click", () => {

            drawer.classList.remove("active");

            document.body.classList.remove(
                "cart-open"
            );
        });
    });
}


/* =========================================================
   35. ESCAPE KEY
========================================================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeProductModal();

            const drawer =
                $("#cart-drawer") ||
                $(".cart-drawer");

            drawer?.classList.remove(
                "active"
            );

            const nav =
                $("#nav-links") ||
                $(".nav-links");

            nav?.classList.remove(
                "active"
            );
        }
    );
}


/* =========================================================
   36. IMAGE ERROR HANDLING
========================================================= */

function setupImageFallbacks() {

    $$("img").forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

                image.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );
    });
}


/* =========================================================
   37. BUTTON RIPPLE EFFECT
========================================================= */

function setupButtonEffects() {

    $$(
        "button, .primary-btn, .secondary-btn, .cta-btn"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const ripple =
                    document.createElement("span");

                ripple.className =
                    "button-ripple";

                const rect =
                    button.getBoundingClientRect();

                ripple.style.left =
                    `${event.clientX - rect.left}px`;

                ripple.style.top =
                    `${event.clientY - rect.top}px`;

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        );
    });
}


/* =========================================================
   38. CURRENT YEAR
========================================================= */

function setupCurrentYear() {

    const yearElements =
        $$(
            "#current-year, .current-year, [data-current-year]"
        );

    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();
    });
}


/* =========================================================
   39. PREVENT DOUBLE FORM SUBMISSION
========================================================= */

function preventDoubleSubmission() {

    $$("form").forEach(form => {

        form.addEventListener(
            "submit",
            () => {

                form.classList.add(
                    "submitting"
                );
            }
        );
    });
}


/* =========================================================
   40. INITIALIZE APPLICATION
========================================================= */

function initializeApp() {

    loadState();

    setupMobileNavigation();

    setupNavbar();

    setupActiveNavigation();

    setupSmoothScroll();

    setupTheme();

    setupHeroSlider();

    setupRevealAnimations();

    setupProductButtons();

    setupFlightStateSelector();

    setupDonation();

    setupBookingForm();

    setupCheckout();

    setupCartDrawer();

    setupEscapeKey();

    setupImageFallbacks();

    setupButtonEffects();

    setupCurrentYear();

    preventDoubleSubmission();

    updateCartUI();

    console.log(
        "Natalya Bookings frontend initialized successfully."
    );
}


/* =========================================================
   41. START APPLICATION
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
       }
