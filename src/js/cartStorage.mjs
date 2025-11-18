import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export const CART_KEY = "so-cart";

function idsEqual(a, b) {
  if (a === undefined || a === null || b === undefined || b === null) {
    return false;
  }
  return String(a) === String(b);
}

function normalizeQuantity(quantity) {
  const parsed = Number(quantity);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

function cloneProduct(product) {
  return { ...product };
}

function normalizeCartItems(items) {
  if (!Array.isArray(items)) return [];

  return items.reduce((acc, item = {}) => {
    if (!item || typeof item !== "object" || !item.Id) {
      return acc;
    }

    const quantity = normalizeQuantity(item.quantity ?? 1);
    const existingItem = acc.find((cartItem) => idsEqual(cartItem.Id, item.Id));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      acc.push({ ...cloneProduct(item), quantity });
    }

    return acc;
  }, []);
}

export function getCartItems() {
  const storedItems = getLocalStorage(CART_KEY) || [];
  return normalizeCartItems(storedItems);
}

export function saveCartItems(items) {
  const normalized = normalizeCartItems(items);
  setLocalStorage(CART_KEY, normalized);
  return normalized;
}

export function getCartCount(cartItems = getCartItems()) {
  return cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
}

export function incrementCartItem(product) {
  if (!product || !product.Id) return getCartItems();

  const cart = getCartItems();
  const existingItem = cart.find((item) => idsEqual(item.Id, product.Id));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...cloneProduct(product), quantity: 1 });
  }

  return saveCartItems(cart);
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCartItems();
  const targetIndex = cart.findIndex((item) => idsEqual(item.Id, productId));

  if (targetIndex === -1) return cart;

  if (quantity < 1) {
    cart.splice(targetIndex, 1);
  } else {
    cart[targetIndex].quantity = normalizeQuantity(quantity);
  }

  return saveCartItems(cart);
}

export function removeCartItem(productId) {
  const cart = getCartItems().filter((item) => !idsEqual(item.Id, productId));
  return saveCartItems(cart);
}
