/* =========================================================
   NATALYA BOOKINGS
   COMPLETE VANILLA JAVASCRIPT
   Supabase + Stripe Checkout
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
   STRIPE FUNCTION
========================================================= */

const STRIPE_FUNCTION_NAME = "create-checkout";


/* =========================================================
   FLIGHT PRICING
========================================================= */

const RESERVE_PASS_PRICE = 2500;


/*
   Route coordination estimates.

   These are NOT airline ticket prices.
   They are the route coordination amounts
   used by the booking calculator.
*/

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
   ALL 50 STATES
========================================================= */

const STATES = [

    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"

];


/* =========================================================
   STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Natalya Bookings JavaScript loaded."
        );


        await initializeSupabase();


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


        updateFlightSummary();

    }
);


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

async function initializeSupabase() {

    try {

        if (!window.supabase) {

            console.error(
                "Supabase library not found."
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
   MOBILE HAMBURGER MENU
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

        console.warn(
            "Mobile navigation elements not found."
        );

        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

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
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation
                            .classList
                            .remove("active");


                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuToggle.setAttribute(
                            "aria-label",
                            "Open navigation menu"
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


    if (!themeToggle) return;


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
        function () {

            document.body
                .classList
                .toggle("dark-mode");


            const isDark =
                document.body
                    .classList
                    .contains("dark-mode");


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
        slides.length <= 1
    ) {

        return;
    }


    let currentSlide = 0;


    slides.forEach(
        function (slide, index) {

            slide.classList.toggle(
                "active",
                index === 0
            );

        }
    );


    setInterval(
        function () {

            slides[
                currentSlide
            ].classList.remove(
                "active"
            );


            currentSlide =
                (
                    currentSlide + 1
                ) % slides.length;


            slides[
                currentSlide
            ].classList.add(
                "active"
            );


        },
        5000
    );

}


/* =========================================================
   POPULATE U.S. STATES
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


    if (
        !fromState ||
        !toState
    ) {

        console.warn(
            "State selectors not found."
        );

        return;
    }


    /*
       Prevent duplicate states if
       initialization somehow runs twice.
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
        function (state) {

            const fromOption =
                document.createElement(
                    "option"
                );

            fromOption.value =
                state;

            fromOption.textContent =
                state;


            const toOption =
                document.createElement(
                    "option"
                );

            toOption.value =
                state;

            toOption.textContent =
                state;


            fromState.appendChild(
                fromOption
            );

            toState.appendChild(
                toOption
            );

        }
    );


    console.log(
        "States loaded:",
        STATES.length
    );

}


/* =========================================================
   FLIGHT PRICING EVENTS
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


    if (fromState) {

        fromState.addEventListener(
            "change",
            updateFlightSummary
        );

    }


    if (toState) {

        toState.addEventListener(
            "change",
            updateFlightSummary
        );

    }


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
        !to
    ) {

        return 0;
    }


    const fromFee =
        STATE_FEES[from] || 0;

    const toFee =
        STATE_FEES[to] || 0;


    /*
       Same-state route.
    */

    if (
        from === to
    ) {

        return 250;
    }


    /*
       Average the two state
       coordination fees.
    */

    return Math.round(
        (
            fromFee +
            toFee
        ) / 2
    );

}


/* =========================================================
   UPDATE FLIGHT PRICE
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
        fromState
            ? fromState.value
            : "";


    const to =
        toState
            ? toState.value
            : "";


    let guests =
        guestsInput
            ? Number(
                guestsInput.value
            )
            : 1;


    if (
        !Number.isInteger(guests) ||
        guests < 1
    ) {

        guests = 1;
    }


    const singleRouteFee =
        calculateRouteFee(
            from,
            to
        );


    /*
       IMPORTANT:

       Route fee is multiplied
       by number of guests.
    */

    const totalRouteFee =
        singleRouteFee * guests;


    const total =
        RESERVE_PASS_PRICE +
        totalRouteFee;


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
                totalRouteFee
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
   DATE INITIALIZATION
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


    if (!departureDate) return;


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
            function () {

                if (
                    departureDate.value
                ) {

                    returnDate.min =
                        departureDate.value;

                }


                updateDateSummary();

            }
        );


        returnDate.addEventListener(
            "change",
            updateDateSummary
        );

    }


    departureDate.addEventListener(
        "change",
        updateDateSummary
    );


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
                departureDate
                    ? departureDate.value
                    : ""
            );

    }


    if (summaryReturn) {

        summaryReturn.textContent =
            formatDate(
                returnDate
                    ? returnDate.value
                    : ""
            );

    }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {

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
   BOOKING QUICK LINKS
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


    if (!bookingType) return;


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    const selectedType =
                        link.dataset
                            .bookingType;


                    if (
                        selectedType
                    ) {

                        bookingType.value =
                            selectedType;

                    }

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


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

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


            try {

                const fullName =
                    document.getElementById(
                        "fullName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "email"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "phone"
                    ).value.trim();


                const bookingType =
                    document.getElementById(
                        "bookingType"
                    ).value;


                const bookingDate =
                    document.getElementById(
                        "bookingDate"
                    ).value;


                const guests =
                    Number(
                        document.getElementById(
                            "guests"
                        ).value
                    );


                const message =
                    document.getElementById(
                        "message"
                    ).value.trim();


                if (
                    fullName.length < 2
                ) {

                    throw new Error(
                        "Please enter your full name."
                    );

                }


                if (
                    !isValidEmail(email)
                ) {

                    throw new Error(
                        "Please enter a valid email address."
                    );

                }


                if (
                    ![
                        "Flight Booking",
                        "Dinner Reservation",
                        "Fan Membership"
                    ].includes(
                        bookingType
                    )
                ) {

                    throw new Error(
                        "Please select a valid experience."
                    );

                }


                if (
                    !Number.isInteger(
                        guests
                    ) ||
                    guests < 1 ||
                    guests > 20
                ) {

                    throw new Error(
                        "Guests must be between 1 and 20."
                    );

                }


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
   FLIGHT BOOKING + STRIPE CHECKOUT
========================================================= */

function initializeFlightBooking() {

    const form =
        document.getElementById(
            "flightBookingForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const errorBox =
                document.getElementById(
                    "flightError"
                );


            hideFlightError(
                errorBox
            );


            if (!supabaseClient) {

                showFlightError(
                    errorBox,
                    "The booking system is temporarily unavailable. Please try again shortly."
                );

                return;
            }


            const submitButton =
                document.getElementById(
                    "flightCheckoutButton"
                );


            setButtonLoading(
                submitButton,
                true,
                "Preparing secure checkout..."
            );


            try {

                /* =========================================
                   CUSTOMER INFORMATION
                ========================================= */

                const fullName =
                    document.getElementById(
                        "flightFullName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "flightEmail"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "flightPhone"
                    ).value.trim();


                /* =========================================
                   ROUTE
                ========================================= */

                const fromState =
                    document.getElementById(
                        "fromState"
                    ).value;


                const toState =
                    document.getElementById(
                        "toState"
                    ).value;


                /* =========================================
                   DATES
                ========================================= */

                const departureDate =
                    document.getElementById(
                        "departureDate"
                    ).value;


                const returnDate =
                    document.getElementById(
                        "returnDate"
                    ).value;


                /* =========================================
                   GUESTS
                ========================================= */

                const guests =
                    Number(
                        document.getElementById(
                            "flightGuests"
                        ).value
                    );


                const message =
                    document.getElementById(
                        "flightMessage"
                    ).value.trim();


                /* =========================================
                   VALIDATION
                ========================================= */

                if (
                    fullName.length < 2
                ) {

                    throw new Error(
                        "Please enter your full name."
                    );

                }


                if (
                    !isValidEmail(email)
                ) {

                    throw new Error(
                        "Please enter a valid email address."
                    );

                }


                if (
                    !fromState ||
                    !toState
                ) {

                    throw new Error(
                        "Please select both your departure and destination states."
                    );

                }


                if (
                    fromState === toState
                ) {

                    throw new Error(
                        "Please select different departure and destination states."
                    );

                }


                if (
                    !departureDate ||
                    !returnDate
                ) {

                    throw new Error(
                        "Please select both departure and return dates."
                    );

                }


                if (
                    new Date(returnDate) <
                    new Date(departureDate)
                ) {

                    throw new Error(
                        "Return date cannot be earlier than the departure date."
                    );

                }


                if (
                    !Number.isInteger(
                        guests
                    ) ||
                    guests < 1 ||
                    guests > 20
                ) {

                    throw new Error(
                        "Guests must be between 1 and 20."
                    );

                }


                /* =========================================
                   CALCULATE PRICE
                ========================================= */

                const singleRouteFee =
                    calculateRouteFee(
                        fromState,
                        toState
                    );


                const totalRouteFee =
                    singleRouteFee *
                    guests;


                const totalAmount =
                    RESERVE_PASS_PRICE +
                    totalRouteFee;


                /* =========================================
                   CREATE SUPABASE BOOKING
                ========================================= */

                const bookingData = {

                    full_name:
                        fullName,

                    email:
                        email,

                    phone:
                        phone || null,

                    booking_type:
                        "Flight Booking",

                    booking_date:
                        departureDate,

                    guests:
                        guests,

                    message:
                        message || null,

                    from_state:
                        fromState,

                    to_state:
                        toState,

                    return_date:
                        returnDate,

                    total_amount:
                        totalAmount,

                    currency:
                        "usd",

                    status:
                        "pending",

                    payment_status:
                        "unpaid",

                    stripe_payment_status:
                        "unpaid"

                };


                const {
                    data: booking,
                    error: bookingError
                } =
                    await supabaseClient
                        .from("bookings")
                        .insert(
                            bookingData
                        )
                        .select(
                            "id"
                        )
                        .single();


                if (bookingError) {

                    throw bookingError;
                }


                console.log(
                    "Booking created:",
                    booking
                );


                /* =========================================
                   CREATE STRIPE CHECKOUT
                ========================================= */

                const {
                    data: checkoutData,
                    error: checkoutError
                } =
                    await supabaseClient
                        .functions
                        .invoke(
                            STRIPE_FUNCTION_NAME,
                            {
                                body: {

                                    booking_id:
                                        booking.id

                                }
                            }
                        );


                if (checkoutError) {

                    console.error(
                        "Stripe function error:",
                        checkoutError
                    );


                    throw new Error(
                        "We could not start secure Stripe checkout. Your booking was saved. Please contact management."
                    );

                }


                /* =========================================
                   GET CHECKOUT URL
                ========================================= */

                const checkoutUrl =
                    checkoutData &&
                    (
                        checkoutData.url ||
                        checkoutData.checkout_url
                    );


                if (!checkoutUrl) {

                    console.error(
                        "Stripe response:",
                        checkoutData
                    );


                    throw new Error(
                        "Stripe checkout did not return a payment link. Please contact management."
                    );

                }


                console.log(
                    "Stripe checkout ready."
                );


                /* =========================================
                   REDIRECT TO STRIPE
                ========================================= */

                window.location.href =
                    checkoutUrl;


            } catch (error) {

                console.error(
                    "Flight checkout error:",
                    error
                );


                showFlightError(
                    errorBox,
                    friendlyDatabaseError(
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
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================================
   GENERAL STATUS
========================================================= */

function showStatus(
    element,
    message,
    type
) {

    if (!element) return;


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

    if (!element) return;


    element.textContent =
        message;


    element.style.display =
        "block";


    element.style.background =
        "";


    element.style.color =
        "";

}


/* =========================================================
   HIDE FLIGHT ERROR
========================================================= */

function hideFlightError(
    element
) {

    if (!element) return;


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

    if (!button) return;


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
            "Continue to Secure Checkout →";

    }

}


/* =========================================================
   DATABASE ERROR HANDLING
========================================================= */

function friendlyDatabaseError(
    error
) {

    if (!error) {

        return "Something went wrong. Please try again.";

    }


    const rawMessage =
        String(
            error.message ||
            error ||
            ""
        );


    const message =
        rawMessage.toLowerCase();


    /* =========================================
       USER VALIDATION ERRORS
    ========================================= */

    if (
        message.includes(
            "please enter"
        ) ||
        message.includes(
            "please select"
        ) ||
        message.includes(
            "return date"
        ) ||
        message.includes(
            "guests must"
        )
    ) {

        return rawMessage;

    }


    /* =========================================
       RLS
    ========================================= */

    if (
        error.code === "42501" ||
        message.includes(
            "row-level security"
        )
    ) {

        return "The booking system could not authorize this request. Please check the Supabase booking permissions.";

    }


    /* =========================================
       TABLE MISSING
    ========================================= */

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


    /* =========================================
       STRIPE
    ========================================= */

    if (
        message.includes(
            "stripe checkout"
        )
    ) {

        return rawMessage;

    }


    /* =========================================
       NETWORK
    ========================================= */

    if (
        message.includes(
            "fetch"
        ) ||
        message.includes(
            "network"
        )
    ) {

        return "We could not connect to the booking server. Please check your internet connection and try again.";

    }


    return "We couldn't submit your booking right now. Please try again or contact management.";

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
