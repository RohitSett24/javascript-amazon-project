export function convertMoney(priceInCents) {
  return (priceInCents / 100).toFixed(2);
}