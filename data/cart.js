export const cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  const selectElement = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(selectElement.value);

  let matchingItem;
  
  cart.forEach((item) => {
    if(productId === item.productId) {
      matchingItem = item;
    }
  });

  if(matchingItem) {
    matchingItem.quantity += quantity;  
  } else {
    cart.push({
      productId,
      quantity
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