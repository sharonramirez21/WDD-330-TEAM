import { CART_KEY, getCartCount as getStoredCartCount } from "./cartStorage.mjs";

const BADGE_SELECTOR = "[data-cart-count]";

export function getCartCount() {
  return getStoredCartCount();
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