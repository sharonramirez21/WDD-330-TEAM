import Alert from "./Alert.js";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const alerts = new Alert("/alerts.json", document.querySelector("main"));
alerts.init();

const category = getParam("category");
const categoryCapitalized =
  category.charAt(0).toUpperCase() + category.slice(1);

const dataSource = new ExternalServices();

const titleProducts = document.querySelector("#titleListProduct");
if (titleProducts) {
  titleProducts.textContent = `Top Products: ${categoryCapitalized}`;
}

const element = document.querySelector(".product-list");
const list = new ProductList(category, dataSource, element);
list.init();
