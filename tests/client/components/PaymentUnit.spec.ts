import {shallowMount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import PaymentUnit from '@/client/components/PaymentUnit.vue';

describe('PaymentUnit', () => {
  it('renders modelValue in the input', () => {
    const wrapper = shallowMount(PaymentUnit, {
      ...globalConfig,
      props: {
        modelValue: 5,
        unit: 'megaCredits',
        description: 'MegaCredits',
      },
    });
    const input = wrapper.find('input');
    expect(input.element.value).to.eq('5');
  });

  it('emits update:modelValue on input change', async () => {
    const wrapper = shallowMount(PaymentUnit, {
      ...globalConfig,
      props: {
        modelValue: 0,
        unit: 'megaCredits',
        description: 'MegaCredits',
      },
    });
    const input = wrapper.find('input');
    await input.setValue('3');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).to.not.be.undefined;
    expect(emitted!.length).to.be.greaterThanOrEqual(1);
    expect(emitted![0][0]).to.eq('3');
  });

  it('plus and minus buttons emit correct events', async () => {
    const wrapper = shallowMount(PaymentUnit, {
      ...globalConfig,
      props: {
        modelValue: 5,
        unit: 'megaCredits',
        description: 'MegaCredits',
        showMax: true,
      },
    });
    const buttons = wrapper.findAllComponents({name: 'AppButton'});
    // Buttons are: minus, plus, max
    const minusBtn = buttons.find((b) => b.props('type') === 'minus');
    const plusBtn = buttons.find((b) => b.props('type') === 'plus');
    const maxBtn = buttons.find((b) => b.props('type') === 'max');

    expect(minusBtn).to.not.be.undefined;
    expect(plusBtn).to.not.be.undefined;
    expect(maxBtn).to.not.be.undefined;

    await minusBtn!.vm.$emit('click');
    expect(wrapper.emitted('minus')).to.not.be.undefined;

    await plusBtn!.vm.$emit('click');
    expect(wrapper.emitted('plus')).to.not.be.undefined;

    await maxBtn!.vm.$emit('click');
    expect(wrapper.emitted('max')).to.not.be.undefined;
  });
});
