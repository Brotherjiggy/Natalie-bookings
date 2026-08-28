/* =========================================================
   NATALIE BOOKINGS
   Supabase Booking System
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://wmrpfheokocubjephedq.supabase.co";          // 
const SUPABASE_ANON_KEY =
    "sb_publishable_Et7xOC8eazdAS1l5j3C5cA_vRy2qQL6"; // 

/* =========================================================
   SUPABASE CLIENT
   ========================================================= */

let supabaseClient = null;


function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve(window.supabase);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => {
            if (!window.supabase) {
                reject(new Error("Supabase library failed to load."));
                return;
            }
            resolve(window.supabase);
        };

        script.onerror = () => {
            reject(new Error("Unable to load Supabase."));
        };

        document.head.appendChild(script);
    });
}


async function initializeSupabase() {
    try {
        if (
            SUPABASE_URL.includes("YOUR_") ||
            SUPABASE_ANON_KEY.includes("YOUR_")
        ) {
            console.warn("Supabase credentials have not been added yet.");
            return false;
        }

        const supabaseLibrary = await loadSupabase();

        supabaseClient = supabaseLibrary.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("Supabase initialized successfully.");
        return true;

    } catch (error) {
        console.error("Supabase initialization error:", error);
        return false;
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    await initializeSupabase();
    initializeMobileMenu();
    initializeBookingLinks();
    initializeBookingForm();
    initializeCurrentYear();
});


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
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
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
   BOOKING TYPE QUICK SELECT
   ========================================================= */

function initializeBookingLinks() {
    const bookingLinks = document.querySelectorAll("[data-booking-type]");
    const bookingType = document.getElementById("bookingType");

    if (!bookingType) return;

    bookingLinks.forEach(link => {
        link.addEventListener("click", () => {
            const selectedType = link.dataset.bookingType;
            if (selectedType) {
                bookingType.value = selectedType;
            }
        });
    });
}


/* =========================================================
   BOOKING FORM
   ========================================================= */

function initializeBookingForm() {
    const bookingForm = document.getElementById("bookingForm");
    const formStatus = document.getElementById("formStatus");

    if (!bookingForm) return;

    bookingForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!supabaseClient) {
            showFormStatus(
                formStatus,
                "The booking system is temporarily unavailable. Please contact management directly.",
                "error"
            );
            return;
        }

        const submitButton = bookingForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.dataset.originalText = submitButton.textContent;
            submitButton.textContent = "Submitting...";
        }

        const formData = new FormData(bookingForm);

        const fullName = String(formData.get("fullName") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const bookingType = String(formData.get("bookingType") || "").trim();
        const bookingDate = String(formData.get("bookingDate") || "").trim();
        const guestsValue = Number(formData.get("guests") || 1);
        const message = String(formData.get("message") || "").trim();

        // Validation
        if (fullName.length < 2) {
            showFormStatus(formStatus, "Please enter your full name.", "error");
            restoreSubmitButton(submitButton);
            return;
        }

        if (!isValidEmail(email)) {
            showFormStatus(formStatus, "Please enter a valid email address.", "error");
            restoreSubmitButton(submitButton);
            return;
        }

        const allowedBookingTypes = [
            "Flight Booking",
            "Dinner Reservation",
            "Fan Membership"
        ];

        if (!allowedBookingTypes.includes(bookingType)) {
            showFormStatus(formStatus, "Please select a valid booking experience.", "error");
            restoreSubmitButton(submitButton);
            return;
        }

        if (!Number.isInteger(guestsValue) || guestsValue < 1 || guestsValue > 20) {
            showFormStatus(formStatus, "Guests must be between 1 and 20.", "error");
            restoreSubmitButton(submitButton);
            return;
        }

        const bookingData = {
            full_name: fullName,
            email: email,
            phone: phone || null,
            booking_type: bookingType,
            booking_date: bookingDate || null,
            guests: guestsValue,
            message: message || null,
            status: "pending",
            payment_status: "unpaid"
        };

        try {
            const { data, error } = await supabaseClient
                .from("bookings")
                .insert(bookingData)
                .select("id")
                .single();

            if (error) {
                console.error("Supabase booking error:", error);
                showFormStatus(
                    formStatus,
                    getFriendlyDatabaseError(error),
                    "error"
                );
                restoreSubmitButton(submitButton);
                return;
            }

            console.log("Booking created:", data);

            showFormStatus(
                formStatus,
                "Booking request received successfully. Our management team will contact you shortly.",
                "success"
            );

            bookingForm.reset();

        } catch (error) {
            console.error("Unexpected booking error:", error);
            showFormStatus(
                formStatus,
                "Something went wrong while submitting your booking. Please try again or contact management.",
                "error"
            );
        } finally {
            restoreSubmitButton(submitButton);
        }
    });
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function showFormStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.dataset.status = type;
    element.setAttribute("role", "status");
}


function restoreSubmitButton(button) {
    if (!button) return;
    button.disabled = false;
    button.textContent = button.dataset.originalText || "Submit Booking Request";
}


function getFriendlyDatabaseError(error) {
    if (
        error &&
        (error.code === "42501" ||
            String(error.message).toLowerCase().includes("row-level security"))
    ) {
        return "The booking system could not authorize this request. Please contact management.";
    }

    if (error && String(error.message).toLowerCase().includes("fetch")) {
        return "We could not connect to the booking server. Please check your connection and try again.";
    }

    return "We couldn't submit your booking right now. Please try again or contact management.";
}


function initializeCurrentYear() {
    const currentYear = document.getElementById("currentYear");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
            }
