"use strict";
/* =========================================================
   NATALYA BOOKINGS & HAUTE PARFUMERIE
   JAVASCRIPT ENGINE
   - Auto-hiding Header on Scroll
   - 10 Perfumes Multi-Selection Sync
   - Combined Multi-Item Order Calculator
   - Supabase & Stripe
========================================================= */

const SUPABASE_URL = "https://wmrpfheokocubjephedq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Et7xOC8eazdAS1l5j3C5cA_vRy2qQL6";

let supabaseClient = null;
const RESERVE_PASS_PRICE = 2500;

const STATE_FEES = {
    "Alabama": 450, "Alaska": 950, "Arizona": 750, "Arkansas": 500, "California": 850,
    "Colorado": 700, "Connecticut": 550, "Delaware": 500, "Florida": 700, "Georgia": 550,
    "Hawaii": 1200, "Idaho": 800, "Illinois": 600, "Indiana": 550, "Iowa": 550,
    "Kansas": 550, "Kentucky": 500, "Louisiana": 600, "Maine": 650, "Maryland": 500,
    "Massachusetts": 600, "Michigan": 600, "Minnesota": 650, "Mississippi": 550, "Missouri": 550,
    "Montana": 850, "Nebraska": 600, "Nevada": 800, "New Hampshire": 600, "New Jersey": 550,
    "New Mexico": 700, "New York": 600, "North Carolina": 550, "North Dakota": 700, "Ohio": 550,
    "Oklahoma": 600, "Oregon": 850, "Pennsylvania": 550, "Rhode Island": 600, "South Carolina": 550,
    "South Dakota": 700, "Tennessee": 550, "Texas": 650, "Utah": 750, "Vermont": 650,
    "Virginia": 500, "Washington": 900, "West Virginia": 550, "Wisconsin": 600, "Wyoming": 800
};

const STATES = Object.keys(STATE_FEES);

/* =========================================================
   INITIALIZATION
========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    await initializeSupabase();
    initializeAutoHideHeader();
    initializeMobileMenu();
    initializeTheme();
    initializeHeroSlideshow();
    initializeStates();
    initializeFlightPricing();
    initializeMultiSelectionSystem();
    initializeGeneralBooking();
    initializeFlightBooking();
    initializeDates();
    initializeCurrentYear();
});
/* =========================================================
   AUTO-HIDING NAVBAR ON SCROLL
========================================================= */
function initializeAutoHideHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollThreshold = 10; // Minimum scroll delta before toggling

    window.addEventListener("scroll", () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Keep header visible at the very top of the page
        if (currentScrollY <= 80) {
            header.classList.remove("nav-hidden");
            lastScrollY = currentScrollY;
            return;
        }

        // Check if scrolled past threshold
        if (Math.abs(currentScrollY - lastScrollY) <= scrollThreshold) {
            return;
        }

        if (currentScrollY > lastScrollY && !header.classList.contains("nav-hidden")) {
            // Scrolling DOWN -> Hide Header
            header.classList.add("nav-hidden");
        } else if (currentScrollY < lastScrollY && header.classList.contains("nav-hidden")) {
            // Scrolling UP -> Reveal Header
            header.classList.remove("nav-hidden");
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */
async function initializeSupabase() {
    try {
        if (!window.supabase) return false;
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
    } catch (error) {
        console.error("Supabase error:", error);
        return false;
    }
}

/* =========================================================
   MULTI-SELECTION & COMBINED PRICING SYSTEM
========================================================= */
function initializeMultiSelectionSystem() {
    const perfumeCheckboxes = document.querySelectorAll(".perfume-select-checkbox");
    const expCheckboxes = document.querySelectorAll(".exp-checkbox");
    const summaryContainer = document.getElementById("selectedPerfumesSummary");
    const totalDisplay = document.getElementById("combinedTotalDisplay");

    function calculateAndRenderCombinedTotal() {
        let grandTotal = 0;
        const selectedPerfumes = [];

        // 1. Calculate Perfumes
        perfumeCheckboxes.forEach(cb => {
            if (cb.checked) {
                const name = cb.dataset.name;
                const price = Number(cb.dataset.price) || 0;
                selectedPerfumes.push({ name, price });
                grandTotal += price;
            }
        });

        // 2. Render Perfumes Summary Block
        if (summaryContainer) {
            if (selectedPerfumes.length === 0) {
                summaryContainer.innerHTML = `<p class="empty-perfume-note">No perfumes selected yet. Scroll up to the Boutique or check boxes to add.</p>`;
            } else {
                summaryContainer.innerHTML = selectedPerfumes.map(p => `
                    <div class="selected-perfume-row">
                        <span>${p.name}</span>
                        <strong>${formatCurrency(p.price)}</strong>
                    </div>
                `).join('');
            }
        }

        // 3. Calculate Experiences
        expCheckboxes.forEach(cb => {
            if (cb.checked) {
                grandTotal += Number(cb.dataset.price) || 0;
            }
        });

        // 4. Update Combined Total
        if (totalDisplay) {
            totalDisplay.textContent = formatCurrency(grandTotal);
        }
    }

    perfumeCheckboxes.forEach(cb => cb.addEventListener("change", calculateAndRenderCombinedTotal));
    expCheckboxes.forEach(cb => cb.addEventListener("change", calculateAndRenderCombinedTotal));

    calculateAndRenderCombinedTotal();
}

/* =========================================================
   MOBILE MENU & THEME
========================================================= */
function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("primaryNavigation");

    if (!menuToggle || !navigation) return;

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

function initializeTheme() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    if (localStorage.getItem("natalya-theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("natalya-theme", isDark ? "dark" : "light");
    });
}

function initializeHeroSlideshow() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length <= 1) return;
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }, 5000);
}

/* =========================================================
   STATES & FLIGHT PRICING
========================================================= */
function initializeStates() {
    const fromState = document.getElementById("fromState");
    const toState = document.getElementById("toState");
    if (!fromState || !toState) return;

    STATES.forEach(state => {
        const opt1 = document.createElement("option");
        opt1.value = state; opt1.textContent = state;
        fromState.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = state; opt2.textContent = state;
        toState.appendChild(opt2);
    });
}

function initializeFlightPricing() {
    const fromState = document.getElementById("fromState");
    const toState = document.getElementById("toState");
    const guests = document.getElementById("flightGuests");

    if (!fromState || !toState) return;

    const update = () => {
        const from = fromState.value;
        const to = toState.value;
        const count = Math.max(1, Number(guests?.value || 1));
        const fee = (STATE_FEES[from] || 0) + (STATE_FEES[to] || 0);
        const routeTotal = Math.round(fee / 2) * count;
        const total = RESERVE_PASS_PRICE + routeTotal;

        document.getElementById("summaryFrom").textContent = from || "—";
        document.getElementById("summaryTo").textContent = to || "—";
        document.getElementById("summaryRouteFee").textContent = formatCurrency(routeTotal);
        document.getElementById("summaryTotal").textContent = formatCurrency(total);
    };

    fromState.addEventListener("change", update);
    toState.addEventListener("change", update);
    if (guests) guests.addEventListener("input", update);
}

/* =========================================================
   COMBINED BOOKING & CHECKOUT SUBMISSION
========================================================= */
function initializeGeneralBooking() {
    const form = document.getElementById("bookingForm");
    const status = document.getElementById("formStatus");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!supabaseClient) {
            showStatus(status, "System temporarily offline.", "error");
            return;
        }

        const submitButton = form.querySelector("button[type='submit']");
        setButtonLoading(submitButton, true, "Processing selection...");

        try {
            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const bookingDate = document.getElementById("bookingDate").value;
            const message = document.getElementById("message").value.trim();

            // Collect Selected Experiences
            const selectedExp = Array.from(document.querySelectorAll('.exp-checkbox:checked')).map(cb => cb.value);

            // Collect Selected Perfumes
            const selectedPerfumes = Array.from(document.querySelectorAll('.perfume-select-checkbox:checked')).map(cb => cb.dataset.name);

            if (selectedExp.length === 0 && selectedPerfumes.length === 0) {
                throw new Error("Please select at least one experience or perfume bottle.");
            }

            const combinedSummary = [
                selectedExp.length ? `Experiences: ${selectedExp.join(", ")}` : "",
                selectedPerfumes.length ? `Perfumes: ${selectedPerfumes.join(", ")}` : ""
            ].filter(Boolean).join(" | ");

            const bookingData = {
                full_name: fullName,
                email: email,
                phone: phone || null,
                booking_type: combinedSummary,
                booking_date: bookingDate || null,
                guests: 1,
                message: message || null,
                status: "pending",
                payment_status: "unpaid"
            };

            const { error } = await supabaseClient.from("bookings").insert(bookingData);
            if (error) throw error;

            showStatus(status, "Your combined booking and fragrance request has been logged! Management will contact you.", "success");
            form.reset();
            document.querySelectorAll(".perfume-select-checkbox").forEach(cb => cb.checked = false);
            document.querySelectorAll(".exp-checkbox").forEach(cb => cb.checked = false);
            document.getElementById("combinedTotalDisplay").textContent = "$0.00";
            document.getElementById("selectedPerfumesSummary").innerHTML = `<p class="empty-perfume-note">No perfumes selected yet.</p>`;

        } catch (error) {
            showStatus(status, error.message || "Submission failed.", "error");
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}

/* =========================================================
   FLIGHT BOOKING
========================================================= */
function initializeFlightBooking() {
    const form = document.getElementById("flightBookingForm");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const errorBox = document.getElementById("flightError");
        errorBox.style.display = "none";

        if (!supabaseClient) {
            errorBox.textContent = "System unavailable.";
            errorBox.style.display = "block";
            return;
        }

        const fullName = document.getElementById("flightFullName").value.trim();
        const email = document.getElementById("flightEmail").value.trim();
        const fromState = document.getElementById("fromState").value;
        const toState = document.getElementById("toState").value;
        const departureDate = document.getElementById("departureDate").value;
        const returnDate = document.getElementById("returnDate").value;
        const guests = Number(document.getElementById("flightGuests").value || 1);

        if (!fromState || !toState) {
            errorBox.textContent = "Please select valid states.";
            errorBox.style.display = "block";
            return;
        }

        const submitButton = document.getElementById("flightCheckoutButton");
        setButtonLoading(submitButton, true, "Starting Checkout...");

        try {
            const routeFee = Math.round(((STATE_FEES[fromState] || 0) + (STATE_FEES[toState] || 0)) / 2);
            const total = RESERVE_PASS_PRICE + (routeFee * guests);

            const { data: booking, error } = await supabaseClient.from("bookings").insert({
                full_name: fullName, email: email, phone: document.getElementById("flightPhone").value,
                booking_type: "Flight Booking", booking_date: departureDate, guests: guests,
                from_state: fromState, to_state: toState, return_date: returnDate,
                total_amount: total, currency: "usd", status: "pending", payment_status: "unpaid"
            }).select("id").single();

            if (error) throw error;

            const { data: checkoutData, error: checkoutError } = await supabaseClient.functions.invoke("create-checkout", {
                body: { booking_id: booking.id, full_name: fullName, email: email, amount: total, currency: "usd" }
            });

            if (checkoutError || !checkoutData?.url) throw new Error("Could not initialize Stripe checkout.");
            window.location.href = checkoutData.url;

        } catch (err) {
            errorBox.textContent = err.message;
            errorBox.style.display = "block";
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}

/* =========================================================
   UTILITIES
========================================================= */
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount) || 0);
}

function showStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = `form-status ${type}`;
}

function setButtonLoading(btn, loading, text) {
    if (!btn) return;
    if (loading) {
        btn.dataset.original = btn.textContent;
        btn.disabled = true;
        btn.textContent = text;
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.original || "Submit";
    }
}

function initializeDates() {
    const today = new Date().toISOString().split("T")[0];
    ["bookingDate", "departureDate", "returnDate"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.min = today;
    });
}

function initializeCurrentYear() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
}

function checkPaymentStatus() {
    if (new URLSearchParams(window.location.search).get("payment") === "success") {
        alert("Payment completed successfully! Management will contact you shortly.");
    }
}

