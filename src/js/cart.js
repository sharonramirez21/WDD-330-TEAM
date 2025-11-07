import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      removeItemFromCart(e.target.dataset.id);
    });
  });

  showTotal();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="delete-btn" data-id="${item.Id}">❌ Eliminar</button>
</li>`;

  return newItem;
}


// remove item from the cart
function removeItemFromCart(productId) {
  let cartItems = getLocalStorage("so-cart");
  cartItems = cartItems.filter(item => item.Id != productId); // if the id dont is equal
  setLocalStorage("so-cart", cartItems); // we save the new cart
  renderCartContents();
}

// show the total
function showTotal() {
  const cartItems = getLocalStorage("so-cart") || [];
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice , 0);

  document.querySelector(".cart-total").textContent = `Total: $${total}`;
}

renderCartContents();
