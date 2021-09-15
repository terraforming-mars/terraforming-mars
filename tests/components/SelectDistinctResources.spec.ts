import {createLocalVue, shallowMount} from '@vue/test-utils';
import {click} from './utils/VueUtils';
import {expect} from 'chai';
import SelectDistinctResources from '@/components/SelectDistinctResources.vue';
import {Units} from '@/Units';

function getLocalVue() {
  const localVue = createLocalVue();
  localVue.directive('trim-whitespace', {});
  localVue.directive('i18n', {});
  return localVue;
}

describe('SelectDistinctResources', () => {
  it('simple save', () => {
    let savedData: Array<Array<string>> | undefined;

    const wrapper = shallowMount(SelectDistinctResources, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {amount: 2},
        showsave: true,
        showtitle: true,
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
      },
    });

    click(wrapper, 'save');
    expect(savedData).to.deep.eq([[JSON.stringify(Units.EMPTY)]]);
    expect(wrapper.vm.warning).is.undefined;
  });

  it('reject indistinct bonuses', () => {
    let savedData: Array<Array<string>> | undefined;

    const wrapper = shallowMount(SelectDistinctResources, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {amount: 2},
        showsave: true,
        showtitle: true,
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
      },
    });

    wrapper.vm.megacredits = 2;

    click(wrapper, 'save');
    expect(savedData).is.undefined;
    expect(wrapper.vm.warning).eq('Each resource must be distinct');
  });

  it('reject too many bonuses', () => {
    let savedData: Array<Array<string>> | undefined;

    const wrapper = shallowMount(SelectDistinctResources, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {amount: 2},
        showsave: true,
        showtitle: true,
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
      },
    });

    wrapper.vm.heat = 1;
    wrapper.vm.plants = 1;
    wrapper.vm.titanium = 1;

    click(wrapper, 'save');
    expect(savedData).is.undefined;
    expect(wrapper.vm.warning).eq('Gain no more than 2 distinct resources');
  });

  it('good save', () => {
    let savedData: Array<Array<string>> | undefined;

    const wrapper = shallowMount(SelectDistinctResources, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {amount: 3},
        showsave: true,
        showtitle: true,
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
      },
    });

    wrapper.vm.heat = 1;
    wrapper.vm.plants = 1;
    wrapper.vm.titanium = 1;

    click(wrapper, 'save');
    expect(savedData).to.deep.eq([[JSON.stringify(Units.of({heat: 1, plants: 1, titanium: 1}))]]);
    expect(wrapper.vm.warning).is.undefined;
  });
});
