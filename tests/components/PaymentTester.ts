import Vue from 'vue';
import {Wrapper} from '@vue/test-utils';
import {expect} from 'chai';
import {SelectHowToPayModel} from '../../src/components/PaymentWidgetMixin';

export type Unit = 'heat' | 'steel' | 'titanium' | 'floaters' | 'microbes' | 'megaCredits' | 'science';


export class PaymentTester {
  private model: SelectHowToPayModel;
  constructor(private wrapper: Wrapper<Vue>) {
    this.model = this.wrapper.vm as unknown as SelectHowToPayModel;
  }

  private static selector(type: Unit) {
    const re = type === 'megaCredits' ? 'Megacredits' : (type.charAt(0).toUpperCase() + type.slice(1)); // (eg steel -> Steel)
    return '[title~=' + re + ']';
  };

  public async clickMax(type: Unit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-max');
    await button.trigger('click');
    await this.nextTick();
  };

  public async clickMinus(type: Unit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-minus');
    await button.trigger('click');
    await this.nextTick();
  };

  public async clickPlus(type: Unit) {
    const button = this.wrapper.find(PaymentTester.selector(type) + ' ~ .btn-plus');
    await button.trigger('click');
    await this.nextTick();
  };

  // This that the given unit has the given value. It does this two ways:
  // It verifies that the model has this value, and also that the text box
  // has the same value.
  public expectValue(type: Unit, amount: number) {
    let vmVal: number | undefined;
    switch (type) {
    case 'heat':
      vmVal = this.model.heat;
      break;
    case 'steel':
      vmVal = this.model.steel;
      break;
    case 'titanium':
      vmVal = this.model.titanium;
      break;
    case 'floaters':
      vmVal = this.model.floaters;
      break;
    case 'microbes':
      vmVal = this.model.microbes;
      break;
    case 'megaCredits':
      vmVal = this.model.megaCredits;
      break;
    case 'science':
      vmVal = this.model.science;
      break;
    }
    const textBox = this.wrapper.find(PaymentTester.selector(type) + ' ~ input').element as HTMLInputElement;
    expect(textBox.value, 'text box value for ' + type).eq(String(amount));
    expect(vmVal, 'VM box value for ' + type).eq(amount);
  };

  // When `expected` is true, this passes when the unit type is available and visible to the user,
  // and vice-versa.
  public expectIsAvailable(type: Unit, expected: boolean) {
    const w = this.wrapper.find(PaymentTester.selector(type) + ' ~ input');
    if (expected) {
      expect(w.element, `Expect input for ${type} to be visible`).is.not.undefined;
    } else {
      expect(w.element, `Expect input for ${type} to be invisible`).is.undefined;
    }
  };

  public async nextTick() {
    await this.wrapper.vm.$nextTick();
  }
}
