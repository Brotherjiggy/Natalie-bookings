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
    Route coordination estimates.
    These are NOT airline ticket prices.

    Final Stripe amount is calculated again
    server-side by the create-checkout function.
*/

const STATE_FEES = {

    Alabama: 450,
    Alaska: 950,
    Arizona: 750,
    Arkansas: 500,
    California: 850,
    Colorado: 700,
    Connecticut: 550,
    Delaware: 500,
    Florida: 700,
    Georgia: 550,
    Hawaii: 1200,
    Idaho: 800,
    Illinois: 600,
    Indiana: 550,
    Iowa: 550,
    Kansas: 550,
    Kentucky: 500,
    Louisiana: 600,
    Maine: 650,
    Maryland: 500,
    Massachusetts: 600,
    Michigan: 600,
    Minnesota: 650,
    Mississippi: 550,
    Missouri: 550,
    Montana: 850,
    Nebraska: 600,
    Nevada: 800,
    "New Hampshire": 600,
    "New Jersey": 550,
    "New Mexico": 700,
    "New York": 600,
    "North Carolina": 550,
    "North Dakota": 700,
    Ohio: 550,
    Oklahoma: 600,
    Oregon: 850,
    Pennsylvania: 550,
    "Rhode Island": 600,
    "South Carolina": 550,
    "South Dakota": 700,
    Tennessee: 550,
    Texas: 650,
    Utah: 750,
    Vermont: 650,
    Virginia: 500,
    Washington: 900,
    "West Virginia": 550,
    Wisconsin: 600,
    Wyoming: 800

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

        initializeCancelMessage();

    }
);


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

async function initializeSupabase() {

    try {

        /*
            Supabase library should already be loaded
            by your HTML file.
        */

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
