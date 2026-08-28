/* =========================================
   NATALIE BOOKINGS
   Frontend JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle =
        document.getElementById("menuToggle");

    const navigation =
        document.getElementById("primaryNavigation");


    /* ==============================
       MOBILE MENU
    ============================== */

    if (menuToggle && navigation) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    navigation.classList.toggle("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    isOpen
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


    /* ==============================
       BOOKING TYPE QUICK SELECT
    ============================== */

    const bookingLinks =
        document.querySelectorAll(
            "[data-booking-type]"
        );

    const bookingType =
        document.getElementById("bookingType");


    bookingLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (bookingType) {

                    bookingType.value =
                        link.dataset.bookingType;

                }

            }
        );

    });


    /* ==============================
       BOOKING FORM
       
       IMPORTANT:
       This is currently frontend-only.
       It does NOT process payments.
       
       Backend + Stripe will be added later.
    ============================== */

    const bookingForm =
        document.getElementById("bookingForm");

    const formStatus =
        document.getElementById("formStatus");


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                formStatus.textContent =
                    "Your request has been prepared. Our booking team will contact you.";

                formStatus.setAttribute(
                    "role",
                    "status"
                );

                bookingForm.reset();

            }
        );

    }


    /* ==============================
       CURRENT YEAR
    ============================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }

});
