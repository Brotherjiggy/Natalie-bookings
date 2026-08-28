/* =========================================================
   NATALYA BOOKINGS
   VANILLA JAVASCRIPT + SUPABASE
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://wmrpfheokocubjephedq.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_Et7xOC8eazdAS1l5j3C5cA_vRy2qQL6";


let supabaseClient = null;


/* =========================================================
   LOAD SUPABASE
========================================================= */

function loadSupabase() {

    return new Promise((resolve, reject) => {

        if (window.supabase) {

            resolve(window.supabase);

            return;
        }


        const script =
            document.createElement("script");


        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


        script.onload = () => {

            if (!window.supabase) {

                reject(
                    new Error(
                        "Supabase library failed to load."
                    )
                );

                return;
            }

            resolve(window.supabase);
        };


        script.onerror = () => {

            reject(
                new Error(
                    "Unable to load Supabase."
                )
            );
        };


        document.head.appendChild(script);

    });
}


/* =========================================================
   INITIALIZE SUPABASE
========================================================= */

async function initializeSupabase() {

    try {

        const supabaseLibrary =
            await loadSupabase();


        supabaseClient =
            supabaseLibrary.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );


        console.log(
            "Supabase initialized successfully."
        );


        return true;

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

        return false;
    }
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeSupabase();

        initializeMobileMenu();

        initializeHeroSlider();

        initializeBookingButtons();

        initializeBookingForm();

        initializeBookingState();

        initializeCurrentYear();

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navigation =
        document.getElementById(
            "primaryNavigation"
        );


    if (!menuToggle || !navigation) return;


    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation.classList.toggle(
                    "active"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}


/* =========================================================
   HERO SLIDER
========================================================= */

function initializeHeroSlider() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );

    const dots =
        document.querySelectorAll(
            ".slide-dot"
        );


    if (!slides.length) return;


    let currentSlide = 0;


    function showSlide(index) {

        slides.forEach(
            slide =>
                slide.classList.remove(
                    "active"
                )
        );


        dots.forEach(
            dot =>
                dot.classList.remove(
                    "active"
                )
        );


        slides[index].classList.add(
            "active"
        );


        if (dots[index]) {

            dots[index].classList.add(
                "active"
            );
        }


        currentSlide = index;
    }


    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(index);

                }
            );

        }
    );


    setInterval(
        () => {

            const next =
                (currentSlide + 1)
                % slides.length;

            showSlide(next);

        },
        6000
    );

}


/* =========================================================
   BOOKING BUTTONS
========================================================= */

function initializeBookingButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-booking-type]"
        );


    const bookingType =
        document.getElementById(
            "bookingType"
        );


    if (!bookingType) return;


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.bookingType;


                if (type) {

                    bookingType.value =
                        type;

                }


                const bookingSection =
                    document.getElementById(
                        "booking"
                    );


                if (bookingSection) {

                    bookingSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });

}


/* =========================================================
   BOOKING STATE
========================================================= */

function initializeBookingState() {

    const bookingType =
        document.getElementById(
            "bookingType"
        );

    const stateGroup =
        document.getElementById(
            "stateGroup"
        );

    const state =
        document.getElementById(
            "state"
        );


    if (!bookingType ||
        !stateGroup ||
        !state) return;


    function updateStateField() {

        if (
            bookingType.value ===
            "Flight Booking"
        ) {

            stateGroup.style.display =
                "block";

            state.required = true;

        } else {

            stateGroup.style.display =
                "block";

            state.required = false;

        }

    }


    bookingType.addEventListener(
        "change",
        updateStateField
    );


    updateStateField();

}


/* =========================================================
   BOOKING FORM
========================================================= */

function initializeBookingForm() {

    const form =
        document.getElementById(
            "bookingForm"
        );


    const status =
        document.getElementById(
            "formStatus"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!supabaseClient) {

                showStatus(
                    status,
                    "The booking system is temporarily unavailable. Please try again shortly.",
                    "error"
                );

                return;
            }


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.dataset.originalText =
                    submitButton.textContent;

                submitButton.textContent =
                    "Submitting...";

            }


            const formData =
                new FormData(form);


            const fullName =
                String(
                    formData.get("fullName") || ""
                ).trim();


            const email =
                String(
                    formData.get("email") || ""
                ).trim();


            const phone =
                String(
                    formData.get("phone") || ""
                ).trim();


            const bookingType =
                String(
                    formData.get("bookingType") || ""
                ).trim();


            const state =
                String(
                    formData.get("state") || ""
                ).trim();


            const bookingDate =
                String(
                    formData.get("bookingDate") || ""
                ).trim();


            const guests =
                Number(
                    formData.get("guests") || 1
                );


            const message =
                String(
                    formData.get("message") || ""
                ).trim();


            /* ---------------------------
               VALIDATION
            --------------------------- */

            if (fullName.length < 2) {

                showStatus(
                    status,
                    "Please enter your full name.",
                    "error"
                );

                restoreButton(submitButton);

                return;
            }


            if (!isValidEmail(email)) {

                showStatus(
                    status,
                    "Please enter a valid email address.",
                    "error"
                );

                restoreButton(submitButton);

                return;
            }


            const allowedTypes = [
                "Flight Booking",
                "Dinner Reservation",
                "Fan Membership"
            ];


            if (
                !allowedTypes.includes(
                    bookingType
                )
            ) {

                showStatus(
                    status,
                    "Please select a valid experience.",
                    "error"
                );

                restoreButton(submitButton);

                return;
            }


            if (
                !Number.isInteger(guests) ||
                guests < 1 ||
                guests > 20
            ) {

                showStatus(
                    status,
                    "Guests must be between 1 and 20.",
                    "error"
                );

                restoreButton(submitButton);

                return;
            }


            /* ---------------------------
               BOOKING DATA
            --------------------------- */

            const bookingData = {

                full_name:
                    fullName,

                email:
                    email,

                phone:
                    phone || null,

                booking_type:
                    bookingType,

                state:
                    state || null,

                booking_date:
                    bookingDate || null,

                guests:
                    guests,

                message:
                    message || null,

                status:
                    "pending",

                payment_status:
                    "unpaid"

            };


            try {

                const {
                    data,
                    error
                } = await supabaseClient

                    .from("bookings")

                    .insert(
                        bookingData
                    )

                    .select("id")

                    .single();


                if (error) {

                    console.error(
                        "Supabase booking error:",
                        error
                    );


                    showStatus(
                        status,
                        getFriendlyError(error),
                        "error"
                    );


                    restoreButton(
                        submitButton
                    );

                    return;
                }


                console.log(
                    "Booking created:",
                    data
                );


                showStatus(
                    status,
                    "Booking request received successfully. Our management team will contact you shortly.",
                    "success"
                );


                form.reset();

            } catch (error) {

                console.error(
                    "Unexpected booking error:",
                    error
                );


                showStatus(
                    status,
                    "Something went wrong while submitting your booking. Please try again.",
                    "error"
                );

            } finally {

                restoreButton(
                    submitButton
                );

            }

        }
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   STATUS
========================================================= */

function showStatus(
    element,
    message,
    type
) {

    if (!element) return;


    element.textContent =
        message;


    element.dataset.status =
        type;


    element.setAttribute(
        "role",
        "status"
    );

}


/* =========================================================
   BUTTON RESTORE
========================================================= */

function restoreButton(button) {

    if (!button) return;


    button.disabled =
        false;


    button.textContent =
        button.dataset.originalText ||
        "Submit Booking Request";

}


/* =========================================================
   DATABASE ERROR
========================================================= */

function getFriendlyError(error) {

    if (
        error &&
        (
            error.code === "42501" ||
            String(error.message)
                .toLowerCase()
                .includes(
                    "row-level security"
                )
        )
    ) {

        return "The booking system could not authorize this request. Please contact management.";

    }


    if (
        error &&
        String(error.message)
            .toLowerCase()
            .includes("fetch")
    ) {

        return "We could not connect to the booking server. Please check your connection and try again.";

    }


    return "We couldn't submit your booking right now. Please try again or contact management.";

}


/* =========================================================
   YEAR
========================================================= */

function initializeCurrentYear() {

    const year =
        document.getElementById(
            "currentYear"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}
