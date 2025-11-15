import { getLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";
const BADGE_SELECTOR = "[data-cart-count]";

function getCartItems() {
  const cart = getLocalStorage(CART_KEY);
  return Array.isArray(cart) ? cart : [];
}

export function getCartCount() {
  return getCartItems().length;
}

export function updateCartCountBadge(count = getCartCount()) {
  if (typeof document === "undefined") {
    return count;
  }

  const badges = document.querySelectorAll(BADGE_SELECTOR);
  badges.forEach((badge) => {
    badge.textContent = count;
    const label = count === 1 ? "1 item in cart" : `${count} items in cart`;
    badge.setAttribute("aria-label", label);

    if (count === 0) {
      badge.setAttribute("hidden", "");
      badge.setAttribute("aria-hidden", "true");
    } else {
      badge.removeAttribute("hidden");
      badge.setAttribute("aria-hidden", "false");
    }
  });

  return count;
}

export function initCartCountBadge() {
  if (typeof window === "undefined") {
    return;
  }

  updateCartCountBadge();

  window.addEventListener("storage", (event) => {
    if (event.key === CART_KEY) {
      updateCartCountBadge();
    }
  });
}

export function notifyCartCountChange() {
  updateCartCountBadge();
}

initCartCountBadge();

// wait the header :) 
document.addEventListener("headerLoaded", () => {
  updateCartCountBadge();
});