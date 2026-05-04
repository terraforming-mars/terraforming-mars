import {VueWrapper} from '@vue/test-utils';
import {expect} from 'chai';
import {Payment} from '@/common/inputs/Payment';
import {SPENDABLE_RESOURCES, SpendableResource} from '@/common/inputs/Spendable';

export class PaymentTesterRevised {
  constructor(private wrapper: VueWrapper<any>) {}

  private static selector(unit: SpendableResource) {
    return `[data-test=${unit}]`;
  }

  public async clickMax(type: SpendableResource) {
    const button = this.wrapper.find(PaymentTesterRevised.selector(type) + ' .btn-max');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickMinus(type: SpendableResource) {
    const button = this.wrapper.find(PaymentTesterRevised.selector(type) + ' .btn-minus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickPlus(type: SpendableResource) {
    const button = this.wrapper.find(PaymentTesterRevised.selector(type) + ' .btn-plus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickSave() {
    const button = this.wrapper.find('[data-test=save]');
    await button.trigger('click');
    await this.nextTick();
  }

  public getValue(unit: SpendableResource): number {
    const found = this.wrapper.find(PaymentTesterRevised.selector(unit) + ' input');
    if (!found.exists()) {
      throw new Error('Cannot find text box for ' + unit);
    }
    const textBox = found.element as HTMLInputElement;
    return Number.parseInt(textBox?.value);
  }

  public getPayment(): Partial<Payment> {
    const payment: Partial<Payment> = {};
    for (const unit of SPENDABLE_RESOURCES) {
      if (this.isAvailable(unit)) {
        payment[unit] = this.getValue(unit);
      }
    }
    return payment;
  }

  expectPayment(expected: Partial<Payment>) {
    expect(this.getPayment()).deep.eq(expected);
  }

  public expectValue(unit: SpendableResource, amount: number) {
    expect(this.getValue(unit), `text box value for ${unit}`).eq(amount);
  }

  private isAvailable(unit: SpendableResource): boolean {
    return this.wrapper.find(PaymentTesterRevised.selector(unit) + ' input').exists();
  }

  public expectIsAvailable(unit: SpendableResource) {
    expect(this.isAvailable(unit), `Expect input for ${unit} to be visible`).is.true;
  }

  public expectIsNotAvailable(unit: SpendableResource) {
    expect(this.isAvailable(unit), `Expect input for ${unit} to be invisible`).is.false;
  }

  public getAvailablePaymentComponents(): ReadonlyArray<SpendableResource> {
    const available: Array<SpendableResource> = [];
    for (const unit of SPENDABLE_RESOURCES) {
      if (this.isAvailable(unit)) {
        available.push(unit);
      }
    }
    return available;
  }

  public expectAvailablePaymentComponents(...units: Array<SpendableResource>) {
    const available = this.getAvailablePaymentComponents();
    expect(available).has.members(units);
  }

  public async nextTick() {
    await this.wrapper.vm.$nextTick();
  }
}
