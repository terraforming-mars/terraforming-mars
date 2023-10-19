import Vue from 'vue';
import {Wrapper} from '@vue/test-utils';
import {expect} from 'chai';
import {SelectPaymentDataModel} from '@/client/mixins/PaymentWidgetMixin';
import {PAYMENT_UNITS, Payment, PaymentUnit} from '@/common/inputs/Payment';

export class PaymentTester {
  private model: SelectPaymentDataModel;
  constructor(private wrapper: Wrapper<Vue>) {
    this.model = this.wrapper.vm as unknown as SelectPaymentDataModel;
  }

  private static selector(unit: PaymentUnit) {
    return `[data-test=${unit}]`;
  }

  public async clickMax(type: PaymentUnit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' .btn-max');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickMinus(type: PaymentUnit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' .btn-minus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickPlus(type: PaymentUnit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' .btn-plus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickSave() {
    const button = this.wrapper.find('[data-test=save]');
    await button.trigger('click');
    await this.nextTick();
  }

  public getValue(unit: PaymentUnit): number {
    const textBox = this.wrapper.find(PaymentTester.selector(unit) + ' input').element as HTMLInputElement;
    if (textBox === undefined) {
      throw new Error('Cannot find text box for ' + unit);
    }
    return Number.parseInt(textBox?.value);
  }

  public getPayment(): Partial<Payment> {
    const payment: Partial<Payment> = {};
    for (const unit of PAYMENT_UNITS) {
      if (this.isAvailable(unit)) {
        payment[unit] = this.getValue(unit);
      }
    }
    return payment;
  }

  expectPayment(expected: Partial<Payment>) {
    expect(this.getPayment()).deep.eq(expected);
  }

  // This that the given unit has the given value. It does this two ways:
  // It verifies that the model has this value, and also that the text box
  // has the same value.
  public expectValue(unit: PaymentUnit, amount: number) {
    const vmVal = this.model.payment[unit];
    expect(this.getValue(unit), `text box value for ${unit}`).eq(amount);
    expect(vmVal, 'VM box value for ' + unit).eq(amount);
  }

  /**
   * Returns true when the text box for `unit` is visible.
   */
  private isAvailable(unit: PaymentUnit): boolean {
    return this.wrapper.find(PaymentTester.selector(unit) + ' input')?.element !== undefined;
  }

  /**
   * Passes when the text box for `unit` is visible.
   */
  public expectIsAvailable(unit: PaymentUnit) {
    expect(this.isAvailable(unit), `Expect input for ${unit} to be visible`).is.true;
  }

  /**
   * Passes when the text box for `unit` is not visible.
   */
  public expectIsNotAvailable(unit: PaymentUnit) {
    expect(this.isAvailable(unit), `Expect input for ${unit} to be invisible`).is.false;
  }

  public async nextTick() {
    await this.wrapper.vm.$nextTick();
  }
}
