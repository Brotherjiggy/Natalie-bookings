/* =========================================================
   NATALIE BOOKINGS
   VANILLA JAVASCRIPT
   SUPABASE + HERO SLIDER + BOOKING SYSTEM
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

    return new Promise(
        (resolve, reject) => {

            if (window.supabase) {

                resolve(
                    window.supabase
                );

                return;
            }


            const script =
                document.createElement(
                    "script"
                );


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


                resolve(
                    window.supabase
                );
            };


            script.onerror = () => {

                reject(
                    new Error(
                        "Unable to load Supabase."
                    )
                );
            };


            document.head.appendChild(
                script
            );
        }
    );
}


/* =========================================================
   INITIALIZE SUPABASE
========================================================= */

async function initializeSupabase() {

    try {

        const library =
            await loadSupabase();


        supabaseClient =
            library.createClient(
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
   PAGE START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeSupabase();

        initializeMobileMenu();

        initializeHeroSlider();

        initializeBookingSelectors();

        initializeBookingForm();

        initializeDate();

        initializeCommunityGoal();

        initializeCurrentYear();

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
                    ? "Close menu"
                    : "Open menu"
            );
        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(
            link => {

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
            }
        );
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
            ".slider-dot"
        );


    if (!slides.length) {

        return;
    }


    let current = 0;


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


        current = index;
    }


    dots.forEach(
        dot => {

            dot.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            dot.dataset.slide
                        );


                    showSlide(index);
                }
            );
        }
    );


    setInterval(
        () => {

            const next =
                (current + 1)
                % slides.length;


            showSlide(next);

        },
        5000
    );
}


/* =========================================================
   BOOKING EXPERIENCE SELECTORS
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

                        select.value =
                            type;

                        updatePrice(type);
                    }
                }
            );
        }
    );


    select.addEventListener(
        "change",
        () => {

            updatePrice(
                select.value
            );
        }
    );
}


/* =========================================================
   PRICE DISPLAY
========================================================= */

function updatePrice(type) {

    const price =
        document.querySelector(
            ".price-highlight strong"
        );


    const title =
        document.querySelector(
            ".price-highlight span"
        );


    const description =
        document.querySelector(
            ".price-highlight small"
        );


    if (!price || !title || !description) {

        return;
    }


    if (type === "Flight Booking") {

        title.textContent =
            "Flight / Reserve Pass";

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
            "Contact";

        description.textContent =
            "Management will confirm pricing";

    } else if (
        type === "Fan Membership"
    ) {

        title.textContent =
            "Fan Membership";

        price.textContent =
            "Contact";

        description.textContent =
            "Management will confirm pricing";

    } else {

        title.textContent =
            "Flight / Reserve Pass";

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


            const data =
                new FormData(form);


            const fullName =
                String(
                    data.get("fullName") || ""
                ).trim();


            const email =
                String(
                    data.get("email") || ""
                ).trim();


            const phone =
                String(
                    data.get("phone") || ""
                ).trim();


            const bookingType =
                String(
                    data.get("bookingType") || ""
                ).trim();


            const state =
                String(
                    data.get("state") || ""
                ).trim();


            const bookingDate =
                String(
                    data.get("bookingDate") || ""
                ).trim();


            const guests =
                Number(
                    data.get("guests") || 1
                );


            const message =
                String(
                    data.get("message") || ""
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


            if (
                ![
                    "Flight Booking",
                    "Dinner Reservation",
                    "Fan Membership"
                ].includes(bookingType)
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
               SAVE STATE INSIDE EXISTING MESSAGE FIELD

               We are NOT changing the SQL table.
            ----------------------------------------- */

            const finalMessage =
                `Preferred U.S. State: ${state}\n\n` +
                `Additional Details:\n` +
                `${message || "None provided."}`;


            /* -----------------------------------------
               SUPABASE PAYLOAD
            ----------------------------------------- */

            const bookingData = {

                full_name:
                    fullName,

                email:
                    email,

                phone:
                    phone || null,

                booking_type:
                    bookingType,

                booking_date:
                    bookingDate,

                guests:
                    guests,

                message:
                    finalMessage,

                status:
                    "pending",

                payment_status:
                    "unpaid"
            };


            /* -----------------------------------------
               INSERT

               IMPORTANT:
               No .select() here.

               Anonymous visitors can submit,
               but cannot read booking records.
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
                        getFriendlyError(error),
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
                    "Booking request received successfully. Management will review your request and contact you.",
                    "success"
                );


                form.reset();


                updatePrice("");


            } catch (error) {

                console.error(
                    "Unexpected booking error:",
                    error
                );


                showStatus(
                    status,
                    "Something went wrong while submitting your request. Please try again.",
                    "error"
                );

            } finally {

                restoreButton(button);
            }
        }
    );
}


/* =========================================================
   DATABASE ERRORS
========================================================= */

function getFriendlyError(error) {

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

        return "One of the submitted details is invalid. Please check the form.";
    }


    if (
        message.includes("network") ||
        message.includes("fetch")
    ) {

        return "Unable to connect to the booking server. Please check your connection and try again.";
    }


    return "We couldn't submit your booking right now. Please try again.";
}


/* =========================================================
   STATUS
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
        "Submit Booking Request";
}


/* =========================================================
   DATE
========================================================= */

function initializeDate() {

    const input =
        document.getElementById(
            "bookingDate"
        );


    if (!input) {

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


    input.min =
        `${year}-${month}-${day}`;
}


/* =========================================================
   COMMUNITY GOAL
========================================================= */

function initializeCommunityGoal() {

    /*
       Only enter a verified amount actually raised.

       The target is $1,000,000.
    */

    const raised =
        0;


    const target =
        1000000;


    const percentage =
        Math.min(
            (raised / target) * 100,
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
