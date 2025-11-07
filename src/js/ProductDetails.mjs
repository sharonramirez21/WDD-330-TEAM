import { getLocalStorage, setLocalStorage } from "./utils.mjs"; 

// we use this for the instance : const product -- product is the instance
export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId; // search for the product in the html with the id = 880RR
    this.product = {}; // Empty field to store information about the product found
    this.dataSource = dataSource; // Save the Product Data instance to search in JSON
  }

  async init() {
    // we wait the looking for the json by ID ↓
    this.product = await this.dataSource.findProductById(this.productId); 
    // ↓ We call the function that puts the data into the HTML  
    this.renderProductDetails(); 

    // listener boton "add to cart"
    // we use the addProductToCart() when the user make a click
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this)); 
  }

  // Add product to cart
  addProductToCart() {
    let cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  // update product data
  renderProductDetails() {
    ProductDetailsTemplate(this.product);
  }
}

function ProductDetailsTemplate(product) { // replace data in the product_pages/index.html
  document.querySelector("h2").textContent = product.Brand.Name; // replace the h2 with the Brand Name
  document.querySelector("h3").textContent = product.NameWithoutBrand; // replace the h3 with the Name

  const productImage = document.getElementById('productImage'); // replace the img with the image and the name
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.querySelector(".product-card__price").textContent = product.FinalPrice; // replace the p with the final price
  document.querySelector(".product__color").textContent = product.Colors[0].ColorName; // replace the color section p with the first color of the product and with the name
  document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple; // replace the description with inner to extract the apostrophes from the JSON file

  document.getElementById("addToCart").dataset.id = product.Id; // Add the product to the cart with the id
}