import Vue from 'vue';
import {Wrapper} from '@vue/test-utils';
import {expect} from 'chai';
import {SelectPaymentModel, Unit} from '@/client/mixins/PaymentWidgetMixin';

export class PaymentTester {
  private model: SelectPaymentModel;
  constructor(private wrapper: Wrapper<Vue>) {
    this.model = this.wrapper.vm as unknown as SelectPaymentModel;
  }

  private static selector(type: Unit) {
    const re = type === 'megaCredits' ? 'Megacredits' : (type.charAt(0).toUpperCase() + type.slice(1)); // (eg steel -> Steel)
    return '[title~=' + re + ']';
  }

  public async clickMax(type: Unit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-max');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickMinus(type: Unit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-minus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickPlus(type: Unit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-plus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickSave() {
    const button = this.wrapper.find('[data-test=save]');
    await button.trigger('click');
    await this.nextTick();
  }

  public getValue(type: Unit) {
    const textBox = this.wrapper.find(PaymentTester.selector(type) + ' ~ input').element as HTMLInputElement;
    return textBox.value;
  }

  // This that the given unit has the given value. It does this two ways:
  // It verifies that the model has this value, and also that the text box
  // has the same value.
  public expectValue(type: Unit, amount: number) {
    const vmVal = this.model[type];
    expect(this.getValue(type), 'text box value for ' + type).eq(String(amount));
    expect(vmVal, 'VM box value for ' + type).eq(amount);
  }

  // When `expected` is true, this passes when the unit type is available and visible to the user,
  // and vice-versa.
  public expectIsAvailable(type: Unit, expected: boolean) {
    const w = this.wrapper.find(PaymentTester.selector(type) + ' ~ input');
    if (expected) {
      expect(w.element, `Expect input for ${type} to be visible`).is.not.undefined;
    } else {
      expect(w.element, `Expect input for ${type} to be invisible`).is.undefined;
    }
  }

  public async nextTick() {
    await this.wrapper.vm.$nextTick();
  }
}
