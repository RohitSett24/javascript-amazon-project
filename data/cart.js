export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  let matchingItem = cart.find(item => productId === item.productId);

  if(matchingItem) {
    matchingItem.quantity += quantity;  
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1'
    })
  }

  saveCartToStorage(); 
}

export function deleteFromCart(productId) {
  cart.forEach((cartItem, index) => {
    if(productId === cartItem.productId) {
      cart.splice(index, 1);
    }
  })

  saveCartToStorage();
}  

export function updateQuantity(productId, updatedQuantity) {
  let matchingItem;
  
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  })

  matchingItem.quantity = updatedQuantity;
  saveCartToStorage();
}

export function calculateCartQuantity(cart) {
  let cartQuantity = 0;
      
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  return cartQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem = cart.find(item => productId === item.productId);
  matchingItem.deliveryOptionId = deliveryOptionId;

  saveCartToStorage();
}