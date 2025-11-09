// import everything we need
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// data source for products from Product Data
const dataSource = new ProductData("tents");

// get the product id's by the url
const productId = getParam("product");

// product Details - this is the instance
const product = new ProductDetails(productId, dataSource);

// ejecute init()
product.init();

// Display current viewport dimensions in the aside
const viewportInfo = document.querySelector("[data-viewport-info]");

if (viewportInfo) {
  const updateViewportInfo = () => {
    viewportInfo.textContent = `Viewport width: ${window.innerWidth}px × height: ${window.innerHeight}px`;
  };

  updateViewportInfo();
  window.addEventListener("resize", updateViewportInfo);
}

// Countdown timer demo using setInterval and setTimeout
const countdownDisplay = document.getElementById("countdown");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const countdownInput = document.getElementById("countdownInput");

if (countdownDisplay && startButton && pauseButton && countdownInput) {
  let countdownIntervalId = null;
  let countdownTimeoutId = null;
  let timeLeft = 0;
  let isPaused = false;

  const clearCountdownTimers = () => {
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }
    if (countdownTimeoutId) {
      clearTimeout(countdownTimeoutId);
      countdownTimeoutId = null;
    }
  };

  const setIdleState = (message = "Ready?") => {
    clearCountdownTimers();
    timeLeft = 0;
    isPaused = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    pauseButton.textContent = "Pause";
    countdownDisplay.textContent = message;
  };

  const scheduleFinish = () => {
    if (countdownTimeoutId) {
      clearTimeout(countdownTimeoutId);
    }

    if (timeLeft <= 0) {
      setIdleState("Time's up!");
      return;
    }

    countdownTimeoutId = setTimeout(() => {
      setIdleState("Time's up!");
    }, timeLeft * 1000);
  };

  const tick = () => {
    if (timeLeft > 0) {
      timeLeft -= 1;
      countdownDisplay.textContent = timeLeft;
    }
  };

  const startCountdown = () => {
    const parsedValue = Number.parseInt(countdownInput.value, 10);

    if (Number.isNaN(parsedValue) || parsedValue < 1) {
      countdownDisplay.textContent = "Enter a number ≥ 1";
      return;
    }

    clearCountdownTimers();
    timeLeft = parsedValue;
    countdownDisplay.textContent = timeLeft;
    startButton.disabled = true;
    pauseButton.disabled = false;
    pauseButton.textContent = "Pause";
    isPaused = false;

    countdownIntervalId = setInterval(tick, 1000);
    scheduleFinish();
  };

  const togglePause = () => {
    if (pauseButton.disabled || timeLeft <= 0) {
      return;
    }

    if (isPaused) {
      isPaused = false;
      pauseButton.textContent = "Pause";
      countdownIntervalId = setInterval(tick, 1000);
      scheduleFinish();
      return;
    }

    isPaused = true;
    pauseButton.textContent = "Resume";
    clearCountdownTimers();
  };

  startButton.addEventListener("click", startCountdown);
  pauseButton.addEventListener("click", togglePause);
  setIdleState("Ready?");
}

// Template demo: render cards on demand
const renderProductsButton = document.getElementById("renderProducts");
const productList = document.getElementById("productList");
const productTemplate = document.getElementById("productCardTemplate");

if (renderProductsButton && productList && productTemplate) {
  const featuredProducts = [
    {
      name: "Trailblazer Stove",
      description: "Compact, fuel-efficient stove built for alpine starts.",
      price: "$79.99",
      image: "https://placehold.co/400x260?text=Trailblazer+Stove",
    },
    {
      name: "Everlight Lantern",
      description: "Rechargeable lantern with 3 brightness modes.",
      price: "$49.99",
      image: "https://placehold.co/400x260?text=Everlight+Lantern",
    },
    {
      name: "Summit Chair",
      description: "Lightweight camp chair that folds into any pack.",
      price: "$64.99",
      image: "https://placehold.co/400x260?text=Summit+Chair",
    },
    {
      name: "Ridge Insulated Bottle",
      description: "Keeps drinks hot for 12h, cold for 24h.",
      price: "$34.99",
      image: "https://placehold.co/400x260?text=Ridge+Bottle",
    },
  ];

  const renderProducts = () => {
    productList.setAttribute("aria-busy", "true");
    productList.replaceChildren();

    featuredProducts.forEach((product) => {
      const clone = productTemplate.content.cloneNode(true);
      const img = clone.querySelector("img");
      const title = clone.querySelector("h3");
      const desc = clone.querySelector(".template-card__desc");
      const price = clone.querySelector(".template-card__price");

      if (img) {
        img.src = product.image;
        img.alt = product.name;
      }
      if (title) title.textContent = product.name;
      if (desc) desc.textContent = product.description;
      if (price) price.textContent = product.price;

      productList.appendChild(clone);
    });

    productList.setAttribute("aria-busy", "false");
    renderProductsButton.textContent = "Refresh Featured Gear";
  };

  renderProductsButton.addEventListener("click", renderProducts);
}

/*
function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || []; // we made an array
  cart.push(product);
  setLocalStorage("so-cart", cart);
} */

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
