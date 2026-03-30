import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }  
];

export function getDeliveryOption(cartItem) {
  const deliveryOption = deliveryOptions.find(option => cartItem.deliveryOptionId === option.id);
  
  return deliveryOption;
}

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let deliveryDays = deliveryOption.deliveryDays;
  let deliveryDate = today;
  
  while(deliveryDays > 0) {
    deliveryDate = deliveryDate.add(1, 'day');

    if(deliveryDate.format('dddd') !== 'Saturday' && deliveryDate.format('dddd') !== 'Sunday'){
      deliveryDays--;
    }
  }
  
  const dateString = deliveryDate.format('dddd, MMMM D');

  return dateString;
}