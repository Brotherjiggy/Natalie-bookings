/* =========================================================
   NATALIE BOOKINGS
   VANILLA JAVASCRIPT + SUPABASE
========================================================= */


/* =========================================================
   SUPABASE
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
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeSupabase();

        initializeMobileMenu();

        initializeHeroSlider();

        initializeBookingSelectors();

        initializeBookingForm();

        initializeGoalDisplay();

        initializeCurrentYear();

        initializeDateRestriction();
    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const toggle =
        document.getElementById(
            "menuToggle"
        );

    const navigation =
        document.getElementById(
            "primaryNavigation"
        );

    if (!toggle || !navigation) {
        return;
    }


    toggle.addEventListener(
        "click",
        () => {

            const open =
                navigation.classList.toggle(
                    "active"
                );

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );

            toggle.setAttribute(
                "aria-label",
                open
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

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );
        });
}


/* =========================================================
   HERO IMAGE SLIDER
========================================================= */

function initializeHeroSlider() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );

    const dots =
        document.querySelectorAll(
            ".hero-dot"
        );

    if (!slides.length) {
        return;
    }


    let currentSlide = 0;


    function showSlide(index) {

        slides.forEach(
            (slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === index
                );
            }
        );


        dots.forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === index
                );
            }
        );


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
        5000
    );
}


/* =========================================================
   BOOKING SELECTORS
========================================================= */

function initializeBookingSelectors() {

    const links =
        document.querySelectorAll(
            ".booking-selector"
        );

    const select =
        document.getElementById(
            "bookingType"
        );

    if (!select) {
        return;
    }


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    const type =
                        link.dataset.bookingType;

                    if (type) {

                        select.value = type;

                        updateBookingPrice(type);
                    }
                }
            );
        }
    );


    select.addEventListener(
        "change",
        () => {

            updateBookingPrice(
                select.value
            );
        }
    );
}


/* =========================================================
   PRICE DISPLAY
========================================================= */

function updateBookingPrice(type) {

    const priceBox =
        document.querySelector(
            ".booking-price-box"
        );

    if (!priceBox) {
        return;
    }


    const title =
        priceBox.querySelector(
            "span"
        );

    const price =
        priceBox.querySelector(
            "strong"
        );

    const description =
        priceBox.querySelector(
            "small"
        );


    if (type === "Flight Booking") {

        title.textContent =
            "Reserve Pass";

        price.textContent =
            "$2,500";

        description.textContent =
            "Listed reservation price";

    } else if (
        type === "Dinner Reservation"
    ) {

        title.textContent =
            "Dinner Reservation";

        price.textContent =
            "Request";

        description.textContent =
            "Management confirmation";

    } else if (
        type === "Fan Membership"
    ) {

        title.textContent =
            "Community Membership";

        price.textContent =
            "Community";

        description.textContent =
            "Membership request";

    } else {

        title.textContent =
            "Reserve Pass";

        price.textContent =
            "$2,500";

        description.textContent =
            "Listed reservation price";
    }
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

    if (!form) {
        return;
    }


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


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (button) {

                button.disabled = true;

                button.dataset.originalText =
                    button.textContent;

                button.textContent =
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


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (fullName.length < 2) {

                showStatus(
                    status,
                    "Please enter your full name.",
                    "error"
                );

                restoreButton(button);

                return;
            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email)
            ) {

                showStatus(
                    status,
                    "Please enter a valid email address.",
                    "error"
                );

                restoreButton(button);

                return;
            }


            const validTypes = [
                "Flight Booking",
                "Dinner Reservation",
                "Fan Membership"
            ];


            if (
                !validTypes.includes(
                    bookingType
                )
            ) {

                showStatus(
                    status,
                    "Please select an experience.",
                    "error"
                );

                restoreButton(button);

                return;
            }


            if (!state) {

                showStatus(
                    status,
                    "Please select your preferred U.S. state.",
                    "error"
                );

                restoreButton(button);

                return;
            }


            if (!bookingDate) {

                showStatus(
                    status,
                    "Please select a preferred date.",
                    "error"
                );

                restoreButton(button);

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

                restoreButton(button);

                return;
            }


            /* -----------------------------------------
               DATABASE PAYLOAD
               
               IMPORTANT:
               The existing SQL table has no "state"
               column, so state is included in the
               message rather than changing the table.
            ----------------------------------------- */

            let finalMessage = message;


            if (state) {

                finalMessage =
                    `Preferred U.S. State: ${state}\n\n` +
                    `Additional Information:\n` +
                    `${message || "None provided."}`;
            }


            const bookingData = {

                full_name: fullName,

                email: email,

                phone: phone || null,

                booking_type: bookingType,

                booking_date: bookingDate,

                guests: guests,

                message:
                    finalMessage || null,

                status: "pending",

                payment_status: "unpaid"
            };


            /* -----------------------------------------
               SEND TO SUPABASE
               
               Notice:
               We intentionally do NOT use
               .select()
               because anonymous visitors should
               not be able to read booking records.
            ----------------------------------------- */

            try {

                const { error } =
                    await supabaseClient
                        .from("bookings")
                        .insert(
                            bookingData
                        );


                if (error) {

                    console.error(
                        "Supabase booking error:",
                        error
                    );


                    showStatus(
                        status,
                        getDatabaseErrorMessage(
                            error
                        ),
                        "error"
                    );


                    restoreButton(button);

                    return;
                }


                /* -------------------------------------
                   SUCCESS
                ------------------------------------- */

                showStatus(
                    status,
                    "Reservation request received successfully. Management will review your request and contact you.",
                    "success"
                );


                form.reset();

                updateBookingPrice("");


            } catch (error) {

                console.error(
                    "Unexpected error:",
                    error
                );


                showStatus(
                    status,
                    "Something went wrong while submitting your reservation. Please try again.",
                    "error"
                );

            } finally {

                restoreButton(button);
            }
        }
    );
}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function showStatus(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.dataset.status =
        type;
}


/* =========================================================
   RESTORE BUTTON
========================================================= */

function restoreButton(button) {

    if (!button) {
        return;
    }


    button.disabled = false;


    button.textContent =
        button.dataset.originalText ||
        "Submit Reservation";
}


/* =========================================================
   DATABASE ERROR HANDLER
========================================================= */

function getDatabaseErrorMessage(error) {

    const message =
        String(
            error?.message || ""
        ).toLowerCase();


    if (
        error?.code === "42501" ||
        message.includes(
            "row-level security"
        ) ||
        message.includes(
            "permission denied"
        )
    ) {

        return "The booking system could not authorize this request. Please contact management.";
    }


    if (
        error?.code === "42P01"
    ) {

        return "The booking database could not be found. Please contact management.";
    }


    if (
        error?.code === "23502"
    ) {

        return "Please complete all required booking information.";
    }


    if (
        error?.code === "22P02"
    ) {

        return "One of the submitted details is invalid. Please check the form and try again.";
    }


    if (
        message.includes("network") ||
        message.includes("fetch")
    ) {

        return "Unable to connect to the booking server. Please check your internet connection and try again.";
    }


    return "We couldn't submit your reservation right now. Please try again.";
}


/* =========================================================
   COMMUNITY GOAL
========================================================= */

function initializeGoalDisplay() {

    /*
       Keep this at 0 until you have verified campaign
       accounting data.

       Change this value only to an independently
       verified amount actually raised.
    */

    const raised =
        0;

    const goal =
        10000000;


    const percentage =
        Math.min(
            (raised / goal) * 100,
            100
        );


    const progress =
        document.getElementById(
            "progressBar"
        );


    const amount =
        document.getElementById(
            "raisedAmount"
        );


    if (progress) {

        progress.style.width =
            `${percentage}%`;
    }


    if (amount) {

        amount.textContent =
            `$${raised.toLocaleString()} raised`;
    }
}


/* =========================================================
   DATE RESTRICTION
========================================================= */

function initializeDateRestriction() {

    const dateInput =
        document.getElementById(
            "bookingDate"
        );

    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.min =
        `${year}-${month}-${day}`;
}


/* =========================================================
   CURRENT YEAR
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
