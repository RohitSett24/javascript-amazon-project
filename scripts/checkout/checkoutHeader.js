import {calculateCartQuantity, cart} from "../../data/cart.js";

export function renderCheckoutHeader() {
  const cartQuantity = calculateCartQuantity(cart);

  const html = `
    Checkout (<a class="return-to-home-link"
    href="amazon.html">${cartQuantity} items</a>)
  `;

  document.querySelector('.js-checkout-header')
    .innerHTML = html;
}