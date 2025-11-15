// import everything we need
import { getParam , loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

// data source for products from Product Data
const dataSource = new ProductData();

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
