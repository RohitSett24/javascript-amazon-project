export function convertMoney(priceInCents) {
  const roundedCents = (priceInCents >= 0) ? Math.round(priceInCents) : -Math.round(Math.abs(priceInCents));

  return (roundedCents / 100).toFixed(2);
}