"use strict";

/* =========================================================
   NATALYA BOOKINGS
   PREMIUM FRONTEND ENGINE
   VERSION 2.0

   FEATURES
   - Premium mobile navigation
   - Sticky header
   - Active navigation tracking
   - Light / dark mode
   - Hero slideshow
   - Scroll reveal
   - Smooth scrolling
   - Experience selection
   - Perfume selection
   - Automatic booking totals
   - Flight state selector
   - State route fee calculator
   - Flight summary
   - Supabase booking storage
   - Local fallback
   - Form validation
   - Toast notifications
   - Image fallback handling
   - Escape-key controls
   - Current year
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG = {

    /* -----------------------------------------------------
       SUPABASE
       -----------------------------------------------------

       IMPORTANT:
       If your existing Supabase project is already working,
       put your REAL values here.

       DO NOT use these placeholder values for production.
       ----------------------------------------------------- */

    SUPABASE_URL:
        "https://YOUR-PROJECT.supabase.co",

    SUPABASE_ANON_KEY:
        "YOUR-SUPABASE-ANON-KEY",

    /* -----------------------------------------------------
       EXPERIENCE PRICES
       ----------------------------------------------------- */

    EXPERIENCE_PRICES: {
        flight: 2500,
        dinner: 850,
        membership: 500
    },

    /* -----------------------------------------------------
       FLIGHT ROUTE FEES
       ----------------------------------------------------- */

    STATE_FEES: {

        Alabama: 500,
        Alaska: 850,
        Arizona: 600,
        Arkansas: 500,
        California: 850,
        Colorado: 650,
        Connecticut: 750,
        Delaware: 650,
        Florida: 600,
        Georgia: 550,
        Hawaii: 950,
        Idaho: 750,
        Illinois: 700,
        Indiana: 650,
        Iowa: 650,
        Kansas: 600,
        Kentucky: 600,
        Louisiana: 600,
        Maine: 800,
        Maryland: 650,
        Massachusetts: 750,
        Michigan: 700,
        Minnesota: 700,
        Mississippi: 550,
        Missouri: 600,
        Montana: 800,
        Nebraska: 650,
        Nevada: 750,
        "New Hampshire": 800,
        "New Jersey": 750,
        "New Mexico": 700,
        "New York": 800,
        "North Carolina": 550,
        "North Dakota": 800,
        Ohio: 650,
        Oklahoma: 600,
        Oregon: 800,
        Pennsylvania: 700,
        "Rhode Island": 800,
        "South Carolina": 550,
        "South Dakota": 750,
        Tennessee: 550,
        Texas: 650,
        Utah: 750,
        Vermont: 800,
        Virginia: 600,
        Washington: 850,
        "West Virginia": 650,
        Wisconsin: 700,
        Wyoming: 800
    },

    /* -----------------------------------------------------
       DONATION / COMMUNITY
       ----------------------------------------------------- */

    COMMUNITY_RAISED: 432000,
    COMMUNITY_TARGET: 1000000,

    /* -----------------------------------------------------
       STORAGE
       ----------------------------------------------------- */

    THEME_KEY: "natalya-theme",
    BOOKING_KEY: "natalya-booking-draft"

};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let supabaseClient = null;

let selectedPerfumes = [];

let currentHeroSlide = 0;

let heroTimer = null;

let toastTimer = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSupabase();

    setupMobileNavigation();

    setupStickyHeader();

    setupActiveNavigation();

    setupSmoothScrolling();

    setupTheme();

    setupHeroSlideshow();

    setupScrollReveal();

    setupExperienceSelection();

    setupPerfumeSelection();

    setupFlightBooking();

    setupBookingForm();

   setupBookingBasket();

    setupImageFallbacks();

    setupEscapeKey();

    updateCurrentYear();

    restoreBookingDraft();

    calculateBookingTotal();

    calculateFlightSummary();
   

    console.log(
        "%cNATALYA BOOKINGS",
        "font-size:20px;font-weight:900;color:#f36b21;"
    );

    console.log(
        "%cPremium frontend engine initialized.",
        "font-size:12px;color:#777;"
    );

});


/* =========================================================
   SUPABASE INITIALIZATION
   ========================================================= */

function initializeSupabase() {

    if (
        typeof window.supabase === "undefined"
    ) {
        console.warn(
            "Supabase CDN not detected."
        );

        return;
    }

    const validURL =
        CONFIG.SUPABASE_URL &&
        !CONFIG.SUPABASE_URL.includes("YOUR-PROJECT");

    const validKey =
        CONFIG.SUPABASE_ANON_KEY &&
        !CONFIG.SUPABASE_ANON_KEY.includes("YOUR-SUPABASE");

    if (!validURL || !validKey) {

        console.warn(
            "Supabase credentials are still placeholders."
        );

        return;
    }

    try {

        supabaseClient =
            window.supabase.createClient(
                CONFIG.SUPABASE_URL,
                CONFIG.SUPABASE_ANON_KEY
            );

        console.log(
            "Supabase initialized."
        );

    } catch (error) {

        console.error(
            "Supabase initialization failed:",
            error
        );

    }
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */
function setupMobileNavigation() {
  const menuToggle = $("#menuToggle");
  const navigation = $("#primaryNavigation");
  const header = $("#siteHeader");

  if (!menuToggle || !navigation) return;

  /*
   * ---------------------------------------------------------
   * MOBILE NAVIGATION
   * Natalya Bookings
   * ---------------------------------------------------------
   */

  // Create hamburger bars if they don't already exist
  if (!menuToggle.querySelector(".menu-icon")) {
    menuToggle.innerHTML = `
      <span class="menu-icon" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span class="menu-label">Menu</span>
    `;
  }

  const menuIcon = menuToggle.querySelector(".menu-icon");

  function openMenu() {
    navigation.classList.add("open");
    menuToggle.classList.add("active");

    if (header) {
      header.classList.add("menu-open");
      header.classList.remove("nav-hidden");
    }

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    navigation.classList.remove("open");
    menuToggle.classList.remove("active");

    if (header) {
      header.classList.remove("menu-open");
      header.classList.remove("nav-hidden");
    }

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.classList.remove("menu-open");
  }

  function toggleMenu(event) {
    if (event) event.stopPropagation();

    const isOpen = navigation.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Hamburger button
  menuToggle.addEventListener("click", toggleMenu);

  // Close menu when a navigation link is clicked
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /*
   * ---------------------------------------------------------
   * IMPORTANT:
   * Do NOT close the mobile menu when clicking inside it.
   * This allows the theme button to work properly.
   * ---------------------------------------------------------
   */

  navigation.addEventListener("click", (event) => {
    const themeButton = event.target.closest("#themeToggle");

    if (themeButton) {
      /*
       * Let the existing theme system handle the theme.
       * We intentionally DO NOT close the navigation here.
       */
      event.stopPropagation();
      return;
    }

    // Clicking empty navigation space does nothing
    if (!event.target.closest("a")) {
      event.stopPropagation();
    }
  });

  /*
   * ---------------------------------------------------------
   * CLOSE WHEN CLICKING OUTSIDE
   * ---------------------------------------------------------
   */

  document.addEventListener("click", (event) => {
    if (!navigation.classList.contains("open")) return;

    const clickedInsideNavigation = navigation.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);

    if (!clickedInsideNavigation && !clickedMenuButton) {
      closeMenu();
    }
  });

  /*
   * ---------------------------------------------------------
   * ESCAPE KEY
   * ---------------------------------------------------------
   */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /*
   * ---------------------------------------------------------
   * SCREEN SIZE PROTECTION
   * ---------------------------------------------------------
   *
   * If the user rotates the phone or moves to desktop width,
   * reset the mobile menu cleanly.
   */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

/* =========================================================
   STICKY HEADER
   ========================================================= */
function setupStickyHeader() {
  const header = $("#siteHeader");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    /* Always show at the very top */
    if (currentScrollY <= 20) {
      header.classList.remove("nav-hidden");
    }

    /* Scrolling down */
    else if (
      currentScrollY > lastScrollY &&
      currentScrollY > 100 &&
      !header.classList.contains("menu-open")
    ) {
      header.classList.add("nav-hidden");
    }

    /* Scrolling up */
    else if (currentScrollY < lastScrollY) {
      header.classList.remove("nav-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setupActiveNavigation() {

    const links =
        $$("#primaryNavigation a");

    if (!links.length) {
        return;
    }

    const sections =
        links
            .map(link => {

                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    !href.startsWith("#")
                ) {
                    return null;
                }

                const section =
                    document.querySelector(
                        href
                    );

                return section
                    ? {
                        section,
                        link
                    }
                    : null;

            })
            .filter(Boolean);

    function updateActiveLink() {

        const scrollPosition =
            window.scrollY + 150;

        let current =
            sections[0];

        sections.forEach(item => {

            if (
                item.section.offsetTop <=
                scrollPosition
            ) {

                current = item;

            }

        });

        links.forEach(link => {

            link.classList.remove(
                "active"
            );

        });

        if (current) {

            current.link.classList.add(
                "active"
            );

        }

    }

    updateActiveLink();

    window.addEventListener(
        "scroll",
        updateActiveLink,
        { passive: true }
    );

}


/* =========================================================
   SMOOTH SCROLLING
   ========================================================= */

function setupSmoothScrolling() {

    $$('a[href^="#"]').forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetID =
                        link.getAttribute("href");

                    if (
                        !targetID ||
                        targetID === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetID
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );

}


/* =========================================================
   THEME SYSTEM
   ========================================================= */

function setupTheme() {

    const button =
        $("#themeToggle");

    if (!button) {
        return;
    }

    const savedTheme =
        localStorage.getItem(
            CONFIG.THEME_KEY
        );

    if (savedTheme === "dark") {

        document.documentElement.classList.add(
            "dark"
        );

        button.textContent = "☀";

    } else {

        button.textContent = "◐";

    }

    button.addEventListener(
        "click",
        () => {

            const dark =
                document.documentElement.classList.toggle(
                    "dark"
                );

            localStorage.setItem(
                CONFIG.THEME_KEY,
                dark ? "dark" : "light"
            );

            button.textContent =
                dark ? "☀" : "◐";

            showToast(
                dark
                    ? "Dark luxury mode activated."
                    : "Light luxury mode activated."
            );

        }
    );

}


/* =========================================================
   HERO SLIDESHOW
   ========================================================= */

function setupHeroSlideshow() {

    const slides =
        $$(".hero-slide");

    if (slides.length <= 1) {
        return;
    }

    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === 0
            );

        }
    );

    function showSlide(index) {

        slides.forEach(
            slide => {

                slide.classList.remove(
                    "active"
                );

            }
        );

        slides[index].classList.add(
            "active"
        );

        currentHeroSlide = index;

    }

    function nextSlide() {

        const next =
            (currentHeroSlide + 1) %
            slides.length;

        showSlide(next);

    }

    heroTimer =
        setInterval(
            nextSlide,
            6000
        );

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {

    const elements =
        $$(".hidden");

    if (!elements.length) {
        return;
    }

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element => {

                element.classList.add(
                    "active"
                );

            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "active"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   EXPERIENCE SELECTION
   ========================================================= */

function setupExperienceSelection() {
  const cards = $$(".experience-card");

  if (!cards.length) return;

  cards.forEach((card) => {
    const checkbox = card.querySelector(
      'input[type="checkbox"]'
    );

    if (!checkbox) return;

    function updateCard() {
      card.classList.toggle("selected", checkbox.checked);
    }

    // Initial state
    updateCard();

    // Clicking anywhere on the card
    card.addEventListener("click", (event) => {
      /*
       * If the user clicked the actual checkbox,
       * let its normal behaviour happen.
       */
      if (event.target === checkbox) {
        updateCard();
        calculateBookingTotal();
        return;
      }

      /*
       * Don't interfere with buttons or links inside
       * the experience card.
       */
      if (
        event.target.closest("a") ||
        event.target.closest("button")
      ) {
        return;
      }

      checkbox.checked = !checkbox.checked;

      updateCard();
      calculateBookingTotal();
    });

    // Keyboard accessibility
    checkbox.addEventListener("change", () => {
      updateCard();
      calculateBookingTotal();
    });
  });
}


/* =========================================================
   PERFUME SYSTEM
   ========================================================= */

function setupPerfumeSelection() {
  const cards = $$(".perfume-card");

  if (!cards.length) return;

  cards.forEach((card) => {
    const checkbox = card.querySelector(
      ".perfume-select-checkbox"
    );

    if (!checkbox) return;

    const footer = card.querySelector(".perfume-card-footer");

    if (!footer) return;

    /*
     * -------------------------------------------------------
     * CREATE QUANTITY CONTROLS
     * -------------------------------------------------------
     */

    let quantityBox = card.querySelector(".perfume-quantity");

    if (!quantityBox) {
      quantityBox = document.createElement("div");

      quantityBox.className = "perfume-quantity";

      quantityBox.innerHTML = `
        <button
          type="button"
          class="quantity-button quantity-minus"
          aria-label="Decrease quantity"
        >−</button>

        <span class="quantity-value">1</span>

        <button
          type="button"
          class="quantity-button quantity-plus"
          aria-label="Increase quantity"
        >+</button>

        <span class="perfume-line-total">$0.00</span>
      `;

      card.querySelector(".perfume-info").appendChild(quantityBox);
    }

    const minusButton =
      quantityBox.querySelector(".quantity-minus");

    const plusButton =
      quantityBox.querySelector(".quantity-plus");

    const quantityValue =
      quantityBox.querySelector(".quantity-value");

    const lineTotal =
      quantityBox.querySelector(".perfume-line-total");

    /*
     * -------------------------------------------------------
     * QUANTITY STATE
     * -------------------------------------------------------
     */

    let quantity = Number(card.dataset.quantity || 1);

    if (quantity < 1) quantity = 1;

    function getPrice() {
      return Number(checkbox.dataset.price || 0);
    }

    function updateCard() {
      const price = getPrice();

      card.dataset.quantity = quantity;

      card.classList.toggle(
        "selected",
        checkbox.checked
      );

      quantityValue.textContent = quantity;

      lineTotal.textContent =
        "$" + (price * quantity).toFixed(2);

      /*
       * Keep the selected state visible even if
       * the user interacts with the checkbox itself.
       */
      checkbox.setAttribute(
        "aria-label",
        `Select ${checkbox.dataset.name || "perfume"}`
      );
    }

    /*
     * -------------------------------------------------------
     * CHECKBOX
     * -------------------------------------------------------
     */

    checkbox.addEventListener("change", () => {
      if (checkbox.checked && quantity < 1) {
        quantity = 1;
      }

      updateCard();
      calculateBookingTotal();
    });

    /*
     * -------------------------------------------------------
     * PLUS
     * -------------------------------------------------------
     */

    plusButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      checkbox.checked = true;

      quantity += 1;

      updateCard();
      calculateBookingTotal();
    });

    /*
     * -------------------------------------------------------
     * MINUS
     * -------------------------------------------------------
     */

    minusButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (quantity > 1) {
        quantity -= 1;
      } else {
        checkbox.checked = false;
      }

      updateCard();
      calculateBookingTotal();
    });

    /*
     * -------------------------------------------------------
     * CLICK CARD TO SELECT
     * -------------------------------------------------------
     */

    card.addEventListener("click", (event) => {
      /*
       * Don't interfere with the checkbox,
       * quantity buttons or links.
       */
      if (
        event.target.closest(
          ".select-checkbox-btn"
        ) ||
        event.target.closest(
          ".quantity-button"
        ) ||
        event.target.closest("a") ||
        event.target.closest("button")
      ) {
        return;
      }

      checkbox.checked = !checkbox.checked;

      if (checkbox.checked && quantity < 1) {
        quantity = 1;
      }

      updateCard();
      calculateBookingTotal();
    });

    /*
     * Initial state
     */
    updateCard();
  });
}


/* =========================================================
   READ PERFUME DATA
   ========================================================= */

function updateSelectedPerfumes() {

    selectedPerfumes = [];

    const inputs =
        $$(".perfume-select-checkbox");

    inputs.forEach(
        input => {

            if (!input.checked) {
                return;
            }

            const card =
                input.closest(
                    ".perfume-card"
                );

            if (!card) {
                return;
            }

            const nameElement =
                card.querySelector(
                    "h3"
                );

            const priceElement =
                card.querySelector(
                    ".perfume-price"
                );

            const name =
                nameElement
                    ? nameElement.textContent.trim()
                    : "Luxury Perfume";

            const price =
                parseMoney(
                    priceElement
                        ? priceElement.textContent
                        : "0"
                );

            selectedPerfumes.push({
                name,
                price
            });

        }
    );

    renderSelectedPerfumes();

}


/* =========================================================
   RENDER PERFUME SUMMARY
   ========================================================= */

function renderSelectedPerfumes() {

    const summary =
        $("#selectedPerfumesSummary");

    if (!summary) {
        return;
    }

    if (!selectedPerfumes.length) {

        summary.innerHTML =
            '<span style="color:var(--muted);font-size:13px;">No perfume selected</span>';

        return;
    }

    summary.innerHTML =
        selectedPerfumes
            .map(
                perfume => `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        gap:12px;
                        padding:8px 0;
                        border-bottom:1px solid var(--border);
                    ">
                        <span>${escapeHTML(perfume.name)}</span>
                        <strong>$${formatMoney(perfume.price)}</strong>
                    </div>
                `
            )
            .join("");

}


/* =========================================================
   BOOKING TOTAL
   ========================================================= */

function calculateBookingTotal() {
  let total = 0;

  /*
   * -------------------------------------------------------
   * EXPERIENCE TOTAL
   * -------------------------------------------------------
   */

  $$(".experience-card input[type='checkbox']:checked")
    .forEach((checkbox) => {
      total += Number(
        checkbox.dataset.price || 0
      );
    });

  /*
   * -------------------------------------------------------
   * PERFUME TOTAL
   * -------------------------------------------------------
   */

  $$(".perfume-select-checkbox:checked")
    .forEach((checkbox) => {
      const card = checkbox.closest(".perfume-card");

      const price = Number(
        checkbox.dataset.price || 0
      );

      const quantity = Number(
        card?.dataset.quantity || 1
      );

      total += price * quantity;
    });

  /*
   * -------------------------------------------------------
   * UPDATE MAIN TOTAL
   * -------------------------------------------------------
   */

  const totalDisplay =
    $("#combinedTotalDisplay");

  if (totalDisplay) {
    totalDisplay.textContent =
      "$" + total.toFixed(2);
  }

  /*
   * -------------------------------------------------------
   * UPDATE SELECTED EXPERIENCE SUMMARY
   * -------------------------------------------------------
   */

  const experienceSummary =
    $("#selectedExperiences");

  if (experienceSummary) {
    const selectedExperiences =
      $$(".experience-card input[type='checkbox']:checked")
        .map((checkbox) => {
          return checkbox.value ||
            checkbox.dataset.name ||
            checkbox.closest(".experience-card")
              ?.querySelector("h3")
              ?.textContent
              ?.trim() ||
            "Experience";
        });

    experienceSummary.value =
      selectedExperiences.join(", ");
  }

  /*
   * -------------------------------------------------------
   * UPDATE PERFUME SUMMARY
   * -------------------------------------------------------
   */

  const perfumeSummary =
    $("#selectedPerfumesSummary");

  if (perfumeSummary) {
    const selectedPerfumes =
      $$(".perfume-select-checkbox:checked")
        .map((checkbox) => {
          const card =
            checkbox.closest(".perfume-card");

          const quantity =
            Number(card?.dataset.quantity || 1);

          const name =
            checkbox.dataset.name || "Perfume";

          return `${name} × ${quantity}`;
        });

    perfumeSummary.value =
      selectedPerfumes.join(", ");
  }

  /*
   * Make total available to the rest of the
   * Natalya Bookings frontend.
   */

  window.NatalyaBookingTotal = total;

  return total;
}

/* =========================================================
   GET EXPERIENCE PRICE
   ========================================================= */

function getCheckboxPrice(
    checkbox
) {

    const directPrice =
        checkbox.dataset.price;

    if (directPrice) {

        return parseMoney(
            directPrice
        );

    }

    const value =
        String(
            checkbox.value || ""
        ).toLowerCase();

    if (
        value.includes("flight")
    ) {

        return CONFIG.EXPERIENCE_PRICES.flight;

    }

    if (
        value.includes("dinner")
    ) {

        return CONFIG.EXPERIENCE_PRICES.dinner;

    }

    if (
        value.includes("membership") ||
        value.includes("vip") ||
        value.includes("fan")
    ) {

        return CONFIG.EXPERIENCE_PRICES.membership;

    }

    return 0;

}


/* =========================================================
   FLIGHT BOOKING
   ========================================================= */

function setupFlightBooking() {

    const form =
        $("#flightBookingForm");

    if (!form) {
        return;
    }

    const from =
        $("#fromState");

    const to =
        $("#toState");

    const departure =
        $("#departureDate");

    const returnDate =
        $("#returnDate");

    const guests =
        $("#guests");

    [from, to, departure, returnDate, guests]
        .filter(Boolean)
        .forEach(
            element => {

                element.addEventListener(
                    "change",
                    calculateFlightSummary
                );

                element.addEventListener(
                    "input",
                    calculateFlightSummary
                );

            }
        );

    populateStateSelectors();

    form.addEventListener(
        "submit",
        handleFlightSubmit
    );

}


/* =========================================================
   POPULATE STATES
   ========================================================= */

function populateStateSelectors() {

    const from =
        $("#fromState");

    const to =
        $("#toState");

    if (!from || !to) {
        return;
    }

    const states =
        Object.keys(
            CONFIG.STATE_FEES
        );

    const currentFrom =
        from.value;

    const currentTo =
        to.value;

    function populate(select) {

        const existing =
            select.innerHTML.trim();

        /*
         If HTML already has real options,
         keep them.
        */

        if (
            existing &&
            select.options.length > 1
        ) {
            return;
        }

        select.innerHTML =
            '<option value="">Select state</option>';

        states.forEach(
            state => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = state;

                option.textContent = state;

                select.appendChild(
                    option
                );

            }
        );

    }

    populate(from);
    populate(to);

    if (currentFrom) {
        from.value = currentFrom;
    }

    if (currentTo) {
        to.value = currentTo;
    }

}


/* =========================================================
   FLIGHT SUMMARY
   ========================================================= */

function calculateFlightSummary() {

    const from =
        $("#fromState");

    const to =
        $("#toState");

    const departure =
        $("#departureDate");

    const returnDate =
        $("#returnDate");

    const guests =
        $("#guests");

    const summary =
        $("#flightSummary");

    if (!from || !to) {
        return;
    }

    const fromValue =
        from.value;

    const toValue =
        to.value;

    const departureValue =
        departure
            ? departure.value
            : "";

    const returnValue =
        returnDate
            ? returnDate.value
            : "";

    let guestCount =
        guests
            ? parseInt(
                guests.value,
                10
            )
            : 1;

    if (
        !Number.isFinite(
            guestCount
        ) ||
        guestCount < 1
    ) {

        guestCount = 1;

    }

    let routeFee = 0;

    if (
        fromValue &&
        CONFIG.STATE_FEES[fromValue]
    ) {

        routeFee +=
            CONFIG.STATE_FEES[fromValue];

    }

    if (
        toValue &&
        CONFIG.STATE_FEES[toValue]
    ) {

        routeFee +=
            CONFIG.STATE_FEES[toValue];

    }

    /*
     Prevent identical-state nonsense.
    */

    if (
        fromValue &&
        toValue &&
        fromValue === toValue
    ) {

        routeFee =
            CONFIG.STATE_FEES[fromValue];

    }

    const basePrice =
        CONFIG.EXPERIENCE_PRICES.flight;

    const total =
        (basePrice + routeFee) *
        guestCount;

    updateElementText(
        "#summaryFrom",
        fromValue || "—"
    );

    updateElementText(
        "#summaryTo",
        toValue || "—"
    );

    updateElementText(
        "#summaryDeparture",
        formatDate(departureValue)
    );

    updateElementText(
        "#summaryReturn",
        formatDate(returnValue)
    );

    updateElementText(
        "#summaryRouteFee",
        `$${formatMoney(routeFee)}`
    );

    updateElementText(
        "#summaryTotal",
        `$${formatMoney(total)}`
    );

    /*
     If the HTML contains a dedicated
     route-fee display, update it too.
    */

    updateElementText(
        "#routeFeeDisplay",
        `$${formatMoney(routeFee)}`
    );

    if (summary) {

        const hasData =
            fromValue ||
            toValue ||
            departureValue ||
            returnValue;

        summary.style.display =
            hasData
                ? ""
                : "";

    }

    return {
        from: fromValue,
        to: toValue,
        departure: departureValue,
        returnDate: returnValue,
        guests: guestCount,
        routeFee,
        basePrice,
        total
    };

}


/* =========================================================
   FLIGHT SUBMISSION
   ========================================================= */

async function handleFlightSubmit(
    event
) {

    event.preventDefault();

    const form =
        event.currentTarget;

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }

    const flight =
        calculateFlightSummary();

    if (!flight) {
        return;
    }

    if (
        !flight.from ||
        !flight.to
    ) {

        showFormStatus(
            form,
            "Please select your departure and destination states.",
            "error"
        );

        return;

    }

    if (
        flight.from === flight.to
    ) {

        showFormStatus(
            form,
            "Departure and destination cannot be the same state.",
            "error"
        );

        return;

    }

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    setButtonLoading(
        submitButton,
        true,
        "Preparing..."
    );

    const data =
        collectFormData(form);

    data.booking_type =
        "flight";

    data.flight =
        flight;

    try {

        const saved =
            await saveBooking(
                data
            );

        if (saved) {

            showFormStatus(
                form,
                "Your flight booking request has been received successfully.",
                "success"
            );

            showToast(
                "Flight booking request received."
            );

            form.reset();

            calculateFlightSummary();

        }

    } catch (error) {

        console.error(
            "Flight submission error:",
            error
        );

        showFormStatus(
            form,
            "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        setButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   MAIN BOOKING FORM
   ========================================================= */

function setupBookingForm() {

    const form =
        $("#bookingForm");

    if (!form) {
        return;
    }

    const fields =
        form.querySelectorAll(
            "input, select, textarea"
        );

    fields.forEach(
        field => {

            field.addEventListener(
                "input",
                saveBookingDraft
            );

            field.addEventListener(
                "change",
                saveBookingDraft
            );

        }
    );

    form.addEventListener(
        "submit",
        handleBookingSubmit
    );

}


/* =========================================================
   MAIN BOOKING SUBMISSION
   ========================================================= */

async function handleBookingSubmit(
    event
) {

    event.preventDefault();

    const form =
        event.currentTarget;

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }

    const total =
        calculateBookingTotal();

    if (total <= 0) {

        showFormStatus(
            form,
            "Please select at least one experience or perfume.",
            "error"
        );

        return;

    }

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    setButtonLoading(
        submitButton,
        true,
        "Submitting..."
    );

    const data =
        collectFormData(form);

    data.booking_type =
        "experience";

    data.selected_experiences =
        getSelectedExperiences(form);

    data.selected_perfumes =
        selectedPerfumes;

    data.total =
        total;

    try {

        const saved =
            await saveBooking(
                data
            );

        if (saved) {

            showFormStatus(
                form,
                "Your request has been received. Natalya Bookings will be in touch shortly.",
                "success"
            );

            showToast(
                "Booking request submitted successfully."
            );

            localStorage.removeItem(
                CONFIG.BOOKING_KEY
            );

        }

    } catch (error) {

        console.error(
            "Booking submission error:",
            error
        );

        showFormStatus(
            form,
            "We couldn't submit your request right now. Please try again.",
            "error"
        );

    } finally {

        setButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   GET SELECTED EXPERIENCES
   ========================================================= */

function getSelectedExperiences(
    form
) {

    const results = [];

    const checkboxes =
        form.querySelectorAll(
            'input[type="checkbox"]:checked'
        );

    checkboxes.forEach(
        checkbox => {

            if (
                checkbox.classList.contains(
                    "perfume-select-checkbox"
                )
            ) {
                return;
            }

            results.push({
                value:
                    checkbox.value || "",
                label:
                    getCheckboxLabel(
                        checkbox
                    ),
                price:
                    getCheckboxPrice(
                        checkbox
                    )
            });

        }
    );

    return results;

}


/* =========================================================
   CHECKBOX LABEL
   ========================================================= */

function getCheckboxLabel(
    checkbox
) {

    const label =
        document.querySelector(
            `label[for="${CSS.escape(checkbox.id)}"]`
        );

    if (label) {

        return label.textContent
            .replace(/\s+/g, " ")
            .trim();

    }

    if (checkbox.parentElement) {

        return checkbox.parentElement.textContent
            .replace(/\s+/g, " ")
            .trim();

    }

    return checkbox.value || "Experience";

}


/* =========================================================
   SAVE BOOKING
   ========================================================= */

async function saveBooking(
    data
) {

    /*
     If Supabase is available,
     save there.
    */

    if (supabaseClient) {

        try {

            const result =
                await supabaseClient
                    .from("bookings")
                    .insert([
                        normalizeBookingForSupabase(
                            data
                        )
                    ])
                    .select();

            if (result.error) {

                console.error(
                    "Supabase insert error:",
                    result.error
                );

                /*
                 Do not silently pretend the
                 booking was stored remotely.
                */

                throw result.error;

            }

            return true;

        } catch (error) {

            console.error(
                "Remote booking failed:",
                error
            );

            /*
             Keep a local copy as a backup.
            */

            saveLocalBooking(
                data
            );

            /*
             Tell the user the request has
             been saved locally rather than
             falsely claiming Supabase worked.
            */

            showFormStatus(
                document.activeElement?.form ||
                null,
                "Your request has been saved on this device, but the online booking service could not be reached.",
                "error"
            );

            return false;

        }

    }

    /*
     Supabase is not configured.
     Save locally so the frontend remains
     usable during development.
    */

    saveLocalBooking(
        data
    );

    showToast(
        "Booking saved locally. Connect Supabase to receive it online."
    );

    return true;

}


/* =========================================================
   SUPABASE DATA NORMALIZATION
   ========================================================= */

function normalizeBookingForSupabase(
    data
) {

    /*
     This object deliberately uses common
     column names.

     If your Supabase bookings table uses
     different column names, we can adapt
     this in the backend step.
    */

    return {
        full_name:
            data.full_name ||
            data.fullName ||
            "",

        email:
            data.email ||
            "",

        phone:
            data.phone ||
            "",

        booking_type:
            data.booking_type ||
            "",

        service:
            data.service ||
            "",

        state:
            data.state ||
            data.from_state ||
            "",

        message:
            data.message ||
            data.notes ||
            "",

        total:
            Number(
                data.total || 0
            ),

        details:
            JSON.stringify(
                data
            )
    };

}


/* =========================================================
   LOCAL BOOKING BACKUP
   ========================================================= */

function saveLocalBooking(
    data
) {

    try {

        const existing =
            JSON.parse(
                localStorage.getItem(
                    "natalya-bookings-local"
                ) || "[]"
            );

        existing.push({
            ...data,
            created_at:
                new Date().toISOString()
        });

        localStorage.setItem(
            "natalya-bookings-local",
            JSON.stringify(
                existing
            )
        );

    } catch (error) {

        console.error(
            "Could not save local booking:",
            error
        );

    }

}


/* =========================================================
   COLLECT FORM DATA
   ========================================================= */

function collectFormData(
    form
) {

    const formData =
        new FormData(form);

    const data = {};

    formData.forEach(
        (value, key) => {

            if (
                Object.prototype.hasOwnProperty.call(
                    data,
                    key
                )
            ) {

                if (
                    !Array.isArray(
                        data[key]
                    )
                ) {

                    data[key] = [
                        data[key]
                    ];

                }

                data[key].push(
                    value
                );

            } else {

                data[key] = value;

            }

        }
    );

    return data;

}


/* =========================================================
   BOOKING DRAFT
   ========================================================= */

function saveBookingDraft() {

    const form =
        $("#bookingForm");

    if (!form) {
        return;
    }

    try {

        const data =
            collectFormData(form);

        localStorage.setItem(
            CONFIG.BOOKING_KEY,
            JSON.stringify(
                data
            )
        );

    } catch (error) {

        console.warn(
            "Could not save booking draft.",
            error
        );

    }

}


/* =========================================================
   RESTORE BOOKING DRAFT
   ========================================================= */

function restoreBookingDraft() {

    const form =
        $("#bookingForm");

    if (!form) {
        return;
    }

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    CONFIG.BOOKING_KEY
                )
            );

        if (!saved) {
            return;
        }

        Object.entries(
            saved
        ).forEach(
            ([key, value]) => {

                const field =
                    form.elements[key];

                if (!field) {
                    return;
                }

                if (
                    field.type === "checkbox"
                ) {

                    if (
                        Array.isArray(
                            value
                        )
                    ) {

                        field.checked =
                            value.includes(
                                field.value
                            );

                    } else {

                        field.checked =
                            Boolean(
                                value
                            );

                    }

                } else {

                    field.value =
                        value;

                }

            }
        );

        /*
         Rebuild perfume selection
         after restoring form data.
        */

        updateSelectedPerfumes();

        calculateBookingTotal();

    } catch (error) {

        console.warn(
            "Could not restore booking draft.",
            error
        );

    }

}


/* =========================================================
   FORM STATUS
   ========================================================= */

function showFormStatus(
    form,
    message,
    type
) {

    if (!form) {
        return;
    }

    let status =
        form.querySelector(
            ".status-message"
        );

    if (!status) {

        status =
            form.querySelector(
                ".confirmation-message"
            );

    }

    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.className =
            "status-message";

        form.appendChild(
            status
        );

    }

    status.textContent =
        message;

    status.classList.remove(
        "show",
        "success",
        "error"
    );

    status.classList.add(
        "show",
        type
    );

    status.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =========================================================
   BUTTON LOADING STATE
   ========================================================= */

function setButtonLoading(
    button,
    loading,
    text = "Submit"
) {

    if (!button) {
        return;
    }

    if (loading) {

        button.dataset.originalText =
            button.innerHTML;

        button.disabled = true;

        button.innerHTML =
            `
            <span style="
                display:inline-flex;
                align-items:center;
                gap:8px;
            ">
                <span style="
                    width:14px;
                    height:14px;
                    border:2px solid currentColor;
                    border-right-color:transparent;
                    border-radius:50%;
                    display:inline-block;
                    animation:natalyaSpin .7s linear infinite;
                "></span>
                ${escapeHTML(text)}
            </span>
            `;

        injectSpinnerAnimation();

    } else {

        button.disabled = false;

        if (
            button.dataset.originalText
        ) {

            button.innerHTML =
                button.dataset.originalText;

        }

    }

}


/* =========================================================
   SPINNER CSS
   ========================================================= */

function injectSpinnerAnimation() {

    if (
        document.getElementById(
            "natalya-spinner-style"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "natalya-spinner-style";

    style.textContent = `
        @keyframes natalyaSpin {
            to {
                transform: rotate(360deg);
            }
        }
    `;

    document.head.appendChild(
        style
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message
) {

    let toast =
        $("#natalyaToast");

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "natalyaToast";

        toast.className =
            "toast";

        document.body.appendChild(
            toast
        );

    }

    toast.innerHTML =
        `
        <strong>Natalya Bookings</strong><br>
        ${escapeHTML(message)}
        `;

    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            4000
        );

}


/* =========================================================
   IMAGE FALLBACKS
   ========================================================= */

function setupImageFallbacks() {

    $$("img").forEach(
        image => {

            image.addEventListener(
                "error",
                () => {

                    if (
                        image.dataset.fallbackUsed
                    ) {
                        return;
                    }

                    const fallback =
                        image.dataset.fallback ||
                        image.getAttribute(
                            "data-fallback"
                        );

                    if (fallback) {

                        image.dataset.fallbackUsed =
                            "true";

                        image.src =
                            fallback;

                    }

                }
            );

        }
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            const navigation =
                $("#primaryNavigation");

            const menuToggle =
                $("#menuToggle");

            if (navigation) {

                navigation.classList.remove(
                    "open"
                );

            }

            if (menuToggle) {

                menuToggle.classList.remove(
                    "active"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            document.body.classList.remove(
                "menu-open"
            );

            $$(".modal.active").forEach(
                modal => {

                    modal.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function updateCurrentYear() {

    const year =
        new Date().getFullYear();

    const elements =
        $$("#currentYear");

    elements.forEach(
        element => {

            element.textContent =
                year;

        }
    );

}


/* =========================================================
   MONEY FORMAT
   ========================================================= */

function parseMoney(
    value
) {

    if (
        typeof value === "number"
    ) {

        return Number.isFinite(value)
            ? value
            : 0;

    }

    const cleaned =
        String(value || "")
            .replace(
                /[^0-9.-]/g,
                ""
            );

    const number =
        parseFloat(
            cleaned
        );

    return Number.isFinite(number)
        ? number
        : 0;

}


function formatMoney(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   DATE FORMAT
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
        return value;
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
   UPDATE ELEMENT TEXT
   ========================================================= */

function updateElementText(
    selector,
    text
) {

    const element =
        $(selector);

    if (element) {

        element.textContent =
            text;

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GLOBAL DATE VALIDATION
   ========================================================= */

document.addEventListener(
    "change",
    event => {

        if (
            event.target.matches(
                "#returnDate"
            )
        ) {

            const departure =
                $("#departureDate");

            const returnDate =
                $("#returnDate");

            if (
                departure &&
                returnDate &&
                departure.value &&
                returnDate.value &&
                returnDate.value <
                departure.value
            ) {

                returnDate.setCustomValidity(
                    "Return date cannot be before departure date."
                );

            } else if (returnDate) {

                returnDate.setCustomValidity(
                    ""
                );

            }

        }

    }
);


/* =========================================================
   PREVENT DOUBLE SUBMISSION
   ========================================================= */

document.addEventListener(
    "submit",
    event => {

        const form =
            event.target;

        if (
            !form.dataset.submitting
        ) {
            return;
        }

        event.preventDefault();

    },
    true
);


/* =========================================================
   COMMUNITY PROGRESS
   ========================================================= */

function updateCommunityProgress() {

    const percentage =
        Math.min(
            100,
            (
                CONFIG.COMMUNITY_RAISED /
                CONFIG.COMMUNITY_TARGET
            ) * 100
        );

    const fills =
        $$(".progress-fill");

    fills.forEach(
        fill => {

            fill.style.width =
                `${percentage}%`;

        }
    );

}


/* =========================================================
   RUN COMMUNITY PROGRESS
   ========================================================= */

updateCommunityProgress();


/* =========================================================
   OPTIONAL GLOBAL API
   =========================================================

   Useful for debugging from browser console.
   ========================================================= */

window.NatalyaBookings = {

    calculateBookingTotal,

    calculateFlightSummary,

    updateSelectedPerfumes,

    showToast,

    getSelectedPerfumes: () =>
        [...selectedPerfumes],

    getLocalBookings: () => {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "natalya-bookings-local"
                ) || "[]"
            );

        } catch {

            return [];

        }

    }

};
/* =========================================================
   NATALYA BOOKINGS — LIVE BOOKING BASKET ENGINE
   ========================================================= */

function setupBookingBasket() {
  const basket = $("#bookingBasket");
  const backdrop = $("#basketBackdrop");
  const trigger = $("#basketTrigger");
  const closeButton = $("#basketClose");
  const itemsContainer = $("#basketItems");
  const emptyState = $("#basketEmpty");
  const basketTotal = $("#basketTotal");
  const basketCount = $("#basketCount");
  const checkoutButton = $("#basketCheckout");

  if (!basket || !trigger) return;

  function openBasket() {
    basket.classList.add("open");
    backdrop?.classList.add("open");

    basket.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  }

  function closeBasket() {
    basket.classList.remove("open");
    backdrop?.classList.remove("open");

    basket.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  }

  trigger.addEventListener("click", openBasket);

  closeButton?.addEventListener(
    "click",
    closeBasket
  );

  backdrop?.addEventListener(
    "click",
    closeBasket
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeBasket();
      }
    }
  );

  function renderBasket() {
    if (!itemsContainer) return;

    const items = [];

    /*
     * Experiences
     */
    $$(".experience-card input[type='checkbox']:checked")
      .forEach((checkbox) => {
        const card =
          checkbox.closest(".experience-card");

        const name =
          checkbox.dataset.name ||
          card?.querySelector("h3")?.textContent?.trim() ||
          checkbox.value ||
          "Experience";

        const price =
          Number(checkbox.dataset.price || 0);

        items.push({
          name,
          quantity: 1,
          price,
          type: "Experience"
        });
      });

    /*
     * Perfumes
     */
    $$(".perfume-select-checkbox:checked")
      .forEach((checkbox) => {
        const card =
          checkbox.closest(".perfume-card");

        const name =
          checkbox.dataset.name ||
          "Perfume";

        const price =
          Number(checkbox.dataset.price || 0);

        const quantity =
          Number(card?.dataset.quantity || 1);

        items.push({
          name,
          quantity,
          price: price * quantity,
          type: "Perfume"
        });
      });

    /*
     * Empty state
     */
    if (!items.length) {
      emptyState.style.display = "block";
      itemsContainer.innerHTML = "";

      basketTotal.textContent = "$0.00";
      basketCount.textContent = "0";

      return;
    }

    emptyState.style.display = "none";

    /*
     * Render items
     */
    itemsContainer.innerHTML = items
      .map((item) => {
        const quantityText =
          item.quantity > 1
            ? `Quantity: ${item.quantity}`
            : item.type;

        return `
          <div class="basket-item">
            <div class="basket-item-info">
              <strong>${escapeHTML(item.name)}</strong>
              <span>${escapeHTML(quantityText)}</span>
            </div>

            <div class="basket-item-price">
              $${item.price.toFixed(2)}
            </div>
          </div>
        `;
      })
      .join("");

    /*
     * Total
     */
    const total =
      items.reduce(
        (sum, item) => sum + item.price,
        0
      );

    basketTotal.textContent =
      "$" + total.toFixed(2);

    basketCount.textContent =
      String(items.length);

    window.NatalyaBookingTotal = total;
  }

  /*
   * Watch selection changes
   */
  document.addEventListener("change", (event) => {
    if (
      event.target.matches(
        ".experience-card input[type='checkbox'], .perfume-select-checkbox"
      )
    ) {
      setTimeout(renderBasket, 0);
    }
  });

  /*
   * Watch perfume quantity buttons
   */
  document.addEventListener("click", (event) => {
    if (
      event.target.closest(".quantity-button")
    ) {
      setTimeout(renderBasket, 0);
    }
  });

  /*
   * Continue to booking
   */
  checkoutButton?.addEventListener(
    "click",
    () => {
      closeBasket();

      const bookingSection =
        $("#book");

      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  );

  renderBasket();
}


/* =========================================================
   SAFE HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
