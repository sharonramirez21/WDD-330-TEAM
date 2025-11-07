import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");
// step 4 : 6 -- week 2
const list = new ProductList("tents", dataSource, element);

list.init();