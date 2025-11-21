import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "../js/CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#orden-summary");
checkout.init();

// 1. show items
renderCheckoutItems();

// 2. calculate total
checkout.calculateOrderTotal();
checkout.calculateTotal();

// when the user put the zip code we recalculate
document.querySelector("#zipCode").addEventListener("change", () => {
  checkout.calculateOrderTotal();
  checkout.calculateTotal();
});


function renderCheckoutItems() {
  const items = getLocalStorage("so-cart") || [];
  const listElement = document.querySelector("#checkout-items");

  if (!listElement) return;

  listElement.innerHTML = items
    .map((item) => {
      const qty = item.quantity || 1;
      return `
        <li class="checkout-item">
          <img src="${item.Images?.PrimaryMedium}" alt="${item.Name}">
          <p>${item.Name} (x${qty}) - $${(item.FinalPrice * qty).toFixed(2)}</p>
        </li>
      `;
    })
    .join("");
}

const form = document.querySelector("#checkout-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevenir recarga de página

  const result = await checkout.checkout(form); // checkout es la instancia de CheckoutProcess

  console.log(result); // aquí puedes ver la respuesta del servidor
  alert("Order submitted successfully!"); // o mostrar ventana flotante
});
