import { loadHeaderFooter } from "./utils.mjs";
import { getCartItems, removeCartItem as removeCartItemFromStorage, updateCartItemQuantity } from "./cartStorage.mjs";
import { notifyCartCountChange } from "./cartCount.js";

// team activity -- part 11
loadHeaderFooter();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function renderCartContents() {
  const cartItems = getCartItems();
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
    btn.addEventListener("click", (event) => {
      const productId = event.currentTarget.dataset.id;
      if (productId) {
        removeItemFromCart(productId);
      }
    });
  });

  document.querySelectorAll(".cart-quantity-input").forEach((input) => {
    input.addEventListener("change", handleQuantityChange);
  });

  showTotal(cartItems);
}

function cartItemTemplate(item) {
  const productLink = `../product_pages/?product=${item.Id}`;
  const colorName = item.Colors?.[0]?.ColorName ?? "";
  const imageSrc = item.Images?.PrimaryMedium ?? item.Image ?? "";
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
  <label class="cart-card__quantity">
    <span class="cart-card__quantity-label">Qty:</span>
    <input
      type="number"
      min="1"
      step="1"
      value="${item.quantity ?? 1}"
      data-id="${item.Id}"
      class="cart-quantity-input"
      aria-label="Quantity for ${item.Name}"
    />
  </label>
  <p class="cart-card__price">${currencyFormatter.format(item.FinalPrice)}</p>
  <p class="cart-card__price cart-card__price-total">Total: ${currencyFormatter.format(
    item.FinalPrice * (item.quantity ?? 1),
  )}</p>
  <button class="delete-btn" data-id="${item.Id}">❌ Eliminar</button>
</li>`;

  return newItem;
}

// remove item from the cart
function removeItemFromCart(productId) {
  removeCartItemFromStorage(productId);
  renderCartContents();
}

function handleQuantityChange(event) {
  const input = event.currentTarget;
  const productId = input.dataset.id;
  if (!productId) return;

  let newQuantity = Number.parseInt(input.value, 10);
  if (Number.isNaN(newQuantity) || newQuantity < 1) {
    newQuantity = 1;
  }

  updateCartItemQuantity(productId, newQuantity);
  renderCartContents();
}

function updateTotal(total) {
  const totalElement = document.querySelector(".cart-total");
  if (!totalElement) return;
  totalElement.textContent = `Total: ${currencyFormatter.format(total)}`;
}

// show the total
function showTotal(cartItems = getCartItems()) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity ?? 1),
    0,
  );
  updateTotal(total);
}

renderCartContents();
