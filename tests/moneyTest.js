import { convertMoney } from "../scripts/utils/money.js";

console.log('test suite: convertMoney')

console.log('converts cents to dollars');

if(convertMoney(2095) === '20.95') {
  console.log('passed');
} else {
  console.log('failed');
}

console.log('works with 0');

if(convertMoney(0) === '0.00') {
  console.log('passed');
} else {
  console.log('failed');
}

console.log('rounds up to the nearest cent');

if(convertMoney(2000.5) === '20.01') {
  console.log('passed');
} else {
  console.log('failed');
}

console.log('rounds down to the nearest cent');

if(convertMoney(2000.4) === '20.00') {
  console.log('passed');
} else {
  console.log('failed');
}