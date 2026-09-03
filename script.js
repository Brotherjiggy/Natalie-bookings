"use strict";
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
   FLIGHT PRICING
========================================================= */

const RESERVE_PASS_PRICE = 2500;


/*
   Route coordination fee for each guest.
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
   ALL U.S. STATES
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
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

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

        checkPaymentStatus();

    }
);


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

async function initializeSupabase() {

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
   MOBILE NAVIGATION
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


                        menuToggle
                            .setAttribute(
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
/* ==========================================
   CLOSE MENU WHEN CLICKING OUTSIDE
========================================== */

document.addEventListener("click", function (event) {

    const clickedInsideMenu =
        elements.mainNav.contains(event.target);

    const clickedMenuButton =
        elements.menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {

        elements.mainNav.classList.remove("open");

    }

});


/* =========================================================
   HERO IMAGE SLIDESHOW
========================================================= */

function initializeHeroSlideshow() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    if (
        slides.length <= 1
    ) {

        return;
    }


    let currentSlide = 0;


    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === 0
            );

        }
    );


    setInterval(
        () => {

            slides[currentSlide]
                .classList
                .remove("active");


            currentSlide =
                (
                    currentSlide + 1
                ) % slides.length;


            slides[currentSlide]
                .classList
                .add("active");

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


    if (
        !fromState ||
        !toState
    ) {

        console.error(
            "State selectors were not found."
        );

        return;
    }


    /*
       Prevent duplicate options if
       the script is loaded more than once.
    */

    if (
        fromState.options.length <= 1
    ) {

        STATES.forEach(
            state => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    state;

                option.textContent =
                    state;

                fromState.appendChild(
                    option
                );

            }
        );

    }


    if (
        toState.options.length <= 1
    ) {

        STATES.forEach(
            state => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    state;

                option.textContent =
                    state;

                toState.appendChild(
                    option
                );

            }
        );

    }


    console.log(
        "U.S. states loaded:",
        STATES.length
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
   CALCULATE ROUTE FEE
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
       Average the two state fees.
    */

    return Math.round(
        (
            fromFee +
            toFee
        ) / 2
    );

}


/* =========================================================
   UPDATE FLIGHT SUMMARY
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


    const guests =
        Math.max(
            1,
            Number(
                guestsInput?.value || 1
            )
        );


    const routeFee =
        calculateRouteFee(
            from,
            to
        );


    /*
       Route fee is charged per guest.
    */

    const routeTotal =
        routeFee * guests;


    const total =
        RESERVE_PASS_PRICE +
        routeTotal;


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
                routeTotal
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

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


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


    if (bookingDate) {

        bookingDate.min =
            minimumDate;

    }


    if (departureDate) {

        departureDate.min =
            minimumDate;

        departureDate.addEventListener(
            "change",
            updateDateSummary
        );

    }


    if (returnDate) {

        returnDate.min =
            minimumDate;

        returnDate.addEventListener(
            "change",
            updateDateSummary
        );

    }


    if (
        departureDate &&
        returnDate
    ) {

        departureDate.addEventListener(
            "change",
            () => {

                if (
                    departureDate.value
                ) {

                    returnDate.min =
                        departureDate.value;

                }

            }
        );

    }


    updateDateSummary();

}


/* =========================================================
   UPDATE DATE SUMMARY
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


            try {

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


                const allowedBookingTypes = [

                    "Flight Booking",

                    "Dinner Reservation",

                    "Fan Membership"

                ];


                if (
                    !allowedBookingTypes
                        .includes(
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

                    console.error(
                        "GENERAL BOOKING ERROR:",
                        error
                    );

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
                    "GENERAL BOOKING ERROR:",
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


            if (!supabaseClient) {

                showFlightError(
                    errorBox,
                    "The booking system is temporarily unavailable. Please try again shortly."
                );

                return;
            }


            /* =====================================
               GET FORM VALUES
            ===================================== */

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


            /* =====================================
               VALIDATION
            ===================================== */

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
                !Number.isInteger(
                    guests
                ) ||
                guests < 1 ||
                guests > 20
            ) {

                showFlightError(
                    errorBox,
                    "Guests must be between 1 and 20."
                );

                return;
            }


            /* =====================================
               CALCULATE PRICE
            ===================================== */

            const routeFee =
                calculateRouteFee(
                    fromState,
                    toState
                );


            /*
               Route fee is multiplied
               by number of guests.
            */

            const routeTotal =
                routeFee * guests;


            const total =
                RESERVE_PASS_PRICE +
                routeTotal;


            console.log(
                "Flight pricing:",
                {
                    reservePass:
                        RESERVE_PASS_PRICE,

                    routeFeePerGuest:
                        routeFee,

                    guests:
                        guests,

                    routeTotal:
                        routeTotal,

                    total:
                        total
                }
            );


            /* =====================================
               BUTTON
            ===================================== */

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

                /* =================================
                   SAVE BOOKING
                ================================= */

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
                        total,

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
                        .select("id")
                        .single();


                if (bookingError) {

                    console.error(
                        "SUPABASE BOOKING ERROR:",
                        bookingError
                    );

                    throw bookingError;

                }


                if (
                    !booking ||
                    !booking.id
                ) {

                    throw new Error(
                        "Booking was saved but no booking ID was returned."
                    );

                }


                console.log(
                    "Booking saved successfully:",
                    booking.id
                );


                /* =================================
                   CREATE STRIPE CHECKOUT
                ================================= */

                console.log(
                    "Sending checkout request:",
                    {
                        booking_id:
                            booking.id,

                        full_name:
                            fullName,

                        email:
                            email,

                        amount:
                            total,

                        currency:
                            "usd"
                    }
                );


                const {
                    data: checkoutData,
                    error: checkoutError
                } =
                    await supabaseClient
                        .functions
                        .invoke(
                            "create-checkout",
                            {
                                body: {

                                    booking_id:
                                        booking.id,

                                    full_name:
                                        fullName,

                                    email:
                                        email,

                                    amount:
                                        total,

                                    currency:
                                        "usd"

                                }
                            }
                        );


                if (checkoutError) {

                    console.error(
                        "STRIPE FUNCTION ERROR:",
                        checkoutError
                    );

                    throw new Error(
                        "We could not start secure Stripe checkout. Your booking was saved. Please contact management."
                    );

                }


                console.log(
                    "Stripe checkout response:",
                    checkoutData
                );


                if (
                    !checkoutData
                ) {

                    throw new Error(
                        "Stripe returned an empty checkout response."
                    );

                }


                if (
                    !checkoutData.success
                ) {

                    throw new Error(
                        checkoutData.error ||
                        "Stripe checkout could not be created."
                    );

                }


                if (
                    !checkoutData.url
                ) {

                    throw new Error(
                        "Stripe checkout URL was not returned."
                    );

                }


                /* =================================
                   SEND CUSTOMER TO STRIPE
                ================================= */

                window.location.href =
                    checkoutData.url;


            } catch (error) {

                console.error(
                    "FLIGHT CHECKOUT ERROR:",
                    error
                );


                showFlightError(
                    errorBox,
                    error.message ||
                    "We could not start secure Stripe checkout. Your booking was saved. Please contact management."
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
   CURRENCY
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
        Number(amount) || 0
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   GENERAL STATUS
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


    element.classList.add(
        "error"
    );

}


/* =========================================================
   HIDE FLIGHT ERROR
========================================================= */

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
   DATABASE ERROR HANDLING
========================================================= */

function friendlyDatabaseError(
    error
) {

    if (!error) {

        return "Something went wrong. Please try again.";

    }


    console.error(
        "Database error:",
        error
    );


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


    if (
        message.includes(
            "duplicate"
        )
    ) {

        return "This booking already exists. Please try again.";

    }


    if (
        message.includes(
            "network"
        ) ||
        message.includes(
            "fetch"
        )
    ) {

        return "We could not connect to the booking server. Please check your internet connection and try again.";

    }


    return (
        error.message ||
        "We couldn't submit your booking right now. Please try again."
    );

}


/* =========================================================
   PAYMENT STATUS
========================================================= */

function checkPaymentStatus() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const payment =
        params.get(
            "payment"
        );


    const bookingId =
        params.get(
            "booking_id"
        );


    if (
        payment !== "success"
    ) {

        return;
    }


    console.log(
        "Payment success detected.",
        bookingId
    );


    /*
       The Stripe webhook should update
       the booking's payment status.

       We only show a confirmation message
       here after Stripe redirects the customer.
    */

    const message =
        document.createElement(
            "div"
        );


    message.textContent =
        "Payment completed successfully. Your booking has been received. Management will contact you with the next steps.";


    message.style.position =
        "fixed";

    message.style.top =
        "20px";

    message.style.left =
        "50%";

    message.style.transform =
        "translateX(-50%)";

    message.style.zIndex =
        "99999";

    message.style.maxWidth =
        "90%";

    message.style.padding =
        "16px 22px";

    message.style.borderRadius =
        "10px";

    message.style.background =
        "#e8f8ed";

    message.style.color =
        "#196b35";

    message.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.15)";


    document.body.appendChild(
        message
    );


    setTimeout(
        () => {

            message.remove();

        },
        7000
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


/* =========================================================
   END
========================================================= */
