import {
  getWishlistItems,
  removeFromWishlist,
  moveToCart,
} from "./wishlistStorage.mjs";
import { notifyCartCountChange } from "./cartCount.js";

const container = document.querySelector("#wishlistContainer");

export function updateWishlistCount() {
  const count = getWishlistItems().length;
  const counter = document.getElementById("wishlistCount");
  if (counter) {
    counter.textContent = count;
    counter.hidden = count === 0;
  }
}

function renderWishlist() {
  const items = getWishlistItems();

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const qty = item.quantity || 1;
      return `
      <div class="wishlist-item" data-id="${item.Id}">
        <img src="${item.Images?.PrimaryMedium ?? ""}" alt="${item.Name}">
        <p>${item.Name} (x${qty}) - $${(item.FinalPrice * qty).toFixed(2)}</p>
        <button class="move-to-cart">Move to Cart</button>
        <button class="remove-from-wishlist">Remove</button>
      </div>
    `;
    })
    .join("");

  container.querySelectorAll(".move-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.closest(".wishlist-item").dataset.id;
      moveToCart(productId);
      notifyCartCountChange();
      renderWishlist();
      updateWishlistCount();
    });
  });

  container.querySelectorAll(".remove-from-wishlist").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.closest(".wishlist-item").dataset.id;
      removeFromWishlist(productId);
      renderWishlist();
      updateWishlistCount();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
  updateWishlistCount();
});
