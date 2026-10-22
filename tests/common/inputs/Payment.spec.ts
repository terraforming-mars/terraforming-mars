import {expect} from 'chai';
import {Payment} from '@/common/inputs/Payment';

describe('Payment', () => {
  it('toLogString', () => {
    expect(Payment.toLogString(undefined)).eq('0');
    expect(Payment.toLogString(Payment.EMPTY)).eq('0');
    expect(Payment.toLogString(Payment.of({megacredits: 3}))).eq('-3:r:mc:');
    expect(Payment.toLogString(Payment.of({megacredits: 3, steel: 1, microbes: 2}))).eq('-1:r:steel: -2:cr:microbe: -3:r:mc:');
  });
});
