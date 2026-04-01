import {cart, deleteFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {convertMoney} from '../utils/money.js';
import {getDeliveryOption, deliveryOptions, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import {getProduct} from '../../data/products.js';
import {renderPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';

export function renderOrderSummary() {
  let cartHTML = ''; 

  cart.forEach((cartItem) => {
    let matchingProduct = getProduct(cartItem);

    const deliveryOption = getDeliveryOption(cartItem);

    const dateString = calculateDeliveryDate(deliveryOption);
    
    cartHTML += `
      <div class="cart-item-container
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
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
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class ="quantity-label">${cartItem.quantity}</span>
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
              js-delete-link js-delete-link-${matchingProduct.id}" 
              data-product-id = "${matchingProduct.id}">
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
        renderOrderSummary();
        renderPaymentSummary();
        renderCheckoutHeader();
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
      renderPaymentSummary();
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

  document.querySelectorAll('.js-delivery-option')
  .forEach((option) => {
    option.addEventListener('click', () => {
      const {productId, deliveryOptionId} = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let deliveryOptionsHtml = '';

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = calculateDeliveryDate(deliveryOption);

    const deliveryPrice = deliveryOption.priceCents;
    let priceString;

    priceString = (deliveryPrice === 0) ? 'FREE' : `$${convertMoney(deliveryPrice)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    deliveryOptionsHtml += ` 
      <div class="delivery-option js-delivery-option"
      data-product-id = "${matchingProduct.id}"
      data-delivery-option-id = "${deliveryOption.id}">
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

function updateQuantityInCheckout(itemContainer, productId) {
  const inputElement = itemContainer.querySelector('.quantity-input');
  const updatedQuantity = Number(inputElement.value);
  if(updatedQuantity > 0) {
    updateQuantity(productId, updatedQuantity);
    itemContainer.querySelector('.quantity-label').innerHTML = updatedQuantity;
    renderCheckoutHeader();
    itemContainer.classList.remove('is-editing-quantity');
  } else if(updatedQuantity === 0) {
    deleteFromCart(productId);
    renderOrderSummary();
    renderCheckoutHeader();
  } else if(updatedQuantity < 0) {
    alert('Not a valid quantity');
  }
}
