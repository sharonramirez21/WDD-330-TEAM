import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const WISHLIST_KEY = "so-wishlist";

//// Get the products on the wishlist
export function getWishlistItems() {
  return getLocalStorage(WISHLIST_KEY) || [];
}

// save the wishlist
export function saveWishlist(items) {
  setLocalStorage(WISHLIST_KEY, items);
  return items;
}

// we add a product in the wishlist
export function addToWishlist(product) {
  if (!product || !product.Id) return;

  const wishlist = getWishlistItems();
  const exists = wishlist.find(item => item.Id === product.Id);

  if (!exists) {
    wishlist.push(product);
    saveWishlist(wishlist);
  }
}

// delete product
export function removeFromWishlist(productId) {
  const wishlist = getWishlistItems().filter(item => item.Id !== productId);
  saveWishlist(wishlist);
}

// if we want move the product to the cart
import { incrementCartItem } from "./cartStorage.mjs";

export function moveToCart(productId) {
  const wishlist = getWishlistItems();
  const item = wishlist.find(p => p.Id === productId);
  if (item) {
    incrementCartItem(item);
    removeFromWishlist(productId);
  }
}
