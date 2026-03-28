import {cart, deleteFromCart, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {convertMoney} from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js';

displayCartItems();
updateCheckoutItemQuantity();

function displayCartItems() {
  let cartHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct = products.find(product => productId === product.id);

    cartHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${convertMoney(matchingProduct.priceCents)}
            </div> 
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary
              js-update-link">
                Update
              </span>
              <input class = "quantity-input" type = "number" 
              data-product-id = "${matchingProduct.id}">
              <span class = "save-quantity-link link-primary 
              js-save-link" data-product-id = "${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary
              js-delete-link" data-product-id = "${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `
  });


  document.querySelector('.js-order-summary').innerHTML = cartHTML;


  document.querySelectorAll('.js-delete-link')
    .forEach((deleteLink) => {
      deleteLink.addEventListener('click', () => {
        const { productId } =  deleteLink.dataset;
        deleteFromCart(productId);
        displayCartItems();
        updateCheckoutItemQuantity();
      });   
    });

  document.querySelectorAll('.js-update-link')
    .forEach((updateLink) => {
      updateLink.addEventListener('click', () => {
        const itemContainer = updateLink.closest('.cart-item-container');
        const itemQuantity = itemContainer.querySelector('.quantity-label').innerText
        itemContainer.classList.add('is-editing-quantity');
        itemContainer.querySelector('.quantity-input').value = itemQuantity;
      })
    });

  document.querySelectorAll('.js-save-link')
  .forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      const { productId } = saveLink.dataset;
      const itemContainer = saveLink.closest('.cart-item-container');
      
      updateQuantityInCheckout(itemContainer, productId);
    })
  });

  document.querySelectorAll('.quantity-input')
  .forEach((quantityBox) => {
    quantityBox.addEventListener('keydown', (event) => {
      if(event.key === 'Enter') {
        const { productId } = quantityBox.dataset;
        const itemContainer = quantityBox.closest('.cart-item-container');
        updateQuantityInCheckout(itemContainer, productId);
      }
    })
  });
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let deliveryOptionsHtml = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays, 
      'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');

    const deliveryPrice = deliveryOption.priceCents;
    let priceString;

    priceString = (deliveryPrice === 0) ? 'FREE' : `$${convertMoney(deliveryPrice)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    deliveryOptionsHtml += ` 
      <div class="delivery-option">
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return deliveryOptionsHtml;
}

function updateCheckoutItemQuantity() {
  const quantity = calculateCartQuantity(cart);
  document.querySelector('.js-checkout-item-quantity').innerHTML = `${quantity} items`;
}

function updateQuantityInCheckout(itemContainer, productId) {
  const inputElement = itemContainer.querySelector('.quantity-input');
  const updatedQuantity = Number(inputElement.value);
  if(updatedQuantity > 0) {
    updateQuantity(productId, updatedQuantity);
    itemContainer.querySelector('.quantity-label').innerHTML = updatedQuantity;
    updateCheckoutItemQuantity();
    itemContainer.classList.remove('is-editing-quantity');
  } else if(updatedQuantity === 0) {
    deleteFromCart(productId);
    displayCartItems();
    updateCheckoutItemQuantity();
  } else if(updatedQuantity < 0) {
    alert('Not a valid quantity');
  }
}