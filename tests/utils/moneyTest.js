import { convertMoney } from "../../scripts/utils/money.js";

describe('test suite: convertMoney', () => {
  it('convert cents into dollars', () => {
    expect(convertMoney(2095)).toEqual('20.95');
  });

  it('works with 0', () => {
    expect(convertMoney(0)).toEqual('0.00');
  });

  it('rounds up to the nearest cent', () => {
    expect(convertMoney(2000.5)).toEqual('20.01');
  });

  it('rounds down to the nearest cent', () => {
    expect(convertMoney(2000.4)).toEqual('20.00');
  });

  it('works with negative number', () => {
    expect(convertMoney(-1525)).toEqual('-15.25');
  })

  it('rounds the negative number', () => {
    expect(convertMoney(-1000.5)).toEqual('-10.01');
  })
});