import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter , getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam('category');
const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

const dataSource = new ProductData();

const titleProducts = document.querySelector("#titleListProduct");
if (titleProducts) {
  titleProducts.textContent = `Top Products: ${categoryCapitalized}`;
}

const element = document.querySelector(".product-list");
const list = new ProductList(category, dataSource, element);
list.init();

