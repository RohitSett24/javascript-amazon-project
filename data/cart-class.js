import {deliveryOptions} from './deliveryOptions.js';

class Cart {
  cartItems;
  localStorageKey;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
  }

  saveCartToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity) {
    let matchingItem = this.cartItems.find(item => productId === item.productId);
  
    if(matchingItem) {
      matchingItem.quantity += quantity;  
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      })
    }
  
    this.saveCartToStorage(); 
  }

  deleteFromCart(productId) {
    this.cartItems.forEach((cartItem, index) => {
      if(productId === cartItem.productId) {
        this.cartItems.splice(index, 1);
      }
    })
  
    this.saveCartToStorage();
  }

  updateQuantity(productId, updatedQuantity) {
    let matchingItem;
    
    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    })
  
    matchingItem.quantity = updatedQuantity;
    this.saveCartToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;
        
    this.cartItems.forEach((item) => {
      cartQuantity += item.quantity;
    });
  
    return cartQuantity;
  }
  
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem = this.cartItems.find(item => productId === item.productId);
  
    if(!matchingItem) {
      return;
    }
  
    let deliveryOption = deliveryOptions.find(deliveryOption => deliveryOptionId === deliveryOption.id);
  
    if(!deliveryOption) {
      return;
    }
  
    matchingItem.deliveryOptionId = deliveryOptionId;
  
    this.saveCartToStorage(); 
  }
};

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business'); 

console.log(cart);
console.log(businessCart);

console.log(businessCart instanceof Cart);