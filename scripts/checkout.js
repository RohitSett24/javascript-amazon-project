import {cart, deleteFromCart, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {convertMoney} from './utils/money.js';

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
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
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