// import everything we need
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

// data source for products from Product Data
const dataSource = new ExternalServices();

// get the product id's by the url
const productId = getParam("product");

// product Details - this is the instance
const product = new ProductDetails(productId, dataSource);

// ejecute init()
product.init();

/*
function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || []; // we made an array
  cart.push(product);
  setLocalStorage("so-cart", cart);
} */

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
