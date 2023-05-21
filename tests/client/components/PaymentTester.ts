import Vue from 'vue';
import {Wrapper} from '@vue/test-utils';
import {expect} from 'chai';
import {SelectPaymentModel} from '@/client/mixins/PaymentWidgetMixin';
import {PaymentKey} from '@/common/inputs/Payment';

export class PaymentTester {
  private model: SelectPaymentModel;
  constructor(private wrapper: Wrapper<Vue>) {
    this.model = this.wrapper.vm as unknown as SelectPaymentModel;
  }

  private static selector(type: PaymentKey) {
    const titles: Record<PaymentKey, String> = {
      'megaCredits': 'Megacredits',
      'steel': 'Steel',
      'titanium': 'Titanium',
      'heat': 'Heat',
      'microbes': 'Microbes',
      'floaters': 'Floaters',
      'science': 'Science',
      'seeds': 'Seeds',
      'auroraiData': 'Data',
    };
    const title = titles[type];
    return '[title~=' + title + ']';
  }

  public async clickMax(type: PaymentKey) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-max');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickMinus(type: PaymentKey) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-minus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickPlus(type: PaymentKey) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-plus');
    await button.trigger('click');
    await this.nextTick();
  }

  public async clickSave() {
    const button = this.wrapper.find('[data-test=save]');
    await button.trigger('click');
    await this.nextTick();
  }

  public getValue(type: PaymentKey) {
    const textBox = this.wrapper.find(PaymentTester.selector(type) + ' ~ input').element as HTMLInputElement;
    return textBox.value;
  }

  // This that the given unit has the given value. It does this two ways:
  // It verifies that the model has this value, and also that the text box
  // has the same value.
  public expectValue(type: PaymentKey, amount: number) {
    const vmVal = this.model[type];
    expect(this.getValue(type), 'text box value for ' + type).eq(String(amount));
    expect(vmVal, 'VM box value for ' + type).eq(amount);
  }

  // When `expected` is true, this passes when the unit type is available and visible to the user,
  // and vice-versa.
  public expectIsAvailable(type: PaymentKey, expected: boolean) {
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
