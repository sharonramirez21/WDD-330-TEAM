import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { notifyCartCountChange } from "./cartCount.js";

// team activity -- part 11
loadHeaderFooter();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const listElement = document.querySelector(".product-list");

  notifyCartCountChange();

  if (!listElement) return;

  if (!cartItems.length) {
    listElement.innerHTML = `<li class="cart-card divider cart-card--empty">Your cart is empty.</li>`;
    updateTotal(0);
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  listElement.innerHTML = htmlItems.join("");

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeItemFromCart(e.target.dataset.id);
    });
  });

  showTotal();
}

function cartItemTemplate(item) {
  const productLink = `../product_pages/?product=${item.Id}`;
  const colorName = item.Colors?.[0]?.ColorName ?? "";
  const imageSrc = item.Images?.PrimaryMedium ?? ""; // for the Api IMAGE
  const newItem = `<li class="cart-card divider">
  <a href="${productLink}" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="${productLink}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
  <p class="cart-card__price">${currencyFormatter.format(item.FinalPrice)}</p>
  <button class="delete-btn" data-id="${item.Id}">❌ Delete</button>
</li>`;

  return newItem;
}

// remove item from the cart
function removeItemFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];
  const item = cartItems.find(i => i.Id === productId);
  if (!item) return;
  
  // if we have more than 1 item with the same id in the cart
  if (item.quantity && item.quantity > 1) {
    item.quantity -= 1;
  }
  else {
    cartItems = cartItems.filter(i => i.Id !== productId);
  }
  setLocalStorage("so-cart", cartItems);
  notifyCartCountChange();
  renderCartContents();
}

function updateTotal(total) {
  const totalElement = document.querySelector(".cart-total");
  if (!totalElement) return;
  totalElement.textContent = `Total: ${currencyFormatter.format(total)}`;
}

// show the total 
function showTotal() {
  const cartItems = getLocalStorage("so-cart") || [];
  const total = cartItems.reduce((sum, item) => {
    const qty = item.quantity || 1;
    return sum + (item.FinalPrice * qty);
  }, 0);
  updateTotal(total);
}

renderCartContents();
