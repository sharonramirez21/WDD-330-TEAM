import { getLocalStorage, loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

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

document
  .querySelector("#checkoutBtnForm")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const myForm = document.forms[0];
    const isValid = myForm.checkValidity();
    myForm.reportValidity();

    if (isValid) {
      try {
        await checkout.checkout(e, myForm);
        alertMessage("Order submitted successfully!");
      } catch (error) {
        alertMessage("There was a problem: " + error.message);
      }
    }
  });
