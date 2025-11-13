import { renderListWithTemplate, getLocalStorage } from "./utils.mjs";

function cartItemTemplate (item) {
    return `
    <li class="cart-item">
      <img src="${item.Image}" alt="Image of ${item.Name}">
      <div class="cart-item__info">
        <h3>${item.Name}</h3>
        <p class="cart-item__brand">${item.Brand.Name}</p>
        <p class="cart-item__price">$${item.FinalPrice}</p>
      </div>
    </li>`;
}

export default class ShoppingCart {
    constructor(key, listElement) {
        this.key = key;
        this.listElement = listElement;
    }

    async init() {
        const cartItems = getLocalStorage(this.key) || [];
        this.renderList(cartItems);
    }

    renderList(list) {
        renderListWithTemplate(cartItemTemplate, this.listElement, list);
    }
}