import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import {h} from 'vue';
import ToggleButton from '@/client/components/common/ToggleButton.vue';

describe('ToggleButton', () => {
  it('renders a checkbox input with the correct name', () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: false, name: 'corporateEra'},
    });
    expect(wrapper.find('input[type="checkbox"]').attributes('name')).to.eq('corporateEra');
  });

  it('defaults id to name-checkbox', () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: false, name: 'corporateEra'},
    });
    expect(wrapper.find('input').attributes('id')).to.eq('corporateEra-checkbox');
    expect(wrapper.find('label').attributes('for')).to.eq('corporateEra-checkbox');
  });

  it('uses explicit id prop when provided', () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: false, name: 'base-cardType', id: 'base-tag-checkbox'},
    });
    expect(wrapper.find('input').attributes('id')).to.eq('base-tag-checkbox');
    expect(wrapper.find('label').attributes('for')).to.eq('base-tag-checkbox');
  });

  it('label has toggle-button class', () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: false, name: 'corporateEra'},
    });
    expect(wrapper.find('label').classes()).to.include('toggle-button');
  });

  it('emits update:modelValue when checkbox changes', async () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: false, name: 'corporateEra'},
    });
    const input = wrapper.find('input');
    (input.element as HTMLInputElement).checked = true;
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.[0]).to.deep.eq([true]);
  });

  it('reflects modelValue=true as checked on the input', () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: true, name: 'corporateEra'},
    });
    expect((wrapper.find('input').element as HTMLInputElement).checked).to.be.true;
  });

  it('renders slot content inside the label', () => {
    const wrapper = shallowMount(ToggleButton, {
      ...globalConfig,
      props: {modelValue: false, name: 'corporateEra'},
      slots: {default: () => h('span', 'Corporate Era')},
    });
    expect(wrapper.find('label').text()).to.include('Corporate Era');
  });
});
