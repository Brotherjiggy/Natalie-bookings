/* =========================================================
   NATALYA BOOKINGS
   COMPLETE FRONTEND JAVASCRIPT
   SUPABASE + STRIPE SANDBOX CHECKOUT
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://wmrpfheokocubjephedq.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_Et7xOC8eazdAS1l5j3C5cA_vRy2qQL6";

const STRIPE_FUNCTION_NAME =
    "create-checkout";

let supabaseClient = null;


/* =========================================================
   FLIGHT PRICING
========================================================= */

const RESERVE_PASS_PRICE = 2500;

const STATE_FEES = {

    "Alabama": 450,
    "Alaska": 950,
    "Arizona": 750,
    "Arkansas": 500,
    "California": 850,
    "Colorado": 700,
    "Connecticut": 550,
    "Delaware": 500,
    "Florida": 700,
    "Georgia": 550,
    "Hawaii": 1200,
    "Idaho": 800,
    "Illinois": 600,
    "Indiana": 550,
    "Iowa": 550,
    "Kansas": 550,
    "Kentucky": 500,
    "Louisiana": 600,
    "Maine": 650,
    "Maryland": 500,
    "Massachusetts": 600,
    "Michigan": 600,
    "Minnesota": 650,
    "Mississippi": 550,
    "Missouri": 550,
    "Montana": 850,
    "Nebraska": 600,
    "Nevada": 800,
    "New Hampshire": 600,
    "New Jersey": 550,
    "New Mexico": 700,
    "New York": 600,
    "North Carolina": 550,
    "North Dakota": 700,
    "Ohio": 550,
    "Oklahoma": 600,
    "Oregon": 850,
    "Pennsylvania": 550,
    "Rhode Island": 600,
    "South Carolina": 550,
    "South Dakota": 700,
    "Tennessee": 550,
    "Texas": 650,
    "Utah": 750,
    "Vermont": 650,
    "Virginia": 500,
    "Washington": 900,
    "West Virginia": 550,
    "Wisconsin": 600,
    "Wyoming": 800

};


/* =========================================================
   U.S. STATES
========================================================= */

const STATES = Object.keys(STATE_FEES);


/* =========================================================
   STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Natalya Bookings JavaScript loaded."
        );

        /*
         * Supabase is initialized independently.
         * Visual features must not depend on it.
         */

        initializeSupabase();

        initializeMobileMenu();

        initializeTheme();

        initializeHeroSlideshow();

        initializeStates();

        initializeFlightPricing();

        initializeGeneralBooking();

        initializeFlightBooking();

        initializeBookingLinks();

        initializeDates();

        initializeCurrentYear();

        handlePaymentReturn();

    }
);


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

function initializeSupabase() {

    try {

        if (!window.supabase) {

            console.error(
                "Supabase library is unavailable."
            );

            return false;
        }


        supabaseClient =
            window.supabase.createClient(
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
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const navigation =
        document.getElementById(
            "primaryNavigation"
        );


    if (
        !menuToggle ||
        !navigation
    ) {

        return;
    }


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

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        navigation
                            .classList
                            .remove("active");

                        menuToggle
                            .setAttribute(
                                "aria-expanded",
                                "false"
                            );

                    }
                );

            }
        );

}


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

function initializeTheme() {

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    if (!themeToggle) {

        return;
    }


    const savedTheme =
        localStorage.getItem(
            "natalya-theme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body
            .classList
            .add("dark-mode");

    }


    themeToggle.addEventListener(
        "click",
        () => {

            document.body
                .classList
                .toggle("dark-mode");


            const isDark =
                document.body
                    .classList
                    .contains(
                        "dark-mode"
                    );


            localStorage.setItem(
                "natalya-theme",
                isDark
                    ? "dark"
                    : "light"
            );

        }
    );

}


/* =========================================================
   HERO SLIDESHOW
========================================================= */

function initializeHeroSlideshow() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    console.log(
        "Hero slides found:",
        slides.length
    );


    if (
        slides.length === 0
    ) {

        console.warn(
            "No .hero-slide elements found."
        );

        return;
    }


    /*
     * Make sure exactly one slide starts active.
     */

    let currentSlide = 0;


    slides.forEach(
        (slide, index) => {

            if (
                slide.classList.contains(
                    "active"
                )
            ) {

                currentSlide = index;

            }

        }
    );


    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );


    if (
        slides.length <= 1
    ) {

        return;
    }


    setInterval(
        () => {

            slides[currentSlide]
                .classList
                .remove("active");


            currentSlide =
                (
                    currentSlide + 1
                ) %
                slides.length;


            slides[currentSlide]
                .classList
                .add("active");


            console.log(
                "Hero slide:",
                currentSlide + 1
            );

        },
        5000
    );

}


/* =========================================================
   STATES
========================================================= */

function initializeStates() {

    const fromState =
        document.getElementById(
            "fromState"
        );

    const toState =
        document.getElementById(
            "toState"
        );


    console.log(
        "State dropdowns:",
        {
            from: Boolean(fromState),
            to: Boolean(toState)
        }
    );


    if (
        !fromState ||
        !toState
    ) {

        console.warn(
            "Flight state dropdowns were not found."
        );

        return;
    }


    /*
     * Preserve the first placeholder option.
     */

    fromState.innerHTML =
        `<option value="">
            Select departure state
        </option>`;


    toState.innerHTML =
        `<option value="">
            Select destination state
        </option>`;


    STATES.forEach(
        state => {

            const optionFrom =
                document.createElement(
                    "option"
                );

            optionFrom.value =
                state;

            optionFrom.textContent =
                state;


            const optionTo =
                document.createElement(
                    "option"
                );

            optionTo.value =
                state;

            optionTo.textContent =
                state;


            fromState.appendChild(
                optionFrom
            );

            toState.appendChild(
                optionTo
            );

        }
    );


    console.log(
        `Loaded ${STATES.length} U.S. states.`
    );


    updateFlightSummary();

}


/* =========================================================
   ROUTE FEE
========================================================= */

function calculateRouteFee(
    from,
    to
) {

    if (
        !from ||
        !to ||
        from === to
    ) {

        return 0;
    }


    const fromFee =
        STATE_FEES[from];

    const toFee =
        STATE_FEES[to];


    if (
        typeof fromFee !== "number" ||
        typeof toFee !== "number"
    ) {

        return 0;
    }


    return Math.round(
        (fromFee + toFee) / 2
    );

}


/* =========================================================
   FLIGHT PRICING
========================================================= */

function initializeFlightPricing() {

    const fromState =
        document.getElementById(
            "fromState"
        );

    const toState =
        document.getElementById(
            "toState"
        );

    const guests =
        document.getElementById(
            "flightGuests"
        );


    if (
        !fromState ||
        !toState
    ) {

        return;
    }


    fromState.addEventListener(
        "change",
        updateFlightSummary
    );


    toState.addEventListener(
        "change",
        updateFlightSummary
    );


    if (guests) {

        guests.addEventListener(
            "input",
            updateFlightSummary
        );

        guests.addEventListener(
            "change",
            updateFlightSummary
        );

    }


    updateFlightSummary();

}


/* =========================================================
   FLIGHT SUMMARY
========================================================= */

function updateFlightSummary() {

    const fromState =
        document.getElementById(
            "fromState"
        );

    const toState =
        document.getElementById(
            "toState"
        );

    const guestsInput =
        document.getElementById(
            "flightGuests"
        );


    const summaryFrom =
        document.getElementById(
            "summaryFrom"
        );

    const summaryTo =
        document.getElementById(
            "summaryTo"
        );

    const summaryRouteFee =
        document.getElementById(
            "summaryRouteFee"
        );

    const summaryTotal =
        document.getElementById(
            "summaryTotal"
        );


    const from =
        fromState?.value || "";


    const to =
        toState?.value || "";


    let guests =
        Number(
            guestsInput?.value || 1
        );


    if (
        !Number.isInteger(guests) ||
        guests < 1
    ) {

        guests = 1;
    }


    const routeFee =
        calculateRouteFee(
            from,
            to
        );


    /*
     * Reserve Pass:
     * $2,500
     *
     * Route fee:
     * route fee × guests
     */

    const total =
        RESERVE_PASS_PRICE +
        (
            routeFee * guests
        );


    if (summaryFrom) {

        summaryFrom.textContent =
            from || "—";

    }


    if (summaryTo) {

        summaryTo.textContent =
            to || "—";

    }


    if (summaryRouteFee) {

        summaryRouteFee.textContent =
            formatCurrency(
                routeFee
            );

    }


    if (summaryTotal) {

        summaryTotal.textContent =
            formatCurrency(
                total
            );

    }

}


/* =========================================================
   DATE CONTROLS
========================================================= */

function initializeDates() {

    const departureDate =
        document.getElementById(
            "departureDate"
        );

    const returnDate =
        document.getElementById(
            "returnDate"
        );


    if (!departureDate) {

        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const minimumDate =
        `${year}-${month}-${day}`;


    departureDate.min =
        minimumDate;


    if (returnDate) {

        returnDate.min =
            minimumDate;


        departureDate.addEventListener(
            "change",
            () => {

                if (
                    departureDate.value
                ) {

                    returnDate.min =
                        departureDate.value;

                }

                updateDateSummary();

            }
        );

    }


    departureDate.addEventListener(
        "change",
        updateDateSummary
    );


    if (returnDate) {

        returnDate.addEventListener(
            "change",
            updateDateSummary
        );

    }


    updateDateSummary();

}


/* =========================================================
   DATE SUMMARY
========================================================= */

function updateDateSummary() {

    const departureDate =
        document.getElementById(
            "departureDate"
        );

    const returnDate =
        document.getElementById(
            "returnDate"
        );


    const summaryDeparture =
        document.getElementById(
            "summaryDeparture"
        );

    const summaryReturn =
        document.getElementById(
            "summaryReturn"
        );


    if (summaryDeparture) {

        summaryDeparture.textContent =
            formatDate(
                departureDate?.value
            );

    }


    if (summaryReturn) {

        summaryReturn.textContent =
            formatDate(
                returnDate?.value
            );

    }

}


/* =========================================================
   GENERAL BOOKING LINKS
========================================================= */

function initializeBookingLinks() {

    const links =
        document.querySelectorAll(
            "[data-booking-type]"
        );

    const bookingType =
        document.getElementById(
            "bookingType"
        );


    if (!bookingType) {

        return;
    }


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    bookingType.value =
                        link.dataset
                            .bookingType;

                }
            );

        }
    );

}


/* =========================================================
   GENERAL BOOKING FORM
========================================================= */

function initializeGeneralBooking() {

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


            const submitButton =
                form.querySelector(
                    "button[type='submit']"
                );


            setButtonLoading(
                submitButton,
                true,
                "Submitting..."
            );


            const fullName =
                document.getElementById(
                    "fullName"
                )?.value.trim() || "";


            const email =
                document.getElementById(
                    "email"
                )?.value.trim() || "";


            const phone =
                document.getElementById(
                    "phone"
                )?.value.trim() || "";


            const bookingType =
                document.getElementById(
                    "bookingType"
                )?.value || "";


            const bookingDate =
                document.getElementById(
                    "bookingDate"
                )?.value || "";


            const guests =
                Number(
                    document.getElementById(
                        "guests"
                    )?.value || 1
                );


            const message =
                document.getElementById(
                    "message"
                )?.value.trim() || "";


            try {

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


                const {
                    error
                } =
                    await supabaseClient
                        .from("bookings")
                        .insert(
                            bookingData
                        );


                if (error) {

                    throw error;
                }


                showStatus(
                    status,
                    "Booking request received successfully. Our management team will contact you shortly.",
                    "success"
                );


                form.reset();

            } catch (error) {

                console.error(
                    "General booking error:",
                    error
                );


                showStatus(
                    status,
                    friendlyDatabaseError(
                        error
                    ),
                    "error"
                );

            } finally {

                setButtonLoading(
                    submitButton,
                    false
                );

            }

        }
    );

}


/* =========================================================
   FLIGHT BOOKING + STRIPE
========================================================= */

function initializeFlightBooking() {

    const form =
        document.getElementById(
            "flightBookingForm"
        );


    if (!form) {

        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const errorBox =
                document.getElementById(
                    "flightError"
                );


            hideFlightError(
                errorBox
            );


            /* -----------------------------------------
               FORM VALUES
            ----------------------------------------- */

            const fullName =
                document.getElementById(
                    "flightFullName"
                )?.value.trim() || "";


            const email =
                document.getElementById(
                    "flightEmail"
                )?.value.trim() || "";


            const phone =
                document.getElementById(
                    "flightPhone"
                )?.value.trim() || "";


            const fromState =
                document.getElementById(
                    "fromState"
                )?.value || "";


            const toState =
                document.getElementById(
                    "toState"
                )?.value || "";


            const departureDate =
                document.getElementById(
                    "departureDate"
                )?.value || "";


            const returnDate =
                document.getElementById(
                    "returnDate"
                )?.value || "";


            const guests =
                Number(
                    document.getElementById(
                        "flightGuests"
                    )?.value || 1
                );


            const message =
                document.getElementById(
                    "flightMessage"
                )?.value.trim() || "";


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (
                fullName.length < 2
            ) {

                showFlightError(
                    errorBox,
                    "Please enter your full name."
                );

                return;
            }


            if (
                !isValidEmail(email)
            ) {

                showFlightError(
                    errorBox,
                    "Please enter a valid email address."
                );

                return;
            }


            if (
                !fromState ||
                !toState
            ) {

                showFlightError(
                    errorBox,
                    "Please select both your departure and destination states."
                );

                return;
            }


            if (
                fromState === toState
            ) {

                showFlightError(
                    errorBox,
                    "Please select different departure and destination states."
                );

                return;
            }


            if (
                !departureDate ||
                !returnDate
            ) {

                showFlightError(
                    errorBox,
                    "Please select both departure and return dates."
                );

                return;
            }


            if (
                new Date(returnDate) <
                new Date(departureDate)
            ) {

                showFlightError(
                    errorBox,
                    "Return date cannot be earlier than the departure date."
                );

                return;
            }


            if (
                !Number.isInteger(guests) ||
                guests < 1 ||
                guests > 20
            ) {

                showFlightError(
                    errorBox,
                    "Guests must be between 1 and 20."
                );

                return;
            }


            /* -----------------------------------------
               BUTTON
            ----------------------------------------- */

            const submitButton =
                document.getElementById(
                    "flightCheckoutButton"
                );


            setButtonLoading(
                submitButton,
                true,
                "Creating secure checkout..."
            );


            try {

                /* -------------------------------------
                   CALL SUPABASE EDGE FUNCTION
                ------------------------------------- */

                const functionUrl =
                    `${SUPABASE_URL}/functions/v1/${STRIPE_FUNCTION_NAME}`;


                const response =
                    await fetch(
                        functionUrl,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "apikey":
                                    SUPABASE_ANON_KEY,

                                "Authorization":
                                    `Bearer ${SUPABASE_ANON_KEY}`

                            },

                            body:
                                JSON.stringify({

                                    fullName:
                                        fullName,

                                    email:
                                        email,

                                    phone:
                                        phone,

                                    bookingType:
                                        "Flight Booking",

                                    bookingDate:
                                        departureDate,

                                    departureState:
                                        fromState,

                                    destinationState:
                                        toState,

                                    returnDate:
                                        returnDate,

                                    guests:
                                        guests,

                                    message:
                                        message

                                })
                        }
                    );


                /* -------------------------------------
                   RESPONSE
                ------------------------------------- */

                let data;


                try {

                    data =
                        await response.json();

                } catch (error) {

                    throw new Error(
                        "The secure checkout service returned an invalid response."
                    );

                }


                if (
                    !response.ok ||
                    !data ||
                    !data.success
                ) {

                    console.error(
                        "Checkout service error:",
                        data
                    );


                    throw new Error(
                        data?.error ||
                        "Unable to create secure Stripe checkout."
                    );

                }


                if (
                    !data.checkoutUrl
                ) {

                    throw new Error(
                        "Stripe checkout was created but no checkout URL was returned."
                    );

                }


                console.log(
                    "Booking ID:",
                    data.bookingId
                );


                console.log(
                    "Stripe Session:",
                    data.sessionId
                );


                /* -------------------------------------
                   REDIRECT TO STRIPE
                ------------------------------------- */

                window.location.href =
                    data.checkoutUrl;

            } catch (error) {

                console.error(
                    "Flight checkout error:",
                    error
                );


                showFlightError(
                    errorBox,
                    friendlyCheckoutError(
                        error
                    )
                );


                setButtonLoading(
                    submitButton,
                    false
                );

            }

        }
    );

}


/* =========================================================
   PAYMENT RETURN
========================================================= */

function handlePaymentReturn() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const payment =
        params.get(
            "payment"
        );


    if (
        payment === "success"
    ) {

        showGlobalMessage(
            "Your payment was completed successfully. Your booking has been received."
        );

    }


    if (
        payment === "cancelled"
    ) {

        showGlobalMessage(
            "Checkout was cancelled. Your booking request has not been paid."
        );

    }

}


/* =========================================================
   GLOBAL PAYMENT MESSAGE
========================================================= */

function showGlobalMessage(
    message
) {

    const existing =
        document.getElementById(
            "paymentReturnMessage"
        );


    if (existing) {

        existing.textContent =
            message;

        return;
    }


    const messageBox =
        document.createElement(
            "div"
        );


    messageBox.id =
        "paymentReturnMessage";


    messageBox.textContent =
        message;


    messageBox.setAttribute(
        "role",
        "status"
    );


    messageBox.style.position =
        "fixed";


    messageBox.style.top =
        "20px";


    messageBox.style.left =
        "20px";


    messageBox.style.right =
        "20px";


    messageBox.style.zIndex =
        "99999";


    messageBox.style.padding =
        "16px";


    messageBox.style.borderRadius =
        "12px";


    messageBox.style.background =
        "#ffffff";


    messageBox.style.color =
        "#111111";


    messageBox.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        () => {

            messageBox.remove();

        },
        8000
    );

}


/* =========================================================
   ERROR HANDLING
========================================================= */

function friendlyCheckoutError(
    error
) {

    if (!error) {

        return "We couldn't start secure checkout. Please try again.";

    }


    const message =
        String(
            error.message || ""
        );


    if (
        message.includes(
            "Failed to fetch"
        )
    ) {

        return "We couldn't connect to the secure checkout service. Please try again.";

    }


    if (
        message.includes(
            "Invalid state selected"
        )
    ) {

        return "One of the selected states is invalid. Please select your route again.";

    }


    if (
        message.includes(
            "Departure and destination states must be different"
        )
    ) {

        return "Please select different departure and destination states.";

    }


    if (
        message.includes(
            "Missing required booking information"
        )
    ) {

        return "Please complete all required booking information.";

    }


    return message ||
        "We couldn't start secure checkout. Please try again.";

}


/* =========================================================
   DATABASE ERROR
========================================================= */

function friendlyDatabaseError(
    error
) {

    if (!error) {

        return "Something went wrong. Please try again.";

    }


    const message =
        String(
            error.message || ""
        ).toLowerCase();


    if (
        error.code === "42501" ||
        message.includes(
            "row-level security"
        )
    ) {

        return "The booking system could not authorize this request. Please check the Supabase booking permissions.";

    }


    if (
        message.includes(
            "relation"
        ) &&
        message.includes(
            "does not exist"
        )
    ) {

        return "The bookings database table could not be found.";

    }


    return "We couldn't submit your booking right now. Please try again.";

}


/* =========================================================
   FORM STATUS
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


    element.className =
        `form-status ${type}`;

}


/* =========================================================
   FLIGHT ERROR
========================================================= */

function showFlightError(
    element,
    message
) {

    if (!element) {

        return;
    }


    element.textContent =
        message;


    element.style.display =
        "block";

}


function hideFlightError(
    element
) {

    if (!element) {

        return;
    }


    element.textContent =
        "";


    element.style.display =
        "none";

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading,
    text = ""
) {

    if (!button) {

        return;
    }


    if (loading) {

        if (
            !button.dataset.originalText
        ) {

            button.dataset.originalText =
                button.textContent;

        }


        button.disabled =
            true;


        button.textContent =
            text;

    } else {

        button.disabled =
            false;


        button.textContent =
            button.dataset.originalText ||
            "Submit Booking Request";

    }

}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(
    amount
) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(
        amount
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value
) {

    if (!value) {

        return "—";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";
    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

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
            new Date()
                .getFullYear();

    }

       }
