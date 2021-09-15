import {createLocalVue, shallowMount, mount} from '@vue/test-utils';
import {getInputElement, click} from './utils/VueUtils';
import {expect} from 'chai';
import SelectNumber from '@/components/SelectNumber.vue';

function getLocalVue() {
  const localVue = createLocalVue();
  localVue.directive('trim-whitespace', {});
  localVue.directive('i18n', {});
  return localVue;
}

describe('SelectNumber', () => {
  it('shows result', () => {
    const wrapper = mount(SelectNumber, {
      localVue: getLocalVue(),
      propsData: {'value': 5},
    });

    expect(wrapper.props('value')).to.eq(5);
    expect(getInputElement(wrapper, 'textbox').value).to.eq('5');
  });

  it('plus works', async () => {
    const wrapper = mount(SelectNumber, {
      localVue: getLocalVue(),
      propsData: {'value': 5},
    });

    await click(wrapper, 'plus');

    expect(getInputElement(wrapper, 'textbox').value).to.eq('6');
  });

  it('plus does not exceed max', async () => {
    const wrapper = mount(SelectNumber, {
      localVue: getLocalVue(),
      propsData: {'value': 5, 'max': 7},
    });

    await click(wrapper, 'plus');
    expect(getInputElement(wrapper, 'textbox').value).to.eq('6');

    await click(wrapper, 'plus');
    expect(getInputElement(wrapper, 'textbox').value).to.eq('7');

    await click(wrapper, 'plus');
    expect(getInputElement(wrapper, 'textbox').value).to.eq('7');
  });

  it('minus works', async () => {
    const wrapper = mount(SelectNumber, {
      localVue: getLocalVue(),
      propsData: {'value': 5},
    });

    await click(wrapper, 'minus');

    expect(getInputElement(wrapper, 'textbox').value).to.eq('4');
  });

  it('minus does not exceed min', async () => {
    const wrapper = mount(SelectNumber, {
      localVue: getLocalVue(),
      propsData: {'value': 5, 'min': 3},
    });

    await click(wrapper, 'minus');
    expect(getInputElement(wrapper, 'textbox').value).to.eq('4');

    await click(wrapper, 'minus');
    expect(getInputElement(wrapper, 'textbox').value).to.eq('3');

    await click(wrapper, 'minus');
    expect(getInputElement(wrapper, 'textbox').value).to.eq('3');
  });
});
