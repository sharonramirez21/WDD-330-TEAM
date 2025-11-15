import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { notifyCartCountChange } from "./cartCount.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    if (!this.productId) {
      this.renderError("Sorry, no product was specified.");
      return;
    }

    try {
      this.product = await this.dataSource.findProductById(this.productId);
    } catch (error) {
      this.renderError(`We could not load this product. (${error.message})`);
      return;
    }

    if (!this.product) {
      this.renderError("We could not find that product.");
      return;
    }

    this.renderProductDetails();

    const addButton = document.getElementById("addToCart");
    if (addButton) {
      addButton.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    if (!this.product) return;
    const cart = getLocalStorage("so-cart") || [];

    // if the product exist 
    const existing = cart.find(item => item.Id == this.product.Id);

    if (existing) {
      existing.quantity = (existing.quantity || 1 ) + 1;
    }
    else {
      this.product.quantity = 1;
      cart.push(this.product);
    }
    setLocalStorage("so-cart", cart);
    notifyCartCountChange();
    this.setMessage(`${this.product.NameWithoutBrand} added to cart.`);
  }

  renderProductDetails() {
    document.querySelector(".product-detail")?.classList.remove("product-detail--error");

    const {
      Brand: { Name: brandName } = {},
      NameWithoutBrand,
      Images = {},
      FinalPrice,
      Colors = [],
      DescriptionHtmlSimple,
      Id,
    } = this.product;

    const brandElement = document.getElementById("productBrand");
    if (brandElement) {
      brandElement.textContent = brandName ?? "SleepOutside";
    }

    const nameElement = document.getElementById("productName");
    if (nameElement) {
      nameElement.textContent = NameWithoutBrand;
    }

    const productImage = document.getElementById("productImage");
    if (productImage) {
      productImage.src = Images.PrimaryLarge ?? ""; // for the API
      productImage.alt = NameWithoutBrand ?? "Product image";
    }

    const priceElement = document.getElementById("productPrice");
    if (priceElement) {
      priceElement.textContent = currencyFormatter.format(FinalPrice);
    }

    const colorElement = document.getElementById("productColor");
    if (colorElement) {
      colorElement.textContent = Colors[0]?.ColorName ?? "";
    }

    const descriptionElement = document.getElementById("productDesc");
    if (descriptionElement) {
      descriptionElement.innerHTML = DescriptionHtmlSimple;
    }

    const addButton = document.getElementById("addToCart");
    if (addButton) {
      addButton.dataset.id = Id;
      addButton.disabled = false;
    }

    this.setMessage("");
  }

  renderError(message) {
    const detail = document.querySelector(".product-detail");
    if (detail) {
      detail.classList.add("product-detail--error");
    }
    const addButton = document.getElementById("addToCart");
    if (addButton) {
      addButton.disabled = true;
    }
    this.setMessage(message);
  }

  setMessage(message) {
    const messageElement = document.getElementById("productMessage");
    if (!messageElement) return;
    if (message) {
      messageElement.textContent = message;
      messageElement.hidden = false;
    } else {
      messageElement.textContent = "";
      messageElement.hidden = true;
    }
  }
}
