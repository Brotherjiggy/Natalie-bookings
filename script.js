/* =========================================================
   NATALYA BOOKINGS
   VANILLA JAVASCRIPT
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
   FLIGHT PRICING
========================================================= */

const RESERVE_PASS_PRICE = 2500;


/*
    Route coordination pricing.

    These are displayed as coordination estimates,
    not airline ticket prices.
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
   U.S. STATES
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

    }
);


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

async function initializeSupabase() {

    try {

        if (
            !window.supabase
        ) {

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
    ) return;


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
        .forEach(link => {

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

        });

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


/* =========================================================
   HERO SLIDESHOW
========================================================= */

function initializeHeroSlideshow() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    if (
        slides.length <= 1
    ) return;


    let currentSlide = 0;


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
    ) return;


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


    if (
        !fromState ||
        !toState
    ) return;


    fromState.addEventListener(
        "change",
        updateFlightSummary
    );


    toState.addEventListener(
        "change",
        updateFlightSummary
    );

}


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


    if (
        from === to
    ) {

        return 250;
    }


    const fromFee =
        STATE_FEES[from] || 0;

    const toFee =
        STATE_FEES[to] || 0;


    /*
        Average the two state
        coordination estimates.
    */

    return Math.round(
        (fromFee + toFee) / 2
    );

}


function updateFlightSummary() {

    const fromState =
        document.getElementById(
            "fromState"
        );

    const toState =
        document.getElementById(
            "toState"
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


    const routeFee =
        calculateRouteFee(
            from,
            to
        );


    const total =
        RESERVE_PASS_PRICE +
        routeFee;


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


    if (!departureDate) return;


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

                returnDate.min =
                    departureDate.value;

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

}


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


    if (!bookingType) return;


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

                    console.error(
                        "Booking error:",
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
   FLIGHT BOOKING FORM
========================================================= */

function initializeFlightBooking() {

    const form =
        document.getElementById(
            "flightBookingForm"
        );

    if (!form) return;


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


            const fromState =
                document.getElementById(
                    "fromState"
                ).value;


            const toState =
                document.getElementById(
                    "toState"
                ).value;


            const departureDate =
                document.getElementById(
                    "departureDate"
                ).value;


            const returnDate =
                document.getElementById(
                    "returnDate"
                ).value;


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


            const routeFee =
                calculateRouteFee(
                    fromState,
                    toState
                );


            const total =
                RESERVE_PASS_PRICE +
                routeFee;


            /*
                Save the booking in Supabase.

                Stripe will be connected in the
                next stage.
            */

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


            const submitButton =
                document.getElementById(
                    "flightCheckoutButton"
                );


            setButtonLoading(
                submitButton,
                true,
                "Preparing checkout..."
            );


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("bookings")
                        .insert(
                            bookingData
                        )
                        .select("id")
                        .single();


                if (error) {

                    console.error(
                        "Flight booking error:",
                        error
                    );

                    throw error;
                }


                console.log(
                    "Flight booking created:",
                    data
                );


                /*
                    At this point the booking is
                    successfully saved.

                    Stripe will be attached in the
                    next stage using the booking ID.
                */

                showFlightError(
                    errorBox,
                    "Your booking request has been saved. Secure Stripe checkout will be connected next."
                );


                errorBox.style.display =
                    "block";

                errorBox.style.background =
                    "#e8f8ed";

                errorBox.style.color =
                    "#196b35";


            } catch (error) {

                console.error(
                    error
                );


                showFlightError(
                    errorBox,
                    friendlyDatabaseError(
                        error
                    )
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
   HELPERS
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


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


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


function showFlightError(
    element,
    message
) {

    if (!element) return;


    element.textContent =
        message;


    element.style.display =
        "block";

}


function hideFlightError(
    element
) {

    if (!element) return;


    element.textContent =
        "";

    element.style.display =
        "none";

}


function setButtonLoading(
    button,
    loading,
    text = ""
) {

    if (!button) return;


    if (loading) {

        button.dataset.originalText =
            button.textContent;

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
   YEAR
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
