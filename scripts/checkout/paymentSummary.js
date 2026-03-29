import {cart, calculateCartQuantity} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {convertMoney} from '../utils/money.js';

export function renderPaymentSummary() {
  let productCostCents = 0;
  let shippingCostCents = 0;

  cart.forEach((cartItem) => {
    let matchingProduct = getProduct(cartItem);
    productCostCents += matchingProduct.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem);
    shippingCostCents += deliveryOption.priceCents;
  }); 

  const totalBeforeTaxCents = productCostCents + shippingCostCents;
  const taxCents = totalBeforeTaxCents * 0.1;

  const totalCostCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>  

    <div class="payment-summary-row">
      <div>Items (${calculateCartQuantity(cart)}):</div>
      <div class="payment-summary-money">$${convertMoney(productCostCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${convertMoney(shippingCostCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${convertMoney(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${convertMoney(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${convertMoney(totalCostCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;
}