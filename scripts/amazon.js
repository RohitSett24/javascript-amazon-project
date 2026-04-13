import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {convertMoney} from './utils/money.js';

updateCartDisplayCount();

let productsHtml = ''; 

products.forEach((product, index) => {
  productsHtml += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>
      
      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class = "js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-btn"
      data-product-id = "${product.id}">
        Add to Cart
      </button>
    </div>`;
}); 

document.querySelector('.js-products-grid').innerHTML = productsHtml;

let timeoutId;
let prevProductId;

function addedToCartConfirmation(productId) {
  const addedToCartElement = document.querySelector(`.js-added-to-cart-${productId}`);
  addedToCartElement.classList.add('added-to-cart-confirmation');
  
  if(productId === prevProductId) {
    clearTimeout(timeoutId);
  }
  
  timeoutId = setTimeout(() => {
    addedToCartElement.classList.remove('added-to-cart-confirmation');
  }, 2000);

  prevProductId = productId;
}

function updateCartDisplayCount() {
  const cartQuantity = calculateCartQuantity(cart);
  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}

document.querySelectorAll('.js-add-to-cart-btn')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      
      const selectElement = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(selectElement.value);
      addToCart(productId, quantity); 

      updateCartDisplayCount();

      addedToCartConfirmation(productId);
    });
  });