import { loadHeaderFooter } from "./utils.mjs";
import { getCartItems, removeCartItem as removeCartItemFromStorage, updateCartItemQuantity , saveCartItems} from "./cartStorage.mjs";
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

  document.querySelectorAll(".qty-decrease").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const productId = event.currentTarget.dataset.id;
      decreaseOne(productId);
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
  const imageSrc = item.Images?.PrimaryMedium ?? ""; // for the Api IMAGE
  const qty = item.quantity || 1;
  const itemTotal = item.FinalPrice * qty;
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
    <p class="cart-card__quantity">
      qty: ${item.quantity || 1}
      <button class="qty-decrease" data-id="${item.Id}">➖</button>
    </p>
    <p class="cart-card__price">${currencyFormatter.format(itemTotal)}</p>
    <button class="delete-btn" data-id="${item.Id}">❌ Delete</button>
  </li>`;
  return newItem;
}

// remove item from the cart
function removeItemFromCart(productId) {
  removeCartItemFromStorage(productId);
  notifyCartCountChange();
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

// when the user clicck the btn
document.querySelector("#checkoutBtn").addEventListener("click", () => {
  window.location.href = "/checkout/index.html";
});

// we delete 1 item from the cart
function decreaseOne(productId) {
  const cart = getCartItems();
  const item = cart.find((i) => i.Id == productId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
    saveCartItems(cart);
  } else {
    removeCartItemFromStorage(productId);
  }

  notifyCartCountChange();
  renderCartContents();
}
