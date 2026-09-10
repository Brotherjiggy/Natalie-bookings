"use strict";
/* =========================================================
   NATALYA BOOKINGS & LUXURY ATELIER
   COMPLETE JAVASCRIPT
   Supabase + Stripe Checkout + Perfume Direct Purchase
========================================================= */

const SUPABASE_URL = "https://wmrpfheokocubjephedq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Et7xOC8eazdAS1l5j3C5cA_vRy2qQL6";

let supabaseClient = null;

const RESERVE_PASS_PRICE = 2500;
const PERFUME_UNIT_PRICE = 450;

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
   START APPLICATION
========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    await initializeSupabase();
    initializeMobileMenu();
    initializeTheme();
    initializeHeroSlideshow();
    initializeStates();
    initializeFlightPricing();
    initializePerfumeSection();
    initializeGeneralBooking();
    initializeFlightBooking();
    initializeBookingLinks();
    initializeDates();
    initializeCurrentYear();
    checkPaymentStatus();
});

/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */
async function initializeSupabase() {
    try {
        if (!window.supabase) {
            console.error("Supabase library is unavailable.");
            return false;
        }
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase initialized successfully.");
        return true;
    } catch (error) {
        console.error("Supabase initialization error:", error);
        return false;
    }
}

/* =========================================================
   PERFUME SECTION & INSTANT CHECKOUT
========================================================= */
function initializePerfumeSection() {
    const qtyInput = document.getElementById("perfumeQty");
    const totalDisplay = document.getElementById("perfumeTotalDisplay");
    const buyBtn = document.getElementById("buyPerfumeBtn");

    if (!qtyInput || !totalDisplay) return;

    function updatePerfumeTotal() {
        const qty = Math.max(1, parseInt(qtyInput.value) || 1);
        const total = qty * PERFUME_UNIT_PRICE;
        totalDisplay.textContent = formatCurrency(total);
    }

    qtyInput.addEventListener("input", updatePerfumeTotal);
    qtyInput.addEventListener("change", updatePerfumeTotal);

    if (buyBtn) {
        buyBtn.addEventListener("click", () => {
            const bookingType = document.getElementById("bookingType");
            const guests = document.getElementById("guests");
            const bookSection = document.getElementById("book");

            if (bookingType && guests) {
                bookingType.value = "Luxury Perfume Bottle";
                guests.value = qtyInput.value;
            }

            if (bookSection) {
                bookSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */
function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("primaryNavigation");

    if (!menuToggle || !navigation) return;

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });
}

/* =========================================================
   DARK / LIGHT MODE
========================================================= */
function initializeTheme() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("natalya-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("natalya-theme", isDark ? "dark" : "light");
    });
}

/* =========================================================
   HERO SLIDESHOW
========================================================= */
function initializeHeroSlideshow() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length <= 1) return;

    let currentSlide = 0;
    slides.forEach((slide, index) => slide.classList.toggle("active", index === 0));

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

    if (fromState.options.length <= 1) {
        STATES.forEach(state => {
            const opt = document.createElement("option");
            opt.value = state;
            opt.textContent = state;
            fromState.appendChild(opt);
        });
    }

    if (toState.options.length <= 1) {
        STATES.forEach(state => {
            const opt = document.createElement("option");
            opt.value = state;
            opt.textContent = state;
            toState.appendChild(opt);
        });
    }
}

function initializeFlightPricing() {
    const fromState = document.getElementById("fromState");
    const toState = document.getElementById("toState");
    const guests = document.getElementById("flightGuests");

    if (!fromState || !toState) return;

    fromState.addEventListener("change", updateFlightSummary);
    toState.addEventListener("change", updateFlightSummary);

    if (guests) {
        guests.addEventListener("input", updateFlightSummary);
        guests.addEventListener("change", updateFlightSummary);
    }

    updateFlightSummary();
}

function calculateRouteFee(from, to) {
    if (!from || !to) return 0;
    const fromFee = STATE_FEES[from] || 0;
    const toFee = STATE_FEES[to] || 0;
    return Math.round((fromFee + toFee) / 2);
}

function updateFlightSummary() {
    const fromState = document.getElementById("fromState");
    const toState = document.getElementById("toState");
    const guestsInput = document.getElementById("flightGuests");

    const summaryFrom = document.getElementById("summaryFrom");
    const summaryTo = document.getElementById("summaryTo");
    const summaryRouteFee = document.getElementById("summaryRouteFee");
    const summaryTotal = document.getElementById("summaryTotal");

    const from = fromState?.value || "";
    const to = toState?.value || "";
    const guests = Math.max(1, Number(guestsInput?.value || 1));

    const routeFee = calculateRouteFee(from, to);
    const routeTotal = routeFee * guests;
    const total = RESERVE_PASS_PRICE + routeTotal;

    if (summaryFrom) summaryFrom.textContent = from || "—";
    if (summaryTo) summaryTo.textContent = to || "—";
    if (summaryRouteFee) summaryRouteFee.textContent = formatCurrency(routeTotal);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(total);
}

/* =========================================================
   DATES & BOOKING LINKS
========================================================= */
function initializeDates() {
    const departureDate = document.getElementById("departureDate");
    const returnDate = document.getElementById("returnDate");
    const bookingDate = document.getElementById("bookingDate");

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const minimumDate = `${year}-${month}-${day}`;

    if (bookingDate) bookingDate.min = minimumDate;
    if (departureDate) {
        departureDate.min = minimumDate;
        departureDate.addEventListener("change", updateDateSummary);
    }
    if (returnDate) {
        returnDate.min = minimumDate;
        returnDate.addEventListener("change", updateDateSummary);
    }
    if (departureDate && returnDate) {
        departureDate.addEventListener("change", () => {
            if (departureDate.value) returnDate.min = departureDate.value;
        });
    }

    updateDateSummary();
}

function updateDateSummary() {
    const departureDate = document.getElementById("departureDate");
    const returnDate = document.getElementById("returnDate");
    const summaryDeparture = document.getElementById("summaryDeparture");
    const summaryReturn = document.getElementById("summaryReturn");

    if (summaryDeparture) summaryDeparture.textContent = formatDate(departureDate?.value);
    if (summaryReturn) summaryReturn.textContent = formatDate(returnDate?.value);
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initializeBookingLinks() {
    const links = document.querySelectorAll("[data-booking-type]");
    const bookingType = document.getElementById("bookingType");
    if (!bookingType) return;

    links.forEach(link => {
        link.addEventListener("click", () => {
            const selectedType = link.dataset.bookingType;
            if (selectedType) bookingType.value = selectedType;
        });
    });
}

/* =========================================================
   GENERAL BOOKING SUBMISSION
========================================================= */
function initializeGeneralBooking() {
    const form = document.getElementById("bookingForm");
    const status = document.getElementById("formStatus");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!supabaseClient) {
            showStatus(status, "The system is temporarily unavailable. Please try again shortly.", "error");
            return;
        }

        const submitButton = form.querySelector("button[type='submit']");
        setButtonLoading(submitButton, true, "Submitting...");

        try {
            const fullName = document.getElementById("fullName")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const phone = document.getElementById("phone")?.value.trim() || "";
            const bookingType = document.getElementById("bookingType")?.value || "";
            const bookingDate = document.getElementById("bookingDate")?.value || "";
            const guests = Number(document.getElementById("guests")?.value || 1);
            const message = document.getElementById("message")?.value.trim() || "";

            if (fullName.length < 2) throw new Error("Please enter your full name.");
            if (!isValidEmail(email)) throw new Error("Please enter a valid email address.");

            const bookingData = {
                full_name: fullName,
                email: email,
                phone: phone || null,
                booking_type: bookingType,
                booking_date: bookingDate || null,
                guests: guests,
                message: message || null,
                status: "pending",
                payment_status: "unpaid"
            };

            const { error } = await supabaseClient.from("bookings").insert(bookingData);
            if (error) throw error;

            showStatus(status, "Your request/order has been received successfully. Management will contact you shortly.", "success");
            form.reset();
        } catch (error) {
            console.error("GENERAL BOOKING ERROR:", error);
            showStatus(status, friendlyDatabaseError(error), "error");
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}

/* =========================================================
   FLIGHT BOOKING + CHECKOUT
========================================================= */
function initializeFlightBooking() {
    const form = document.getElementById("flightBookingForm");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const errorBox = document.getElementById("flightError");
        hideFlightError(errorBox);

        if (!supabaseClient) {
            showFlightError(errorBox, "The booking system is temporarily unavailable.");
            return;
        }

        const fullName = document.getElementById("flightFullName")?.value.trim() || "";
        const email = document.getElementById("flightEmail")?.value.trim() || "";
        const phone = document.getElementById("flightPhone")?.value.trim() || "";
        const fromState = document.getElementById("fromState")?.value || "";
        const toState = document.getElementById("toState")?.value || "";
        const departureDate = document.getElementById("departureDate")?.value || "";
        const returnDate = document.getElementById("returnDate")?.value || "";
        const guests = Number(document.getElementById("flightGuests")?.value || 1);
        const message = document.getElementById("flightMessage")?.value.trim() || "";

        if (fullName.length < 2) return showFlightError(errorBox, "Please enter your full name.");
        if (!isValidEmail(email)) return showFlightError(errorBox, "Please enter a valid email address.");
        if (!fromState || !toState) return showFlightError(errorBox, "Please select departure and destination states.");
        if (fromState === toState) return showFlightError(errorBox, "Select different departure and destination states.");
        if (!departureDate || !returnDate) return showFlightError(errorBox, "Please select travel dates.");

        const routeFee = calculateRouteFee(fromState, toState);
        const total = RESERVE_PASS_PRICE + (routeFee * guests);

        const submitButton = document.getElementById("flightCheckoutButton");
        setButtonLoading(submitButton, true, "Preparing secure checkout...");

        try {
            const bookingData = {
                full_name: fullName, email: email, phone: phone || null,
                booking_type: "Flight Booking", booking_date: departureDate,
                guests: guests, message: message || null, from_state: fromState,
                to_state: toState, return_date: returnDate, total_amount: total,
                currency: "usd", status: "pending", payment_status: "unpaid"
            };

            const { data: booking, error: bookingError } = await supabaseClient
                .from("bookings").insert(bookingData).select("id").single();

            if (bookingError) throw bookingError;

            const { data: checkoutData, error: checkoutError } = await supabaseClient.functions.invoke(
                "create-checkout",
                {
                    body: {
                        booking_id: booking.id, full_name: fullName,
                        email: email, amount: total, currency: "usd"
                    }
                }
            );

            if (checkoutError || !checkoutData?.url) throw new Error("Could not start checkout session.");
            window.location.href = checkoutData.url;

        } catch (error) {
            console.error("FLIGHT CHECKOUT ERROR:", error);
            showFlightError(errorBox, error.message || "Checkout failed. Please contact support.");
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}

/* =========================================================
   UTILITIES & STATUS
========================================================= */
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount) || 0);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-status ${type}`;
}

function showFlightError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.style.display = "block";
    element.classList.add("error");
}

function hideFlightError(element) {
    if (!element) return;
    element.textContent = "";
    element.style.display = "none";
}

function setButtonLoading(button, loading, text = "") {
    if (!button) return;
    if (loading) {
        if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
        button.disabled = true;
        button.textContent = text;
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || "Submit";
    }
}

function friendlyDatabaseError(error) {
    if (!error) return "Something went wrong. Please try again.";
    const message = String(error.message || "").toLowerCase();
    if (message.includes("row-level security")) return "Authorization failed. Check database permissions.";
    return error.message || "Request failed. Please try again.";
}

function checkPaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
        const message = document.createElement("div");
        message.textContent = "Payment completed successfully! Management will contact you shortly.";
        message.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:16px 22px;border-radius:10px;background:#e8f8ed;color:#196b35;box-shadow:0 10px 30px rgba(0,0,0,.15);";
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 7000);
    }
}

function initializeCurrentYear() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
}

